const { AkairoClient, CommandHandler } = require('discord-akairo');

require('dotenv').config();

class Bot extends AkairoClient {
  constructor() {
    super({
      ownerID: '525840152103223338',
    });

    this.commandHandler = new CommandHandler(this, {
      directory: './commands/',
      prefix: ['`', '='],
    });

    this.commandHandler.loadAll();
  }
}

const bot = new Bot();

bot.on('ready', () => {
  console.log('Bot is ready!');
});

bot.login(process.env.TOKEN);
