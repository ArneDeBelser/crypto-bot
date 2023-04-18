import { createLogger, transports } from 'winston';
import { format } from 'logform';
import fs from 'fs';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => {
            return `[${info.timestamp}] ${info.message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' })
    ]
});

// create a writable stream to the log file
const logStream = fs.createWriteStream('logs/app.log', { flags: 'a' });

// define a new logInfo() function that logs to both console and Winston
global.logInfo = function () {
    const args = Array.from(arguments);
    logger.info.apply(logger, args);
};

export { logger };
