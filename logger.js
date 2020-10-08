const {
  createLogger,
  format,
  transports,
  config: {
    npm: { colors },
  },
} = require('winston');

const chalk = require('chalk');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  //defaultMeta: { service: 'Mr-Roblox-Developers' },
  transports: [new transports.File({ filename: './logs/bot.log' })],
});

const formatter = format.printf(({ level, message, timestamp }) => {
  let levels = {
    error: '[ERROR]   ',
    warn: '[WARNING] ',
    info: '[INFO]    ',
    http: '[HTTP]    ',
    verbose: '[VERBOSE] ',
    debug: '[DEBUG]   ',
    silly: '[SILLY]   ',
  };

  for (code in levels) {
    levels[code] = chalk[colors[code]](levels[code]);
  }

  return `${timestamp} | ${levels[level]} | ${message}`;
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(formatter),
    })
  );
}

module.exports = logger;
