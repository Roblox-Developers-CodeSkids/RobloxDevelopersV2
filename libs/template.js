const { MessageEmbed } = require('discord.js');
const { render } = require('ejs');

const { clone } = require('lodash');

let deepScan = (tbl, fn) => {
  let cloned = clone(tbl);

  for (let i in cloned) {
    let v = cloned[i];

    if (typeof v == 'object') {
      cloned[i] = deepScan(v, fn);
    } else {
      cloned[i] = fn(v) || v;
    }
  }

  return cloned;
};

class Template extends MessageEmbed {
  constructor(data) {
    super(data);
  }

  render(env = {}) {
    let tbl = deepScan(this.toJSON(), (val) => {
      if (typeof val == 'string')
        return render(val, env, {
          escape: (text) => text,
        });
    });

    return new MessageEmbed(tbl);
  }

  construct(env = {}) {
    let tbl = deepScan(this.toJSON(), (val) => {
      if (typeof val == 'string')
        return render(val, env, {
          escape: (text) => text,
        });
    });

    return new Template(tbl);
  }
}

module.exports = Template;
