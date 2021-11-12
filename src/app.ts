import Discord from './discord';
import Mongo from './mongo';
import Twitch from './twitch';

export const discord = new Discord();
export const mongo = new Mongo();
export const twitch = new Twitch();

(async () => {
  await discord.connect();
  await mongo.connect();
  await twitch.connect();
})();
