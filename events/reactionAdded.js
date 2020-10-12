const { Event } = require('../libs/event');

const { parse } = require('toml');
const { readFileSync } = require('fs');

let {
  hiring: { approved, unapprove, ban, channels, banRole, logs },
} = parse(readFileSync('config.toml'));

let template = require('../libs/template');

let logger = require('../logger');

class ReactionAdded extends Event {
  constructor() {
    super('messageReactionAdd', 'client');
  }

  async exec(msg, { name }, user) {
    let client = this.client || this;

    msg = await client.getMessage(msg.channel.id, msg.id);

    if (user == client.user.id) return;

    if (msg.channel.id != logs) return;

    if (msg.author.id != client.user.id) return;

    if (!msg.embeds || msg.embeds.length < 1) return;

    let embed = msg.embeds[0];

    if (!embed.title.startsWith('Marketplace request')) return;

    // Valid marketplace request \\

    if (msg.content.startsWith('Closed')) return;

    try {
      let { text: metadata } = embed.footer;

      metadata = JSON.parse(metadata);

      let dm = await client.getDMChannel(metadata.author);

      if (name == unapprove) {
        dm.createMessage(
          `Your hiring request has been declined, before making another please overlook marketplace guidelines!`
        );
        msg.edit('Closed: Unapproved');
      } else if (name == ban) {
        let guild = client.guilds.find((x) => x.id == msg.guildID);

        guild.addMemberRole(metadata.author, banRole, `Hiring ban`);

        dm.createMessage(
          `You have been banned from hiring. If you feel this choice was undeserved, please dm moderators!`
        );
        msg.edit('Closed: Banned');
      } else if (name == approved) {
        let toSend = new template({
          title: `<%- get('_action') == 'lfw' ? 'Portfolio' : 'Marketplace request' %>`,
          description: `
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
        });

        toSend = toSend.render({
          get: (prop) => metadata[prop],
        });

        let channel;
        let url = '';

        if (metadata._action == 'hire') {
          for (let name of metadata.channels) {
            console.log(channels[name], name);
            let chan = await client.getChannel(channels[name]);

            let sent = await chan.createMessage({
              embed: toSend,
            });

            url = `${url}\nhttps://discord.com/channels/${sent.guildID}/${sent.channel.id}/${sent.id}`;
          }
        } else if (metadata._action == 'sell') {
          channel = await client.getChannel(channels.selling);
        } else if (metadata._action == 'lfw') {
          channel = await client.getChannel(channels.portfolio);
        }

        if (channel) {
          let sent = await channel.createMessage({
            embed: toSend,
          });

          url = `https://discord.com/channels/${sent.guildID}/${sent.channel.id}/${sent.id}`;
        }

        dm.createMessage(`Your request has been approved!\nLinks:\n${url}`);

        msg.edit(`Closed: \n${url}`);
      }
    } catch (e) {
      msg.channel.createMessage('Something went wrong!');

      logger.error(e);
    }
  }
}

module.exports = ReactionAdded;
