// src/common/logger.ts
import * as winston from 'winston';

// Define your logger configuration
const logger = winston.createLogger({
  level: 'info', // Set log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to file
  ],
});

export default logger;
