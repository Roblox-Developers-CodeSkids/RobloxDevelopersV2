const { Command } = require('yuuko');

const childProcess = require('child_process');

const { version: erisVersion } = require('../node_modules/eris/package');
const gitCommit = childProcess
  .execSync('git rev-parse --short HEAD', { encoding: 'utf8' })
  .slice(0, -1);

module.exports = new Command('hello', async (message, _, { client }) => {
  message.channel.createMessage(
    'Hello!\n' +
      `I am currently in ${
        process.env.NODE_ENV == 'production' ? 'production' : 'development'
      } mode.\n` +
      `I run on Eris version \`${erisVersion}\` and is on commit \`${gitCommit}\`.\n` +
      `My prefix is \`${client.prefix}\` and you mostly want to run \`${client.prefix}post\``
  );
});
