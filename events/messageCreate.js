const { Event } = require('../libs/event');

const { parse } = require('toml');
const { readFileSync } = require('fs');

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

    if (msgs[msg.author.id] >= spamLimit) {
      msg.member.roles.add(muted, 'Auto-mod; spam');

      msg.channel.send(
        `${msg.author.tag} has been muted for ${ms(spamTimeout, {
          long: true,
        })} for spam.`
      );

      setTimeout(() => {
        msgs[msg.author.id] = 0;
        msg.member.roles.remove(muted, 'Auto-mod; unmute');
      }, spamTimeout);
    }
  }
}

module.exports = MessageCreate;
