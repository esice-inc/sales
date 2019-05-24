const EntityStore = require('./stores/entity');


class MemoryDatabase {
  constructor() {
    this.entities = new EntityStore();
  }
}

module.exports = MemoryDatabase;
