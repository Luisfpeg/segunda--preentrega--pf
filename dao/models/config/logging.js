// config/logging.js

const winston = require('winston');
const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.File({
      filename: 'errors.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json())
    })
  );
}

module.exports = logger;
