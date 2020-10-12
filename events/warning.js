const { Event } = require('../libs/event');

const logger = require('../logger');

class Warning extends Event {
  constructor() {
    super('warning', 'process');
  }

  exec(err) {
    logger.warn(err);
  }
}

module.exports = Warning;
