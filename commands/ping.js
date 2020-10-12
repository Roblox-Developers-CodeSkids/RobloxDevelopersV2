const { Command } = require('yuuko');

module.exports = new Command('ping', async (message) => {
  const sent = await message.channel.createMessage('Pong!');

  const timeDiff =
    (sent.editedTimestamp || sent.timestamp) -
    (message.editedTimestamp || message.timestamp);

  return sent.edit(`Pong!\n🔂 **RTT**: ${timeDiff} ms`);
});
