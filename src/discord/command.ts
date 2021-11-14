import { CommandInteraction } from 'discord.js';
import { mongo, twitch } from '../app';
import { getUserByLogin } from '../utils/requests';

export async function loggerCommand(i: CommandInteraction) {
  await i.deferReply({
    ephemeral: true,
  });

  const typeOption = i.options.getSubcommand();
  const channelOption = i.options.getString('channel', true);

  const user = await getUserByLogin(channelOption);

  if (user) {
    const channel = await mongo.channels.findOne({ userId: user.userId });
    switch (typeOption) {
      case 'join':
        if (channel) {
          if (channel.isLogged) {
            return i.editReply({
              content: `Channel #${channel.login} is already logged.`,
            });
          } else {
            await mongo.channels.updateOne({ userId: user.userId }, { $set: { isLogged: true } });
          }
        } else {
          await mongo.channels.create({
            userId: user.userId,
            login: user.login,
            displayName: user.displayName,
            isLogged: true,
          });
        }
        twitch.join(user.login).then(() => {
          i.editReply({
            content: `Joined #${user.login}`,
          });
        });
        break;
      case 'part':
        break;
    }
  } else {
    i.editReply({
      content: `Channel #${channelOption} is either suspended or does not exist.`,
    });
  }
}
