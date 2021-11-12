import mongoose from 'mongoose';
import config from '../config';
import logger from '../misc/logger';

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
}

export default Mongo;
