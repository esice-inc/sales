const Organization = require('../../lib/organization');
const User = require('../../lib/user');
const Company = require('../../lib/company');
const Contact = require('../../lib/contact');
const Sale = require('../../lib/sale');
const Delivery = require('../../lib/delivery');
const Order = require('../../lib/order');
const Quotation = require('../../lib/quotation');
const Seller = require('../../lib/seller');
const Product = require('../../lib/product');

const MemoryDatabase = require('../../lib/database/memory')

before(() => {
  createOrganization = organization => new Organization({
    id: organization.id,
    name: organization.name,
  });

  createUser = user => new User({
    id: user.id,
    name: user.name,
    email: user.email,
    organizations: user.organizations,
  });

  createProduct = product => new Product({
    id: product.id,
    code: product.code,
    type: product.type,
  });

  createSale = sale => new Sale({
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

  createSeller = seller => new Seller({
    id: seller.id,
    userId: seller.userId,
  });

  createContact = contact => new Contact({
    id: contact.id,
    name: contact.name,
  });

  createCompany = company => new Company({
    id: company.id,
    name: company.name,
  });

  database = new MemoryDatabase();
});

