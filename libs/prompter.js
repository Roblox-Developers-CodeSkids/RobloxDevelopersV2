const logger = require('../logger');

let waitFor = (emitter, event, timeout, predicate) => {
  return new Promise((resolve, reject) => {
    let fn = (...varArg) => {
      if (predicate && !predicate(...varArg)) return;

      if (timeout) clearTimeout(timeout);

      emitter.removeListener(event, fn);

      resolve(...varArg);
    };

    emitter.on(event, fn);

    timeout =
      timeout &&
      setTimeout(() => {
        emitter.removeListener(event, fn);

        reject('timeout');
      }, timeout);
  });
};

let prompts = {};

class Prompter {
  constructor(msg, client, config) {
    if (prompts[msg.author.id])
      return msg.channel.createMessage('Finish the current prompt!');

    prompts[msg.author.id] = true;

    this.id = msg.author.id;
    this.sender = msg.author.tag;

    this.stage = -1;

    this.data = {};

    this.message = null;

    this.channel = msg.channel;
    this.client = client;

    this.tasks = config.tasks;
    this.timeout = config.timeout || 30000;

    this.closed = false;

    let loop = async () => {
      try {
        let msg = await waitFor(
          this.client,
          'messageCreate',
          this.timeout,
          (received) => {
            return (
              received.author.id == this.id &&
              received.channel.id == this.channel.id
            );
          }
        );

        if (!this.closed) {
          this.handle(msg);
          loop();
        }
      } catch (e) {
        if (e == 'timeout' && !this.closed) {
          this.channel.createMessage('Closing prompt! Reason: Timeout');
        } elseif (!this.closed) {
          logger.error(e);
          this.channel.createMessage('Unexpected error, closing!');
        }
        if (!this.closed) this.close();
      }
    };

    this.next();

    loop();
  }

  next() {
    this.stage++;

    this.update();
  }

  back() {
    this.stage--;

    this.update();
  }

  redo() {
    this.update();
  }

  close() {
    this.closed = true;

    prompts[this.id] = false;
  }

  reply(content) {
    return this.channel.createMessage(content);
  }

  save(key, val) {
    this.data[key] = val;
  }

  get(key) {
    return this.data[key];
  }

  handle(msg) {
    this.tasks[this.stage].action(msg?.content || null, this, msg);
  }

  update() {
    let message = this.tasks[this.stage].message;

    if (!message)
      return this.channel.createMessage('Fatal error: No more tasks found');

    if (message == 'now') {
      this.handle();
    } else if (message != 'none') {
      if (message.render) {
        let rendered = message.render({
          get: (key) => this.data[key],
          step: this.stage,
          timeout: this.timeout,
          user: this.sender,
          id: this.id,
          JSON,
        });

        this.channel.createMessage({ embed: rendered });
      } else {
        this.channel.createMessage(
          typeof message == 'object' ? { embed: message } : message
        );
      }
    }
  }
}

module.exports = Prompter;
