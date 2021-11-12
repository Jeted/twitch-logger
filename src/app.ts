import Twitch from './twitch';

export const twitch = new Twitch();

(async () => {
  await twitch.connect();
})();
