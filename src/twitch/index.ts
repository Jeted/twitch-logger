import logger from '../misc/logger';
import { ChatClient } from '@twurple/chat';

const chat = new ChatClient({
  channels: ['jeted'],
  logger: {
    emoji: false,
    minLevel: 'info',
  },
  requestMembershipEvents: true,
});

chat.onJoin((channel, user) => {
  if (user.includes('justinfan')) {
    logger.info(`Twitch: Connected ${channel}`);
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
}

export default Twitch;
