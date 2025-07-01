import { config } from './key';

export const mongoConfig = {
  uri: config.MONGODB.URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
