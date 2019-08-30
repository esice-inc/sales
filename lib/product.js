const Entity = require('./entity');

class Product extends Entity {
  constructor({ id, name, code, type, organization }) {
    super({ id, name });

    this.code = code;
    this.type = type;
    this.organization = organization;
  }
}

module.exports = Product;
