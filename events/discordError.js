const { Listener } = require('discord-akairo');

const logger = require('../logger');

class DiscordError extends Listener {
  constructor() {
    super('discordError', {
      emitter: 'client',
      event: 'error',
    });
  }

  exec(err) {
    logger.error(err);
  }
}

module.exports = DiscordError;
