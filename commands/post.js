const { Command } = require('yuuko');

const prompt = require('../libs/prompter');

const Template = require('../libs/template');

const MessageEmbed = require('../libs/embed');

let logger = require('../logger');

const { parse } = require('toml');
const { readFileSync } = require('fs');

let {
  hiring: { approved, unapprove, ban, notAllowed, logs },
} = parse(readFileSync('config.toml'));

let plate = new Template({
  title: 'Roblox Developers Marketplace Prompt',
  description: '<%= description %>',
  footer: {
    text: 'Say cancel to cancel',
  },
  color: 0x2ecc71,
});

let exit = (prompt) => {
  prompt.reply('Canceled!');
  prompt.close();
};

module.exports = new Command(
  ['post', 'sell', 'hire', 'portfolio'],
  async (msg, _, { client }) => {
    let { roles } = msg.member;

    if (roles.find((role) => notAllowed.find((banned) => role == banned)))
      return msg.channel.createMessage('You are banned from hiring!');

    try {
      (await msg.author.getDMChannel()).createMessage('Mail incoming...');
      msg.channel.createMessage('You got mail!');
    } catch {
      msg.channel.createMessage(
        'I am unable to dm you, make sure you have your dms open!'
      );
      return;
    }
    try {
      new prompt(
        {
          channel: await msg.author.getDMChannel(),
          author: msg.author,
        },
        client,
        {
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
              action: (content, prompt, msg) => {
                content = content.toLowerCase();
                if (content == 'cancel') return exit(prompt);

                prompt.save('_message', msg);

                let toSave;

                switch (content) {
                  case 'looking for work':
                    toSave = 'lfw';
                    break;
                  case 'hiring':
                    toSave = 'hire';
                    break;
                  case 'selling':
                    toSave = 'sell';
                    break;
                }

                if (!toSave) return prompt.redo();

                prompt.save('_action', toSave);
                prompt.next();
              },
            },
            {
              message: plate.construct({
                description: `
            <% if (get('_action') == 'hire') { %>
            Hello! You've successfully opted into the hiring process. To start, what channel(s) would you like to post your hiring ad in? After you have selected at least 1 channel you want to post in, press Y to continue the prompt. To remove a channel from the currently selected channels table, type "remove channel-name"
          
            Current Selected Channel(s): <%- (get('channels') || ['None']).join(', ') %>

            Say \`next\` to continue

            \`builder\`, \`modeler\`, \`scripter\`, \`animator\`, \`clothing\`, \`vfx\`, \`graphics\`, \`other\`
            <% } else if (get('_action') == 'sell') { %>
              Great! Please attach an image containing a picture(s) about the product you wish to sell. The image will need to be in link form or uploaded directly to discord. If you'll like to skip this step, type next.
            <% } else if (get('_action') == 'lfw') { %>
              Awesome, you're looking to post your work and show off your stuff. Do you perhaps have a website or a place that you have all your work in? If not, type next to skip this portion. [EX: Devforums Portfolio, Artstation Portfolio, Custom Website]
            <% } %>
            `,
              }),
              action: (content, prompt) => {
                content = content.toLowerCase();
                if (content == 'cancel') return exit(prompt);

                let action = prompt.get('_action');

                switch (action) {
                  case 'selling':
                    prompt.save('item', content);
                    prompt.next();
                    break;
                  case 'lfw':
                    prompt.save('work_location', content);
                    prompt.next();
                    break;
                  case 'hire':
                    let valid = [
                      'builder',
                      'modeler',
                      'scripter',
                      'animator',
                      'clothing',
                      'vfx',
                      'graphics',
                      'other',
                    ];

                    let current = prompt.get('channels') || [];

                    let split = content.split(' ');

                    if (split[0] == 'remove') {
                      if (current.find((x) => x == split[1])) {
                        let pos = current.indexOf(split[1]);

                        current.splice(pos, 1);

                        prompt.save('channels', current);
                        prompt.reply(
                          `Successfully removed ${split[1]} from your request!`
                        );

                        prompt.redo();
                      } else {
                        prompt.reply(
                          'That channel either does not exist or is not selected!'
                        );
                      }
                    } else if (content == 'next') {
                      if (current.length == 0) {
                        prompt.reply('You must specify at least 1 channel!');
                      } else {
                        return prompt.next();
                      }
                    } else if (
                      valid.find((x) => x == content) &&
                      !current.find((x) => x == content)
                    ) {
                      current.push(content);
                      prompt.save('channels', current);

                      prompt.redo();
                    } else if (current.find((x) => x == content)) {
                      prompt.reply('That is already in your selected!');
                    } else {
                      prompt.reply('Unknown command or channel');
                    }
                    break;
                }
              },
            },
            {
              message: plate.construct({
                description: `
            <% if (get('_action') == 'sell') { %>
            Write a short description about the product. This should list basic details about the product itself, who it's meant for, what it can/can't do, if it's going to be resold or not.
            <% } else if (get('_action') == 'hire') { %>
            Great! Please type a description of the job you're looking for people to do. Be informative as possible, listing the workplace, stylistic visions, people on the team, ETC.
            <% } else if (get('_action') == 'lfw') { %>
            Alright, can you give a short title for your portfolio post? [EX: UsernameHere | Builder, Scripter, Animator]
            <% } %>
            `,
              }),
              action: (content, prompt) => {
                if (content.toLowerCase() == 'cancel') return exit(prompt);

                let action = prompt.get('_action');

                if (action == 'sell' || action == 'hire') {
                  prompt.save('description', content);
                } else if (action == 'lfw') {
                  prompt.save('title', content);
                }

                prompt.next();
              },
            },
            {
              message: plate.construct({
                description: `
            <% if (get('_action') == 'sell') { %>
            Please list a desired payment amount. Payment should be listed in a range from minimum accepted price to maximum accepted price. Payment numbers should end with the R$ Symbol (Robux), or another indicator of currency.
            <% } else if (get('_action') == 'hire') { %>
            Great! Please list payment. If payment is negotiable, please list a price range in which you are willing to pay and **can** pay. If payment is percentage based (%), please state that.
            <% } else if (get('_action') == 'lfw') { %>
            Great! Can you give a short description about yourself and what you do?
            <% } %>
            `,
              }),
              action: (content, prompt) => {
                if (content.toLowerCase() == 'cancel') return exit(prompt);

                let action = prompt.get('_action');

                if (action == 'hire' || action == 'sell') {
                  prompt.save('prices', content);
                } else {
                  prompt.save('description', content);
                }

                prompt.next();
              },
            },
            {
              message: plate.construct({
                description: `
            <% if (get('_action') == 'sell') { %>
              Anything else you would like to add?
            <% } else if (get('_action') == 'hire') { %>
              Anything else? For example current studio work?
            <% } else if (get('_action') == 'lfw') { %>
              Please send examples of your work, they'll need to be in link format or uploaded to Discord directly. Once you finish uploading your examples, type next to continue. Note: Only your first link will embed, and we have a mix limit of 3.
            <% } %>
            `,
              }),
              action: (content, prompt) => {
                if (content.toLowerCase() == 'cancel') return exit(prompt);

                let action = prompt.get('_action');

                if (action == 'hire' || action == 'sell') {
                  prompt.save('other', content);
                } else {
                  prompt.save('examples', content);
                }

                prompt.next();
              },
            },
            {
              message: plate.construct({
                description: `
            Final step, list your preferred contacts. Currently supported contact info is listed below: 
            
            Specify them in the format \`contact data\` so for Discord it would be discord <@<%- id %>> or \`discord auto\` 
            
            You can remove contacts by doing \`remove contact\` so for Discord it would be \`remove discord\` 

            Selected contacts:
            <% for(let prop in get('contacts') || {}) { %> <%- prop %>: <%- (get('contacts') || {})[prop] %>
            <% } %>

            Currently supported contacts: 
            * <:envelopesolid:763952986614398976> Email
            * <:discordbrands:763952986560004146> Discord
            * <:twitterbrands:763952986485424129> Twitter
            `,
              }),
              action: (content, prompt) => {
                if (content.toLowerCase() == 'cancel') return exit(prompt);

                let contacts = prompt.get('contacts') || {};
                let valid = ['discord', 'email', 'twitter'];

                let [action, data] = content.split(' ');

                if (content == 'next') {
                  if (Object.keys(contacts).length == 0) {
                    return prompt.reply('You must select a contact!');
                  } else {
                    return prompt.next();
                  }
                }

                if (!action || !data)
                  return prompt.reply(
                    'You must specify a contact type and contact data'
                  );

                action = action.toLowerCase();

                if (valid.find((x) => action == x)) {
                  if (contacts[action]) {
                    prompt.reply('You have already added that contact!');
                  } else {
                    contacts[action] =
                      data == 'auto' && action == 'discord'
                        ? `<@${prompt.id}>`
                        : data; // TODO; contact verification

                    prompt.save('contacts', contacts);

                    return prompt.redo();
                  }
                } else if (action == 'remove') {
                  if (contacts[data]) {
                    contacts[data] = null;

                    prompt.save('contacts', contacts);

                    return prompt.redo();
                  } else {
                    prompt.reply(
                      'That contact does not exist or is not selected!'
                    );
                  }
                } else {
                  prompt.reply('That action/contact does not exist!');
                }
              },
            },
            {
              message: plate.construct({
                description: `
            Is this ok? (y/n)

            <% if (get('_action') == 'sell') { %>
              Item for sell: <%- get('item') %>
              Item description: <%- get('description') %>
              Price: <%- get('prices') %>
              Other: <%- get('other') %>
            <% } else if (get('_action') == 'hire') { %>
              Skills looking for:  <%- (get('channels') || ['None']).join(', ') %>
              Job description: <%- get('description') %>
              Payment: <%- get('prices') %>
              Other: <%- get('prices') %>
            <% } else if (get('_action') == 'lfw') { %>
              Title: <%- get('title') %>
              Description: <%- get('description') %>
              Examples of work: <%- get('work') %>
              More examples of work: <%- get('work_location') %>
            <% } %>
            Contact details:
            <% for(let prop in get('contacts') || {}) { %> <%- prop %>: <%- (get('contacts') || {})[prop] %>
            <% } %>
            `,
              }),
              action: (content, prompt) => {
                content = content.toLowerCase();

                if (content == 'cancel') return exit(prompt);

                if (content == 'y' || content == 'yes') {
                  prompt.next();
                } else if (content == 'n' || content == 'no') {
                  prompt.reply('Exiting prompt!');
                  prompt.close();
                } else {
                  prompt.redo();
                }
              },
            },
            {
              message: 'now',
              action: (_, prompt) => {
                let message = prompt.get('_message');

                let author = message.author;

                let desc = '';
                let metadata = {
                  author: message.author.id,
                };

                for (let prop in prompt.data) {
                  if (!prop.startsWith('_')) {
                    desc = `${desc}\n${prop} - ${
                      typeof prompt.data[prop] == 'object'
                        ? JSON.stringify(prompt.data[prop])
                        : prompt.data[prop]
                    }`;
                    metadata[prop] = prompt.data[prop];
                  } else if (prop == '_action') {
                    metadata[prop] = prompt.data[prop];
                  }
                }

                let embed = new MessageEmbed()
                  .setFooter(JSON.stringify(metadata))
                  .setTitle(
                    `Marketplace request for ${author.username}${author.discriminator} (${author.id})`
                  )
                  .setDescription(desc);

                let chan = client.getChannel(logs);
                chan.createMessage({ embed }).then((sent) => {
                  sent.addReaction(approved);
                  sent.addReaction(unapprove);
                  sent.addReaction(ban);
                });

                prompt.reply('Please wait while moderators approve!');
                msg.channel.createMessage('Prompt has finished!');

                prompt.close();
              },
            },
          ],
        }
      );
    } catch (e) {
      msg.channel.createMessage('Something went wrong, try again later!');

      logger.error(e);
    }
  }
);
