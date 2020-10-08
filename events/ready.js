const { Listener } = require('discord-akairo');

const logger = require('../logger');

class OnReady extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  exec() {
    logger.info('Connected to Discord');
  }
}

module.exports = OnReady;
