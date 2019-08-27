// TODO:
//
// User lists all sales of the given organization
// Maybe seller will be able to list only their sales
class UserListsSales {
  constructor({ userId, organizationId, database }) {
    this.userId = userId;
    this.organizationId = organizationId;
    this.database = database;
  }

  execute() {
    const user = this.database.users.findById(this.userId);
    const organization = this.database.organizations.findById(
      this.organizationId
    );

    return Promise.all([user, organization])
      .then(([user, organization]) => {
        return this.database.users.findUserCurrentOrganizations(user.id)
          .then((currentOrganizations) => {
            const currentOrganization = currentOrganizations.find(
              currentOrganization => currentOrganization.id == organization.id
            );

            if (!currentOrganization) {
              throw new Error();
            }

            return this.database.sales.findByOrganizationId(organization.id);
          })
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
    /* 
     * This wont happen never!
    else if (error instanceof SaleModelNotFound) {
      throw new SaleNotFound();
    }
    */
    else if (error instanceof SaleEntityNotCreated) {
      throw new CorruptedSale();
    }

    throw new UserListSalesError(error);
  }
}

module.exports = UserListsSales;
