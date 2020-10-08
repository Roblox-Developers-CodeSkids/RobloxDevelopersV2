const { Listener } = require('discord-akairo');

const logger = require('../logger');

class UncaughtException extends Listener {
  constructor() {
    super('uncaughtException', {
      emitter: 'process',
      event: 'uncaughtException',
    });
  }

  exec(err) {
    logger.error(err);
  }
}

module.exports = UncaughtException;
