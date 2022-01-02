import Discord from './discord';
import Mongo from './mongo';
import Twitch from './twitch';

(async () => {
  await Discord.connect();
  await Mongo.connect();
  await Twitch.connect();
})();
