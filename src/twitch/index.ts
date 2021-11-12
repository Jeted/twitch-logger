import { ChatClient } from '@twurple/chat';
import { mongo } from '../app';
import logger from '../misc/logger';
import { params } from '../misc/enums';
import { parseSubInfo, parseTags } from '../utils/parsers';

const chat = new ChatClient({
  channels: ['jeted'],
  logger: {
    emoji: false,
    minLevel: 'info',
  },
  requestMembershipEvents: true,
});

chat.onMessage(async (channel, user, message, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const messageType = tags.isCheer ? 'cheer' : 'chat';

  await mongo.insertLog(channelId, {
    ...userInfo,
    [params.message]: message,
    [params.messageType]: messageType,
  });
});

chat.onSub(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { subInfo } = parseSubInfo(chatSubInfo);

  await mongo.insertLog(channelId, {
    ...userInfo,
    [params.subInfo]: subInfo,
    [params.messageType]: 'sub',
  });
});

chat.onResub(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { message, subInfo } = parseSubInfo(chatSubInfo);

  await mongo.insertLog(channelId, {
    ...userInfo,
    ...(message && { [params.message]: message }),
    [params.subInfo]: subInfo,
    [params.messageType]: 'resub',
  });
});

chat.onSubGift(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { subInfo } = parseSubInfo(chatSubInfo);

  await mongo.insertLog(channelId, {
    ...userInfo,
    [params.subInfo]: subInfo,
    [params.messageType]: 'subgift',
  });
});

chat.onMessageRemove(async (channel, messageId, tags) => {
  const result = await mongo.channels.findOne({
    login: channel.replace('#', ''),
  });

  if (result) {
    await mongo.logs(result.userId).updateOne(
      {
        [params.messageId]: messageId,
      },
      {
        $set: {
          [params.messageType]: 'deleted',
        },
      }
    );
  }
});

chat.onTimeout(async (channel, user, duration, msg) => {
  await mongo.insertLog(msg.channelId, {
    [params.userId]: Number(msg.targetUserId),
    [params.login]: user,
    [params.duration]: duration,
    [params.messageType]: 'timeout',
  });
});

chat.onBan(async (channel, user, msg) => {
  await mongo.insertLog(msg.channelId, {
    [params.userId]: Number(msg.targetUserId),
    [params.login]: user,
    [params.messageType]: 'ban',
  });
});

chat.onJoin((channel, user) => {
  if (user.includes('justinfan')) {
    logger.info(`Twitch: Connected ${channel}`);
  }
});

chat.onPart((channel, user) => {});

class Twitch {
  async connect() {
    try {
      await chat.connect();
    } catch (e) {
      logger.error('Twitch error', e);
      process.exit(1);
    }
  }
}

export default Twitch;
