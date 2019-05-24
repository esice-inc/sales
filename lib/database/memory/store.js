const uuidV4 = require('uuid/v4');

const errors = require('../errors');

class MemoryStore {
  constructor() {
    this.items = {};
  }

  create(item) {
    item.id = this._findNextId();
    item.platformId = item.platformId || uuidV4();
    this.items[item.id] = item;

    return item.id;
  }

  update(item) {
    this.findById(item.id);

    this.items[item.id] = item;
  }

  all() {
    return Object.values(this.items);
  }

  findById(itemId) {
    if (!this.items[itemId]) {
      throw new errors.ItemNotFound('Item', itemId);
    }

    return this.items[itemId];
  }

  _findNextId() {
    let nextId = 1;

    for (id in this.items) {
      if (id >= nextId) {
        nextId = id + 1
      }
    }

    return nextId;
  }
}

module.exports = MemoryStore;
