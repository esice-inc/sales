// TODO:
// User lists all sales of the given organization
// Maybe seller will be able to list only their sales
class UserListsSaleQuotations {
  constructor({ userId, organizationId, saleId, database }) {
    this.userId = userId;
    this.organizationId = organizationId;
    this.saleId = saleId;
    this.database = database;
  }

  execute() {
    const user = this.database.users.findById(this.userId);
    const organization = this.database.organizations.findById(
      this.organizationId
    );
    const sale = this.database.sales.findById(this.saleId);

    return Promise.all([user, organization, sale])
      .then(([user, organization, sale]) => {
        return this.database.users.findUserCurrentOrganizations(user.id)
          .then((currentOrganizations) => {
            const currentOrganization = currentOrganizations.find(
              currentOrganization => currentOrganization.id == organization.id
            );

            if (!currentOrganization) {
              throw new Error();
            }

            if (organization.id != sale.organizationId) {
              throw new Error();
            }

            return this.database.quotations.findBySaleId(sale.id);
          })
      })
      .catch(error => this.manageError(error));
  }

  manageError(error) {
    if (error instanceof UserModelNotFound) {
    }
    else if (error instanceof UserEntityNotCreated) {
    }
    else if (error instanceof OrganizationModelNotFound) {
    }
    else if (error instanceof OrganizationEntityNotCreated) {
    }
    else if (error instanceof SaleModelNotFound) {
    }
    else if (error instanceof SaleEntityNotCreated) {
    }
    else if (error instanceof QuotationEntityNotCreated) {
    }

    throw new UserListSaleQuotationsError(error);
  }
}

module.exports = UserListsSales;
