import mongoose from 'mongoose';
import config from '../config';
import logger from '../misc/logger';
import { params } from '../misc/enums';
import { getUserByLogin } from '../utils/requests';
import { channelSchema, logSchema } from './schemas';
import type { Channel, Log } from '../misc/interfaces';

class Mongo {
  public async connect() {
    try {
      await mongoose.connect(config.MONGODB_URI, {
        dbName: config.MONGODB_DATABASE,
      });
      logger.info('MongoDB: Connected');
    } catch (e) {
      logger.error('MongoDB error', e);
      process.exit(1);
    }
  }

  get channels() {
    return mongoose.model<Channel>('channels', channelSchema);
  }

  logs(channelId: string) {
    return mongoose.model<Log>(channelId, logSchema);
  }

  async insertLog(messageType: string, channelId: string, data: Partial<Log>) {
    await this.logs(channelId).create({
      date: new Date(),
      ...data,
      [params.messageType]: messageType,
    });
  }

  async channelId(room: string) {
    const channel = room.replace('#', '');
    const result = await this.channels.findOne({ login: channel });

    if (!result) {
      const user = await getUserByLogin(channel);

      if (user) {
        await this.channels.updateOne(
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

        return user.userId;
      }

      return null;
    }

    return result.userId;
  }
}

export default Mongo;
