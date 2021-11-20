import { Client, Guild, Intents } from 'discord.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import config from '../config';
import { logger } from '../utils/logger';
import { loggerCommand } from './command';

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', (e) => {
  e.guilds.cache.map((guild: Guild) => {
    logger.info(`Discord: Connected on server ${guild.name}`);

    const subcommand = (cmd: SlashCommandSubcommandBuilder, type: string) => {
      return cmd
        .setName(type)
        .setDescription(`${type.toUpperCase()} a channel`)
        .addStringOption((option) =>
          option.setName('channel').setDescription(`The channel to ${type.toUpperCase()}`).setRequired(true)
        );
    };

    const command = new SlashCommandBuilder()
      .setName('logger')
      .setDescription('Make the logger JOIN or PART a channel')
      .addSubcommand((cmd) => subcommand(cmd, 'join'))
      .addSubcommand((cmd) => subcommand(cmd, 'part'));

    guild.commands.create(command.toJSON());
  });
});

client.on('interactionCreate', async (i) => {
  if (i.isCommand()) {
    await loggerCommand(i);
  }
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
