//const winston = require('winston');


const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'debug',    //minimum level (error, warn, info, http, verbose, debug, silly)
  format: myFormat
  //combine( label({ label: 'logger' }), timestamp(), myFormat )
  //format.json(),    //.simple()
  //defaultMeta: { service: 'user-service' },
  , transports: [
    //new winston.transports.File({ filename: 'error.log', level: 'error' }) // - Write all logs with importance level of `error` or less to `error.log`
    //, new winston.transports.File({ filename: 'combined.log' }) // - Write all logs with importance level of `info` or less to `combined.log`
    new transports.Console()
  ],
});