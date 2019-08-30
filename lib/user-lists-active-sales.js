const { UserListsSalesError, OrganizationNotFound, UserNotFound } = require('./errors');
const { CorruptedUser, CorruptedOrganization, CorruputedSale } = require('./errors');
const {
  UserModelNotFound, OrganizationModelNotFound, UserEntityNotCreated,
  OrganizationEntityNotCreated,
} = require('./database/errors');

/*
 * UserListActiveSales
 * User lists all sales of the given organization
 *
 * Notes:
 *  - Maybe seller will be able to list only their sales
 *
*/
class UserListsActiveSales {
  constructor({ userId, organizationId, database }) {
    this.userId = userId;
    this.organizationId = organizationId;
    this.database = database;
  }

  execute() {
    const user = this.database.users.findById(this.userId);
    // Should guarantee that the organization is active
    const organization = this.database.organizations.findById(
      this.organizationId
    );

    return Promise.all([user, organization])
      .then(([user, organization]) => {
        return this.database.organizations.findUserActiveOrganizationById(
          user.id, organization.id,
        )
          // If user does not belong to organization we just throw an
          // organization not found error
          .then(activeOrganization =>
            this.database.sales.findActiveByOrganizationId(activeOrganization.id)
          )
      })
      .catch(error => this.manageError(error));
  }

  manageError(error) {
    if (error instanceof UserModelNotFound) {
      throw new UserNotFound(error.modelId);
    }
    else if (error instanceof UserEntityNotCreated) {
      throw new CorruptedUser(error.entityId);
    }
    else if (error instanceof OrganizationModelNotFound) {
      throw new OrganizationNotFound(error.modelId);
    }
    else if (error instanceof OrganizationEntityNotCreated) {
      throw new CorruptedOrganization(error.entityId);
    }
    else if (error instanceof SaleEntityNotCreated) {
      throw new CorruptedSale(error.entityId);
    }

    throw new UserListsSalesError(error);
  }
}

module.exports = UserListsActiveSales;
