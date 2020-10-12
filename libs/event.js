class Event {
  constructor(toListen, listener) {
    this.toListen = toListen;
    this.listener = listener;
  }

  register(client) {
    switch (this.listener) {
      case 'client':
        client.on(this.toListen, this.exec);
        break;
      case 'process':
        process.on(this.toListen, this.exec);
        break;
    }
  }

  exec() {}
}

module.exports = {
  Event,
};
