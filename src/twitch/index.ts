import { ChatClient } from '@twurple/chat';
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
});

chat.onSub(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const subInfo = parseSubInfo(chatSubInfo);
});

chat.onResub(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const subInfo = parseSubInfo(chatSubInfo);
  const message = subInfo[params.message];
});

chat.onSubGift(async (channel, user, chatSubInfo, tags) => {
  const { channelId, userInfo } = parseTags(tags);
  const subInfo = parseSubInfo(chatSubInfo);
});

chat.onMessageRemove(async (channel, messageId, tags) => {});

chat.onTimeout(async (channel, user, duration) => {});

chat.onBan(async (channel, user) => {});

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
