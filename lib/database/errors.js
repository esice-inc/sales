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

    this.modelId = modelId;
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

    this.modelId = modelId;
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

    this.entityId = entityId;
  }
}

class UserEntityNotCreated extends EntityNotCreated {
  constructor(userId) {
    super('User', userId);
  }
}

class OrganizationModelNotFound extends ModelNotFound {
  constructor(organizationId) {
    super('Organization', organizationId);
  }
}

class OrganizationModelNotCreated extends ModelNotCreated {
  constructor() {
    super('Organization');
  }
}

class OrganizationEntityNotCreated extends EntityNotCreated {
  constructor(organizationId) {
    super('Organization', organizationId);
  }
}

class SaleModelNotFound extends ModelNotFound {
  constructor(saleId) {
    super('Sale', saleId);
  }
}

class SaleModelNotCreated extends ModelNotCreated {
  constructor() {
    super('Sale')
  }
}

class SaleEntityNotCreated extends EntityNotCreated {
  constructor(saleId) {
    super('Sale', saleId);
  }
}


module.exports = {
  UnsupportedDatabaseDriver,

  UserModelNotFound,
  UserModelNotCreated,
  UserEntityNotCreated,

  OrganizationModelNotFound,
  OrganizationModelNotCreated,
  OrganizationEntityNotCreated,

  SaleModelNotFound,
  SaleModelNotCreated,
  SaleEntityNotCreated,
};
