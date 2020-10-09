const { Command } = require('discord-akairo');
const ms = require('ms');
const { parse } = require('toml');
const { readFileSync } = require('fs');

let { muted } = parse(readFileSync('config.toml'));

class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mute', 'getmuted'],
      args: [
        {
          id: 'member',
          type: 'member',
        },
        {
          id: 'time',
          type: 'string',
          default: false,
        },
      ],
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['MANAGE_ROLES'],
      channel: 'guild',
    });
  }

  async exec(msg, args) {
    if (!args.member) return msg.reply('No member found');

    if (!args.time) return msg.reply('Please Specify a time!');

    let member = args.member;

    // let mainrole = msg.guild.roles.cache.find(role => role.name  === "ROLENAMEHERE")
    //replace with server role id

    if (!muted) return msg.reply('Cant find the Mute Role!');

    let time = args.time;

    //person.roles.remove(mainrole.id);
    member.roles.add(muted);
    msg.channel.send(`@${member.user.tag} has been muted for ${ms(ms(time))}`);

    setTimeout(function () {
      //person.roles.add(mainrole.id)
      member.roles.remove(muted); //removes mute role
      msg.channel.send(`@${member.user.tag} has been unmuted`);
    }, ms(time));
  }
}

module.exports = MuteCommand;
