const { Command } = require('yuuko');
const ms = require('ms');
const { readFileSync } = require('fs')
const { parse } = require('toml')



let { muted } = parse(readFileSync('config.toml'));

module.exports = new Command('mute', async (message, args) => {
  if (!args[0]) return message.channel.createMessage("Can't find the member");
  const member = message.member;
      //role 484337500333277214

  if (args[1]) {
    let time = args[1];
    member.addRole(muted);
    message.channel.createMessage(`@${member.user.mention} has been muted for ${ms(ms(time))}`);

    setTimeout(function () {
      member.removeRole(muted); //removes mute role
      message.channel.createMessage(`@${member.user.mention} has been unmuted`);
    }, ms(time));
  }else{
    member.addRole(muted);
    message.channel.createMessage(`@${member.user.mention} has been muted`);
  }
});
