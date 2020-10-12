const { Event } = require('../libs/event');

const logger = require('../logger');

class OnReady extends Event {
  constructor() {
    super('ready', 'client');
  }

  exec() {
    logger.info('Connected to Discord');
  }
}

module.exports = OnReady;
