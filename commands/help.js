const { Command } = require('yuuko');

const Embed = require('../libs/embed');

const levenshtein = require('js-levenshtein');

module.exports = new Command(
  ['help', 'info'],
  async (message, args, { client }) => {
    let q = args[0];

    if (!q) {
      let content = `prefix: ${client.prefix}\ncommands:\n`;

      client.commands.forEach((comm) => {
        content = `${content}  - ${comm.names[0]}:\n    aliases: [`;

        comm.names.slice(1).forEach((alias, count) => {
          content = `${content}${alias}${
            count + 1 != comm.names.length - 1 ? ', ' : ''
          }`;
        });

        content = `${content}]\n`;
      });

      message.channel.createMessage('```yaml\n' + content + '\n```');

      return;
    }

    let comm = client.commands.find((x) => x.names.find((y) => y == q));

    if (comm) {
      let content = `name: ${comm.names[0]}\naliases: [`;

      comm.names.slice(1).forEach((alias, count) => {
        content = `${content}${alias}${
          count + 1 != comm.names.length - 1 ? ', ' : ''
        }`;
      });

      message.channel.createMessage('```yaml\n' + content + ']\n```');
    } else {
      let closestNum = 10;
      let closest;

      client.commands.forEach((comm) => {
        let num = 10;
        let closestAlias;

        comm.names.forEach((alias) => {
          closestAlias = levenshtein(q, alias) < num ? alias : closestAlias;

          num = levenshtein(q, alias) < num ? levenshtein(q, alias) : num;
        });

        closest = closestNum > num ? closestAlias : closest;
        closestNum = closestNum > num ? num : closestNum;
      });

      if (closest) {
        message.channel.createMessage(
          `${q} not found, did you mean **${closest}**?`
        );
      } else {
        message.channel.createMessage(`${q} not found.`);
      }
    }
  }
);
