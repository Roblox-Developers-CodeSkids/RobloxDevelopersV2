const { Event } = require('../libs/event');

const logger = require('../logger');

class DiscordError extends Event {
  constructor() {
    super('discordError', 'client');
  }

  exec(err) {
    logger.error(err);
  }
}

module.exports = DiscordError;
