const { Event } = require('../libs/event');

const logger = require('../logger');

class DiscordWarning extends Event {
  constructor() {
    super('discordWarning', 'client');
  }

  exec(err) {
    logger.warn(err);
  }
}

module.exports = DiscordWarning;
