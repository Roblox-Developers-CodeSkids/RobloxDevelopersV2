const { Command } = require('yuuko');

function clean(text) {
  if (typeof text === 'string')
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  else return text;
}

module.exports = new Command(['eval'], async (message, args, { client }) => {
  if (message.author.id != '525840152103223338') return;

  try {
    const code = args.join(' ');
    let res = eval(code);

    if (typeof res !== 'text') res = require('util').inspect(res);

    message.channel.createMessage(clean(res));
  } catch (err) {
    message.channel.createMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
  }
});
