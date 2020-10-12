const { Event } = require('../libs/event');

const logger = require('../logger');

class UncaughtException extends Event {
  constructor() {
    super('uncaughtException', 'process');
  }

  exec(err, stack) {
    logger.error(err, stack);
  }
}

module.exports = UncaughtException;
