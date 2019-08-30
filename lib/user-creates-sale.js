const Sale = require('./sale');

class UserCreatesSale {
  constructor({
    userId, organizationId, productId, contactId, companyId, description,
    quantity, units, database,
  }) {
    this.userId = userId;
    this.organizationId = organizationId;
    this.productId = productId;
    this.contactId = contactId;
    this.companyId = companyId;
    this.description = description;
    this.quantity = quantity;
    this.units = units;
    this.database = database;
  }

  execute() {
    // What would happen with inactive users?
    const user = this.database.users.findById(this.userId);
    const product = this.database.products.findById(this.productId);
    const contact = this.database.contacts.findById(this.contactId);
    const company = this.database.contacts.findById(this.companyId);
    const organization = this.database.organizations.findById(this.organizationId);

    // If user is not a seller, use the default seller

    return Promise.all([user, product, contact, company, organization])
      .then(([user, product, contact, company, organization]) => {
        return this.database.users.findUserCurrentOrganizations(user.id)
          .then((currentOrganizations) => {
            const currentOrganization = currentOrganizations.find(
              currentOrganization => currentOrganization.id == organization.id
            );

            if (!currentOrganization) {
              throw new Error('The user does not belong to the given organization');
            }

            const sale = new Sale({
              code: '', // Code must be created using current system time
              description: this.description,
              creationDate: new Date(),
              quantity: this.quantity,
              units: this.units,
              productId: product.id,
              contactId: contact.id,
              companyId: company.id,
              sellerId: user.id,
              organizationId: organization.id,
            });

            return this.database.sales.create(sale)
              .then((saleId) => {
                sale.id = saleId;
                return sale;
              });
          });
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
    else if (error instanceof ProductModelNotFound) {
      throw new ProductNotFound();
    }
    else if (error instanceof ProductEntityNotCreated) {
      throw new CorruptedProduct();
    }
    else if (error instanceof ContactModelNotFound) {
      throw new ContactNotFound();
    }
    else if (error instanceof ContactEntityNotCreated) {
      throw new CorruptedContact();
    }
    else if (error instanceof CompanyModelNotFound) {
      throw new CompanyNotFound();
    }
    else if (error instanceof CompanyEntityNotCreated) {
      throw new CorruptedCompany();
    }
    else if (error instanceof OrganizationModelNotFound) {
      throw new OrganizationNotFound();
    }
    else if (error instanceof OrganizationEntityNotCreated) {
      throw new CorruptedOrganization();
    }
    else if (error instanceof SaleModelNotCreated) {
      throw new CorruptedSale();
    }
    else if (error instanceof SaleModelNotSaved) {
      throw new SaleNotCreated();
    }

    throw new UserCreatesSaleError(error);
  }
}

module.exports = UserCreatesSale;
