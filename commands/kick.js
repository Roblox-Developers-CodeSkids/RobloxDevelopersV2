const { Command } = require('discord-akairo');

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick', 'yeet'],
      args: [
        {
          id: 'member',
          type: 'member',
        },
        {
          id: 'reason',
          type: 'string',
          quoted: false,
          default: 'He was meanie!',
        },
      ],
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      channel: 'guild',
    });
  }
  async exec(msg, args) {
    if (!args.member) return msg.reply('No member found');

    if (!args.member.kickable) return msg.reply('I cannot kick this member!');

    await args.member.kick();

    return msg.reply(`${args.member} was kicked for ${args.reason}!`);
  }
}

module.exports = KickCommand;
