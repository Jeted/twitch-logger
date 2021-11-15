import { ChatClient } from '@twurple/chat';
import { mongo } from '../app';
import logger from '../misc/logger';
import { params } from '../misc/enums';
import { pushMembership } from '../utils/membership';
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

  await mongo.insertLog(messageType, channelId, {
    ...userInfo,
    [params.message]: message,
  });
});

chat.onSub(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { subInfo } = parseSubInfo(chatSubInfo);

  await mongo.insertLog('sub', channelId, {
    ...userInfo,
    [params.subInfo]: subInfo,
  });
});

chat.onResub(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { message, subInfo } = parseSubInfo(chatSubInfo);

  await mongo.insertLog('resub', channelId, {
    ...userInfo,
    ...(message && { [params.message]: message }),
    [params.subInfo]: subInfo,
  });
});

chat.onSubGift(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { subInfo } = parseSubInfo(chatSubInfo);

  await mongo.insertLog('subgift', channelId, {
    ...userInfo,
    [params.subInfo]: subInfo,
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
  await mongo.insertLog('timeout', msg.channelId, {
    [params.userId]: Number(msg.targetUserId),
    [params.login]: user,
    [params.duration]: duration,
  });
});

chat.onBan(async (channel, user, msg) => {
  await mongo.insertLog('ban', msg.channelId, {
    [params.userId]: Number(msg.targetUserId),
    [params.login]: user,
  });
});

chat.onJoin((channel, user) => {
  if (user.includes('justinfan')) {
    logger.info(`Twitch: Joined ${channel}`);
  } else {
    pushMembership('join', channel, user);
  }
});

chat.onPart((channel, user) => {
  if (user.includes('justinfan')) {
    logger.info(`Twitch: Parted ${channel}`);
  } else {
    pushMembership('part', channel, user);
  }
});

class Twitch {
  async connect() {
    try {
      await chat.connect();
    } catch (e) {
      logger.error('Twitch error', e);
      process.exit(1);
    }
  }

  async join(channel: string) {
    await chat.join(channel).catch(() => {
      logger.error(`Twitch: Already joined channel`);
    });
  }

  async part(channel: string) {
    chat.part(channel);
  }
}

export default Twitch;
