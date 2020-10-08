const { Listener } = require('discord-akairo');

const logger = require('../logger');

class Warning extends Listener {
  constructor() {
    super('warning', {
      emitter: 'process',
      event: 'warning',
    });
  }

  exec(err) {
    logger.warn(err);
  }
}

module.exports = Warning;
