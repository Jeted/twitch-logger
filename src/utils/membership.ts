import { mongo } from '../app';
import logger from '../misc/logger';
import { params } from '../misc/enums';

interface MembershipBuffer {
  [event: string]: Record<string, string[]>;
}

const buffer: MembershipBuffer = {
  join: {},
  part: {},
};

setInterval(() => {
  Object.entries(buffer).forEach(([event, channels]) => {
    Object.entries(channels).forEach(async ([channel, array]) => {
      if (array.length) {
        const channelId = await mongo.channelId(channel);

        if (channelId) {
          const users = array.sort();
          buffer[event][channel] = [];

          await mongo.insertLog(event, channelId, {
            [params.membership]: users,
          });
        } else {
          logger.error(`Unable to fetch ID for channel ${channel}`);
        }
      }
    });
  });
}, 60000);

export function pushMembership(event: string, channel: string, user: string) {
  if (!buffer[event][channel]) {
    buffer[event][channel] = [];
  }
  buffer[event][channel].push(user);
}
