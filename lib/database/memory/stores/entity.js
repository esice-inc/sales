const Entity = require('../../../domain/entity');
const MemoryStore = require('../store');

class EntityStore extends MemoryStore {
  findById(entityId) {
    let model;

    try {
      model = super.findById(entityId);
    } catch (error) {
      if (error instanceof errors.ItemNotFound) {
        throw new errors.EntityNotFound(entityId);
      }

      throw error;
    }

    return model;
  }
}

module.exports = EntityStore;
