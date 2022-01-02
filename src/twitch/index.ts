import { ChatClient } from '@twurple/chat';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import Mongo from '../mongo';
import { params } from '../misc/enums';
import { logger } from '../utils/logger';
import { objProp } from '../utils/helpers';
import { pushMembership } from '../utils/membership';
import { parseSubInfo, parseTags } from '../utils/parsers';
import { loggedChannels as channels } from '../utils/channels';

const chat = new ChatClient({
  channels,
  logger: {
    emoji: false,
    minLevel: 'info',
  },
  requestMembershipEvents: true,
});

const handlePrivMsg = async (event: string, message: string, tags: TwitchPrivateMessage) => {
  const { channelId, userInfo } = parseTags(tags);
  await Mongo.insertLog(event, channelId, {
    ...userInfo,
    ...objProp(params.bits, tags.bits),
    [params.message]: message,
  });
};

chat.onAction((...data) => handlePrivMsg('action', data[2], data[3]));

chat.onMessage((...data) => handlePrivMsg('chat', data[2], data[3]));

chat.onSub(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { subInfo } = parseSubInfo(chatSubInfo);

  await Mongo.insertLog('sub', channelId, {
    ...userInfo,
    [params.subInfo]: subInfo,
  });
});

chat.onResub(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { message, subInfo } = parseSubInfo(chatSubInfo);

  await Mongo.insertLog('resub', channelId, {
    ...userInfo,
    ...objProp(params.message, message),
    [params.subInfo]: subInfo,
  });
});

chat.onSubGift(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const { subInfo } = parseSubInfo(chatSubInfo, user);

  await Mongo.insertLog('subgift', channelId, {
    ...userInfo,
    [params.subInfo]: subInfo,
  });
});

chat.onMessageRemove(async (channel, messageId, tags) => {
  const channelId = await Mongo.channelId(channel);

  if (channelId) {
    await Mongo.logs(channelId)
      .findOneAndUpdate(
        {
          [params.login]: tags.userName,
          [params.message]: tags.params.message,
          [params.messageType]: {
            $nin: ['deleted'],
          },
        },
        {
          $set: {
            [params.messageType]: 'deleted',
          },
        }
      )
      .sort({ $natural: -1 });
  }
});

chat.onTimeout(async (channel, user, duration, msg) => {
  await Mongo.insertLog('timeout', msg.channelId, {
    [params.userId]: Number(msg.targetUserId),
    [params.login]: user,
    [params.duration]: duration,
  });
});

chat.onBan(async (channel, user, msg) => {
  await Mongo.insertLog('ban', msg.channelId, {
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

export default new Twitch();
