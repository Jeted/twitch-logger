import { Client, Intents } from 'discord.js';
import type { Guild } from 'discord.js';
import config from '../config';
import logger from '../misc/logger';

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ['MESSAGE', 'CHANNEL'],
});

client.on('ready', (e) => {
  e.guilds.cache.map((guild: Guild) => {
    logger.info(`Discord: Connected on server ${guild.name}`);
  });
});

class Discord {
  async connect() {
    try {
      await client.login(config.DISCORD_BOT_TOKEN);
    } catch (e) {
      logger.error('Discord error', e);
      process.exit(1);
    }
  }
}

export default Discord;
