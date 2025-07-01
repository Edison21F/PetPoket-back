import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment-timezone';

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const timezonedFormat = winston.format.printf(({ level, message, context }) => {
  const localTime = moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');
  return `[${localTime}] ${level.toUpperCase()}${context ? ` [${context}]` : ''}: ${message}`;
});

const fileTransport = new winston.transports.File({
  filename: path.join(logDir, 'application.log'),
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    timezonedFormat
  ),
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    timezonedFormat
  ),
});

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    ...(process.env.NODE_ENV !== 'production' ? [consoleTransport] : []),
    fileTransport,
  ],
};