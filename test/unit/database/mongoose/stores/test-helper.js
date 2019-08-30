const config = require('config');

require('../../../test-helper')

const MongooseDatabase = require('../../../../../lib/database/mongoose');
const UserModel = require('../../../../../db/mongoose/models/user');
const OrganizationModel = require('../../../../../db/mongoose/models/organization');
const ContactModel = require('../../../../../db/mongoose/models/contact');
const CompanyModel = require('../../../../../db/mongoose/models/company');
const ProductModel = require('../../../../../db/mongoose/models/product');
const SaleModel = require('../../../../../db/mongoose/models/sale');
const QuotationModel = require('../../../../../db/mongoose/models/quotation');
const OrderModel = require('../../../../../db/mongoose/models/order');
const DeliveryModel = require('../../../../../db/mongoose/models/delivery');
const SellerModel = require('../../../../../db/mongoose/models/seller');
const UserOrganizationModel = require('../../../../../db/mongoose/models/user-organization');

before(() => {
  database = new MongooseDatabase(config.database);

  // The following functions are created to avoid importing models
  // in test files

  createOrganizationModel = organization => new OrganizationModel({
    id: organization.id,
    name: organization.name,
  });

  createUserModel = user => new UserModel({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  createSaleModel = sale => new SaleModel({
    id: sale.id,
    code: sale.code,
    description: sale.description,
    creationDate: sale.creationDate,
    status: sale.status,
    quantity: sale.quantity,
    units: sale.units,
    productId: sale.productId,
    contactId: sale.contactId,
    companyId: sale.companyId,
    sellerId: sale.sellerId,
    organizationId: sale.organizationId,
  });

  createProductModel = product => new ProductModel({
    id: product.id,
    name: product.name,
    code: product.code,
    type: product.type,
  });

  createCompanyModel = company => new CompanyModel({
    id: company.id,
    name: company.name,
  });

  createContactModel = contact => new ContactModel({
    id: contact.id,
    name: contact.name,
  });

  createSellerModel = seller => new SellerModel({
    id: seller.id,
    userId: seller.userId,
  });

  createUserOrganizationModel = userOrganization => new UserOrganizationModel({
    id: userOrganization.id,
    startDate: userOrganization.startDate,
    endDate: userOrganization.endDate,
    userId: userOrganization.userId,
    organizationId: userOrganization.organizationId,
  });

  return database
    .connect()
    .catch(error => console.log(`Error while connecting to database: ${error}`));
});

beforeEach(() => {
  // fixtures!!!
});

// NOTE: mocha opts file can work too!
// Close connection
after(() => {
  database
    .disconnect()
    .catch(error => console.log(`Error while disconnecting from database: ${error}`));
});

