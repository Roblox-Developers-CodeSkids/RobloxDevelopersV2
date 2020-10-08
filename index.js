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





//bot automod here

const usersMap = new Map();
const spamlimit = 5;
const TIME = 5000;
const DIFF = 2500;

bot.on('message', (message) => {
  if (message.author.bot) return; //checks if its a bot

  if (usersMap.has(message.author.id)) {
    //checks if they are in cooldown
    const userD = usersMap.get(message.author.id); //sets usermap to a variable
    const { lastMessage, timer } = userD;
    const diffrence = message.createdTimestamp - lastMessage.createdTimestamp; //tells the difreence between new message and last created message
    let msgCount = userD.msgCount; ///checks the amout of messages
    // increses the message count

    if (diffrence > DIFF) {
      //resets the timeout (threshhold)
      clearTimeout(timer);
      console.log('CLEARED TIMEOUT');
      userD.msgCount = 1;
      userD.lastMessage = message;
      userD.timer = setTimeout(() => {
        usersMap.delete(message.author.id); //REMOVED FROM RESET
      }, TIME);
      usersMap.set(message.author.id, userD);
    } else {
      msgCount++;
      if (parseInt(msgCount) === spamlimit) {
        //you can change it
        const muterole = message.guild.roles.cache.get('484337500333277214'); //gets the role change it for your server!  484337500333277214
        message.member.roles.add(muterole); //addes the role!
        message.channel.send('You have been muted!'); //tells them they are muted!
        setTimeout(() => {  //unmutes them
          message.member.roles.remove(muterole); //remotes the mute role
          message.channel.send(`${message.member.user.tag} has been unmuted`)
        }, 10000)  //can change this to your unmute delay!
      } else {
        userD.msgCount = msgCount; //updates msgcount
        usersMap.set(message.author.id, userD); //replaces the object
      }
    }
  } else {
    let fn = setTimeout(() => {
      usersMap.delete(message.author.id);
    }, 5000); //sends x amout of messeges in 5000ms or 5 secs
    usersMap.set(message.author.id, {
      //sets the map for new user
      msgCount: 1,
      lastMessage: message,
      timer: fn,
    });
  }
});

//end of bot automod






bot.login(process.env.TOKEN);
