import { config } from './key';

export const sqlConfig = {
  host: config.MYSQL.HOST,
  port: config.MYSQL.PORT,
  username: config.MYSQL.USER,
  password: config.MYSQL.PASSWORD,
  database: config.MYSQL.DATABASE,
};