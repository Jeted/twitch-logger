import { ChatClient } from '@twurple/chat';
import logger from '../misc/logger';

const chat = new ChatClient({
  channels: ['jeted'],
  logger: {
    emoji: false,
    minLevel: 'info',
  },
  requestMembershipEvents: true,
});

chat.onMessage(async (channel, user, message, tags) => {});

chat.onSub(async (channel, user, chatSubInfo, tags) => {});

chat.onResub(async (channel, user, chatSubInfo, tags) => {});

chat.onSubGift(async (channel, user, chatSubInfo, tags) => {});

chat.onMessageRemove(async (channel, message, tags) => {});

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
