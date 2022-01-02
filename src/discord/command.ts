import { CommandInteraction } from 'discord.js';
import Mongo from '../mongo';
import Twitch from '../twitch';
import { getUserByLogin } from '../utils/requests';

export async function loggerCommand(i: CommandInteraction) {
  await i.deferReply({
    ephemeral: true,
  });

  const typeOption = i.options.getSubcommand();
  const channelOption = i.options.getString('channel', true);

  const user = await getUserByLogin(channelOption);

  if (user) {
    const channel = await Mongo.channels.findOne({ userId: user.userId });
    switch (typeOption) {
      case 'join':
        if (channel) {
          if (channel.isLogged) {
            return i.editReply({
              content: `Channel #${channel.login} is already logged.`,
            });
          } else {
            await Mongo.channels.updateOne({ userId: user.userId }, { $set: { isLogged: true } });
          }
        } else {
          await Mongo.channels.create({
            userId: user.userId,
            login: user.login,
            displayName: user.displayName,
            isLogged: true,
          });
        }
        Twitch.join(user.login).then(() => {
          i.editReply({
            content: `Joined #${user.login}`,
          });
        });
        break;
      case 'part':
        if (channel) {
          if (channel.isLogged) {
            await Mongo.channels.updateOne({ userId: user.userId }, { $set: { isLogged: false } });
            return Twitch.part(user.login).then(() => {
              i.editReply({
                content: `Parted #${user.login}`,
              });
            });
          }
        }
        i.editReply({
          content: `Channel #${user.login} is not logged.`,
        });
        break;
    }
  } else {
    i.editReply({
      content: `Channel #${channelOption} is either suspended or does not exist.`,
    });
  }
}
