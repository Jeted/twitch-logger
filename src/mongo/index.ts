import mongoose from 'mongoose';
import config from '../config';
import logger from '../misc/logger';
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
}

export default Mongo;
