class UseCaseError extends Error {}

class UserListsSalesError extends UseCaseError {}

class EntityNotFound extends Error {
  constructor(entityType, entityId) {
    super(`${entityType} '${entityId}' was not found`);
  }
}

class OrganizationNotFound extends EntityNotFound {
  constructor(organizationId) {
    super('Organization', organizationId);
  }
}

class UserNotFound extends EntityNotFound {
  constructor(userId) {
    super('User', userId);
  }
}

class CorruptedEntity extends Error {}

class CorruptedUser extends CorruptedEntity {}

class CorruptedOrganization extends CorruptedEntity {}

class CorruptedSale extends CorruptedEntity {}


module.exports = {
  UserListsSalesError,

  OrganizationNotFound,
  UserNotFound,
  CorruptedUser,
  CorruptedOrganization,
  CorruptedSale,
};
