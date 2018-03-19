import { Logger, LoggerInstance, transports } from 'winston';

const timestampFormat: () => string = (): string => (new Date()).toLocaleTimeString();

/**
 * Winston logging instance
 */
const logger: LoggerInstance = new Logger({
  transports: [
    // Console Logger Settings
    new transports.Console({
      timestamp: timestampFormat,
      colorize: true,
      silent: false,
      prettyPrint: true,
      level: 'debug'
    })
  ],
  exitOnError: false,
  colors: {
    trace: 'white',
    debug: 'green',
    info: 'blue',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
  }
});

export { logger };
