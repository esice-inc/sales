const { UserListsSalesError, OrganizationNotFound, UserNotFound } = require('./errors');
const { CorruptedUser, CorruptedOrganization, CorruputedSale } = require('./errors');

/*
 * UserListSales
 * User lists all sales of the given organization
 *
 * Notes:
 *  - Maybe seller will be able to list only their sales
 *
*/
class UserListsSales {
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
            this.database.sales.findByOrganizationId(activeOrganization.id)
          )
      })
      .catch(error => this.manageError(error));
  }

  manageError(error) {
    if (error instanceof UserModelNotFound) {
      throw new UserNotFound();
    }
    else if (error instanceof UserEntityNotCreated) {
      throw new CorruptedUser();
    }
    else if (error instanceof OrganizationModelNotFound) {
      throw new OrganizationNotFound();
    }
    else if (error instanceof OrganizationEntityNotCreated) {
      throw new CorruptedOrganization();
    }
    else if (error instanceof SaleEntityNotCreated) {
      throw new CorruptedSale();
    }

    throw new UserListsSalesError(error);
  }
}

module.exports = UserListsSales;
