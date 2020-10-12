class MessageEmbed {
  constructor(data = {}) {
    this.setup(data);
  }

  setup(data) {
    this.type = data.type;

    this.title = data.title;

    this.description = data.description;

    this.url = data.url;

    this.color = data.color;

    this.timestamp = data.timestamp ? new Date(data.timestamp).getTime() : null;

    this.fields = [];
    if (data.fields) {
      this.fields = this.constructor.normalizeFields(data.fields);
    }

    this.thumbnail = data.thumbnail
      ? {
          url: data.thumbnail.url,
          proxyURL: data.thumbnail.proxyURL || data.thumbnail.proxy_url,
          height: data.thumbnail.height,
          width: data.thumbnail.width,
        }
      : null;

    this.image = data.image
      ? {
          url: data.image.url,
          proxyURL: data.image.proxyURL || data.image.proxy_url,
          height: data.image.height,
          width: data.image.width,
        }
      : null;

    this.video = data.video
      ? {
          url: data.video.url,
          proxyURL: data.video.proxyURL || data.video.proxy_url,
          height: data.video.height,
          width: data.video.width,
        }
      : null;

    this.author = data.author
      ? {
          name: data.author.name,
          url: data.author.url,
          iconURL: data.author.iconURL || data.author.icon_url,
          proxyIconURL: data.author.proxyIconURL || data.author.proxy_icon_url,
        }
      : null;

    this.provider = data.provider
      ? {
          name: data.provider.name,
          url: data.provider.name,
        }
      : null;

    this.footer = data.footer
      ? {
          text: data.footer.text,
          iconURL: data.footer.iconURL || data.footer.icon_url,
          proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
        }
      : null;

    this.files = data.files || [];
  }

  get createdAt() {
    return this.timestamp ? new Date(this.timestamp) : null;
  }

  get hexColor() {
    return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
  }

  get length() {
    return (
      (this.title ? this.title.length : 0) +
      (this.description ? this.description.length : 0) +
      (this.fields.length >= 1
        ? this.fields.reduce(
            (prev, curr) => prev + curr.name.length + curr.value.length,
            0
          )
        : 0) +
      (this.footer ? this.footer.text.length : 0)
    );
  }

  addField(name, value, inline) {
    return this.addFields({ name, value, inline });
  }

  addFields(...fields) {
    this.fields.push(...this.constructor.normalizeFields(fields));
    return this;
  }

  spliceFields(index, deleteCount, ...fields) {
    this.fields.splice(
      index,
      deleteCount,
      ...this.constructor.normalizeFields(...fields)
    );
    return this;
  }

  attachFiles(files) {
    this.files = this.files.concat(files);
    return this;
  }

  setAuthor(name, iconURL, url) {
    this.author = { name: name, iconURL, url };
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setFooter(text, iconURL) {
    this.footer = { text, iconURL, proxyIconURL: undefined };
    return this;
  }

  setImage(url) {
    this.image = { url };
    return this;
  }

  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  setTimestamp(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    this.timestamp = timestamp;
    return this;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  toJSON() {
    return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp ? new Date(this.timestamp) : null,
      color: this.color,
      fields: this.fields,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author
        ? {
            name: this.author.name,
            url: this.author.url,
            icon_url: this.author.iconURL,
          }
        : null,
      footer: this.footer
        ? {
            text: this.footer.text,
            icon_url: this.footer.iconURL,
          }
        : null,
    };
  }

  static normalizeField(name, value, inline = false) {
    if (!name) throw new Error('EMBED_FIELD_NAME');
    if (!value) throw new Error('EMBED_FIELD_VALUE');
    return { name, value, inline };
  }

  static normalizeFields(...fields) {
    return fields
      .flat(2)
      .map((field) =>
        this.normalizeField(
          field && field.name,
          field && field.value,
          field && typeof field.inline === 'boolean' ? field.inline : false
        )
      );
  }
}

module.exports = MessageEmbed;
