class DatabaseError extends Error {}

class DatabaseConfigError extends DatabaseError {}

class UnsupportedDatabaseDriver extends DatabaseConfigError {
  constructor(driver) {
    super(`Adapter '${driver}' not found for database`);
  }
}

class ModelError extends DatabaseError {}

class ModelNotFound extends ModelError {
  constructor(model, modelId) {
    super(`${model} with id ${modelId} not found`);
  }
}

class UserModelNotFound extends ModelNotFound {
  constructor(userId) {
    super('User', userId);
  }
}

class ModelNotRemoved extends ModelError {
  constructor(model, modelId) {
    super(`${model} with id ${modelId} not removed`);
  }
}

class ModelNotCreated extends ModelError {
  constructor(model) {
    super(`${model} not created`)
  }
}

class UserModelNotCreated extends ModelNotCreated {
  constructor() {
    super('User')
  }
}

class EntityError extends DatabaseError {}

class EntityNotCreated extends EntityError {
  constructor(entity, entityId) {
    super(`${entity} with id ${entityId} not created`);
  }
}

class UserEntityNotCreated extends EntityNotCreated {
  constructor(userId) {
    super('User', userId);
  }
}

module.exports = {
  UnsupportedDatabaseDriver,

  UserModelNotFound,
  UserModelNotCreated,
  UserEntityNotCreated,
};
