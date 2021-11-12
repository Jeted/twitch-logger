import Mongo from './mongo';
import Twitch from './twitch';

export const mongo = new Mongo();
export const twitch = new Twitch();

(async () => {
  await mongo.connect();
  await twitch.connect();
})();
