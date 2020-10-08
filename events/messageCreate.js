const { Listener } = require('discord-akairo');

const { parse } = require('toml');
const { readFileSync } = require('fs');

const ms = require('ms');

let { muted, spamLimit, spamCleanup, spamTimeout } = parse(
  readFileSync('config.toml')
);

spamCleanup = ms(spamCleanup);
spamTimeout = ms(spamTimeout);

let msgs = {};

setInterval(() => (msgs = {}), spamCleanup);

class MessageCreate extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'message',
    });
  }

  exec(msg) {
    if (msg.author.bot) return; //checks if its a bot

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
