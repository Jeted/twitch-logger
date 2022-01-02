import Mongo from '../mongo';
import { getUsersById } from './requests';

export async function loggedChannels() {
  const channels = await Mongo.channels.find({ isLogged: true });
  const userIds = channels.map((channel) => channel.userId);

  const logins: string[] = [];

  for (let i = 0; i < userIds.length; i += 100) {
    const chunk = userIds.slice(i, i + 100);
    const users = await getUsersById(chunk);

    for (const user of users) {
      const channel = channels.find((channel) => channel.userId === user.userId)!;
      const userRename = user.login !== channel.login;

      if (userRename) {
        await Mongo.channels.updateOne(
          {
            userId: user.userId,
          },
          {
            $set: {
              login: user.login,
              displayName: user.displayName,
            },
          }
        );
      }

      logins.push(user.login);
    }
  }

  return logins.sort();
}
