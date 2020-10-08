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

        reject(false);
      }, timeout);
  });
};

let prompts = {};

class Prompter {
  constructor(msg, client, config) {
    if (prompts[msg.author.id])
      return msg.channel.send('Finish the current prompt!');

    prompts[msg.author.id] = true;

    this.id = msg.author.id;
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
          'message',
          this.timeout,
          (received) => {
            return (
              received.author.id == this.id &&
              received.channel.id == this.channel.id
            );
          }
        );
        this.handle(msg);
        loop();
      } catch {
        this.channel.send('Closing prompt! Reason: Timeout');
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
    return this.channel.send(content);
  }

  save(key, val) {
    this.data[key] = val;
  }

  get(key) {
    return this.data[key];
  }

  handle(msg) {
    this.tasks[this.stage].action(msg.content || null, this, msg);
  }

  update() {
    let message = this.tasks[this.stage].message;

    if (!message) return this.channel.send('Fatal error: No more tasks found');

    if (message == 'now') {
      this.handle();
    } else if (message != 'none') {
      if (message.render) {
        let rendered = message.render({
          get: this.get,
          step: this.stage,
          timeout: this.timeout,
        });

        this.channel.send(rendered);
      } else {
        this.channel.send(message);
      }
    }
  }
}

module.exports = Prompter;
