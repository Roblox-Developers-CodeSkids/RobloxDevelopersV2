const { Command } = require('discord-akairo');
const ms = require('ms');

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

    let mmber = args.member;

    // let mainrole = msg.guild.roles.cache.find(role => role.name  === "ROLENAMEHERE")
    let MuteRole = msg.guild.roles.cache.get("484337500333277214");  //replace with server role id 

    if(!MuteRole) return msg.reply("Cant find the Mute Role!");

    let time = args.time;

    //person.roles.remove(mainrole.id);
    mmber.roles.add(MuteRole.id); 
    msg.channel.send(`@${mmber.user.tag} has been muted for ${ms(ms(time))}`)

    setTimeout(function(){
        //person.roles.add(mainrole.id)
        mmber.roles.remove(MuteRole.id) //removes mute role
        msg.channel.send(`@${mmber.user.tag} has been unmuted`);

    }, ms(time));
  }
}

module.exports = MuteCommand;
