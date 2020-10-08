const { Listener } = require('discord-akairo');

const logger = require('../logger');

class DiscordWarning extends Listener {
  constructor() {
    super('discordWarning', {
      emitter: 'client',
      event: 'warn',
    });
  }

  exec(err) {
    logger.warn(err);
  }
}

module.exports = DiscordWarning;
