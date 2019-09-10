const Entity = require('./entity');

class Organization extends Entity {
  constructor({ id, name }) {
    super({ id, name });
  }
}

module.exports = Organization;
