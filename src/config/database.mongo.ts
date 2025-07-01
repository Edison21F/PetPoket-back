import { config } from './key';

export const mongoUri = config.MONGODB.URI;

export const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
