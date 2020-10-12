const { Client } = require('yuuko');
const { join } = require('path');

const { readdirSync } = require('fs');

const logger = require('./logger');

require('dotenv').config();

const bot = new Client({
  token:
    process.env.NODE_ENV == 'production'
      ? process.env.TOKEN
      : process.env.DEVELOPMENT,
  allowMention: true,
  prefix: process.env.NODE_ENV == 'production' ? ',' : 'dev;',
  defaultCommand: require('./commands/hello'),
});

bot.addCommandDir(join(__dirname, 'commands'));

for (let file of readdirSync(join(__dirname, 'events'))) {
  let event = require(`./events/${file.substring(0, file.length - 3)}`);

  if (event) {
    let constructed = new event();
    constructed.register(bot);
    constructed.client = bot;
    logger.debug(
      `Listening to ${constructed.listener}.${constructed.toListen}`
    );
  }
}

bot.connect().then(() => {
  bot.editStatus('online', {
    name: `${bot.prefix}help${
      process.env.NODE_ENV == 'production' ? '' : ' | development mode!'
    }`,
    type: 3,
    url: 'https://twitch.tv/lua',
  });
});
