const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const { SaleEntityNotCreated } = require('../../../../../../lib/database/errors');

suite('Mongoose SaleStore #findByOrganizationId()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    productModel = createProductModel({
      name: 'Product Test',
      code: 'PRODUCT-TEST',
      type: 'product type',
    });
    companyModel = createCompanyModel({
      name: 'Company Test',
    });
    contactModel = createContactModel({
      name: 'Contact Test',
    });
    organizationModel = createOrganizationModel({
      name: 'Organization Test',
    });
    userModel = createUserModel({
      name: 'User Test',
      email: 'user@example.com',
    });

    return Promise.all([
      productModel.save(),
      companyModel.save(),
      contactModel.save(),
      organizationModel.save(),
      userModel.save()
        .then(_ => {
          sellerModel = createSellerModel({
            userId: userModel.id,
          });

          return sellerModel.save();
        }),
    ]);
  });

  suiteTeardown(() => {
    return Promise.all([
      productModel.delete(),
      companyModel.delete(),
      contactModel.delete(),
      userModel.delete(),
      sellerModel.delete(),
      organizationModel.delete(),
    ]);
  });

  setup(() => {
    product = createProduct({
      id: productModel.id.toString(),
      name: productModel.name,
    });
    company = createCompany({
      id: companyModel.id.toString(),
      name: companyModel.name,
    });
    contact = createContact({
      id: contactModel.id.toString(),
      name: contactModel.name,
    });
    organization = createOrganization({
      id: organizationModel.id.toString(),
      name: organizationModel.name,
    });
    user = createUser({
      id: userModel.id.toString(),
      name: userModel.name,
      email: userModel.email,
      organizations: [organization],
    });
    seller = createSeller({
      id: sellerModel.id.toString(),
      userId: userModel.id.toString(),
    });

    saleModel = createSaleModel({
      code: 'SALE-TEST',
      description: 'Sale test description',
      creationDate: new Date(),
      status: 'initial',
      quantity: 1,
      units: 'pieces',
      productId: productModel.id,
      companyId: companyModel.id,
      contactId: contactModel.id,
      sellerId: sellerModel.id,
      organizationId: organizationModel.id,
    });

    return saleModel.save();
  });

  teardown(() => {
    sandbox.restore();

    return saleModel.delete();
  });

  test('finds the sales for the requested organization id', async () => {
    const expectedSale = createSale({
      id: saleModel.id,
      code: saleModel.code,
      description: saleModel.description,
      creationDate: saleModel.creationDate,
      status: saleModel.status,
      quantity: saleModel.quantity,
      units: saleModel.units,
      productId: saleModel.productId.toString(),
      companyId: saleModel.companyId.toString(),
      contactId: saleModel.contactId.toString(),
      sellerId: saleModel.sellerId.toString(),
      organizationId: saleModel.organizationId.toString(),
    });

    const sales = await database.sales.findByOrganizationId(
      organizationModel.id
    );

    expect(sales).to.deep.equal([expectedSale]);
  });

  test('throws an empty array ' +
       'when the given organization id is not present in any sale', async () => {
    const nonExistentOrganizationId = mongoose.Types.ObjectId();

    const sales = await database.sales.findByOrganizationId(
      nonExistentOrganizationId
    );

    expect(sales).to.be.instanceof(Array);
    expect(sales).to.be.empty;
  });

  test('throws a sale entity not created error ' +
       'when an error occurs while casting one of the sale models', (done) => {
    sandbox.stub(database.sales, '_modelToObject')
      .throws(new SaleEntityNotCreated());

    database.sales.findByOrganizationId(organizationModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(SaleEntityNotCreated);
        done();
      });
  });
});

