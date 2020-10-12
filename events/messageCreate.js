const { Event } = require('../libs/event');
const { readFileSync } = require('fs');
const { parse } = require('toml');
const ms = require('ms');

let { muted, spamLimit, spamCleanup, spamTimeout, spamDisabled } = parse(
  readFileSync('config.toml')
);

spamCleanup = ms(spamCleanup);
spamTimeout = ms(spamTimeout);

let msgs = {};

setInterval(() => (msgs = {}), spamCleanup);

class MessageCreate extends Event {
  constructor() {
    super('messageCreate', 'client');
  }

  exec(msg) {
    if (msg.author.bot) return; //checks if its a bot
    if (spamDisabled) return;

    msgs[msg.author.id] = msgs[msg.author.id] ? msgs[msg.author.id] + 1 : 1;


    const member = msg.member;

    if (msgs[msg.author.id] >= spamLimit) {
      member.addRole(muted, 'Auto-mod; spam');

      msg.channel.createMessage(
        `${member.user.mention} has been muted for ${ms(spamTimeout, {
          long: true,
        })} for spam.`
      );


      
      setTimeout(() => {
        msgs[msg.author.id] = 0;
        member.removeRole(muted, 'Auto-mod; unmute');
      }, spamTimeout);
    }
  }
}

module.exports = MessageCreate;
