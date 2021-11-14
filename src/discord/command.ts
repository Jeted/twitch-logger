import { CommandInteraction } from 'discord.js';
import { getUserByLogin } from '../utils/requests';

export async function loggerCommand(i: CommandInteraction) {
  await i.deferReply({
    ephemeral: true,
  });

  const typeParam = i.options.getSubcommand();
  const channelParam = i.options.getString('channel', true);

  const user = await getUserByLogin(channelParam);

  if (user) {
    switch (typeParam) {
      case 'join':
        break;
      case 'part':
        break;
    }
  } else {
    i.editReply({
      content: `Channel #${channelParam} is either suspended or does not exist.`,
    });
  }
}
