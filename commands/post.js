const { Command } = require('discord-akairo');

const prompt = require('../libs/prompter');

const Template = require('../libs/template');

let plate = new Template({
  title: 'Roblox Developers Marketplace Prompt',
  description: '<%= description %>',
  footer: {
    text: 'Say cancel to cancel',
  },
});

class PostCommand extends Command {
  constructor() {
    super('post', {
      aliases: ['post', 'sell', 'hire', 'portfolio'],
    });
  }

  async exec(message) {
    new prompt(message, this.client, {
      tasks: [
        {
          message: plate.render({
            description: `
            Hello! You've successfully opted into the opting process. Please follow the prompt and answer appropriately and I'll post your hiring prompt to a secret moderation channel where『 M 』Moderators will review and either accept/decline your prompt. What are you looking to create a prompt for?

            \`Hiring\` - Post a hiring request in the channels excluding <#690008026513801225> and <#690008198718947341>
            \`Selling\` - Post a selling request in <#690008026513801225>
            \`Looking For Work\` - Post your portfolio in <#690008198718947341>
            `,
          }),
          action: (content, prompt) => {
            prompt.reply(content); // TODO; Write the rest
          },
        },
      ],
    });
  }
}

module.exports = PostCommand;
