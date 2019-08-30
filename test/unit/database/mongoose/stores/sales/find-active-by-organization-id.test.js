const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const { SaleEntityNotCreated } = require('../../../../../../lib/database/errors');

suite('Mongoose SaleStore #findActiveByOrganizationId()', () => {
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
    const now = new Date();
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

    initialSaleModel = createSaleModel({
      code: 'INITIAL-SALE-TEST',
      description: 'Initial sale test description',
      creationDate: now.setDate(now.getDate() + 10),
      status: 'initial',
      quantity: 1,
      units: 'pieces',
      productId: productModel.id,
      companyId: companyModel.id,
      contactId: contactModel.id,
      sellerId: sellerModel.id,
      organizationId: organizationModel.id,
    });

    quotationSaleModel = createSaleModel({
      code: 'QUOTATION-SALE-TEST',
      description: 'Quotation sale test description',
      creationDate: now.setDate(now.getDate() + 20),
      status: 'quotation',
      quantity: 1,
      units: 'pieces',
      productId: productModel.id,
      companyId: companyModel.id,
      contactId: contactModel.id,
      sellerId: sellerModel.id,
      organizationId: organizationModel.id,
    });

    orderSaleModel = createSaleModel({
      code: 'ORDER-SALE-TEST',
      description: 'Order sale test description',
      creationDate: now.setDate(now.getDate() + 30),
      status: 'order',
      quantity: 1,
      units: 'pieces',
      productId: productModel.id,
      companyId: companyModel.id,
      contactId: contactModel.id,
      sellerId: sellerModel.id,
      organizationId: organizationModel.id,
    });

    deliverySaleModel = createSaleModel({
      code: 'DELIVERY-SALE-TEST',
      description: 'Delivery sale test description',
      creationDate: now.setDate(now.getDate() + 40),
      status: 'delivery',
      quantity: 1,
      units: 'pieces',
      productId: productModel.id,
      companyId: companyModel.id,
      contactId: contactModel.id,
      sellerId: sellerModel.id,
      organizationId: organizationModel.id,
    });

    paymentSaleModel = createSaleModel({
      code: 'PAYMENT-SALE-TEST',
      description: 'Payment sale test description',
      creationDate: now.setDate(now.getDate() + 50),
      status: 'payment',
      quantity: 1,
      units: 'pieces',
      productId: productModel.id,
      companyId: companyModel.id,
      contactId: contactModel.id,
      sellerId: sellerModel.id,
      organizationId: organizationModel.id,
    });

    externalSaleModel = createSaleModel({
      code: 'EXTERNAL-SALE-TEST',
      description: 'Different owner sale test description',
      creationDate: now.setDate(now.getDate() + 25),
      status: 'initial',
      quantity: 1,
      units: 'pieces',
      organizationId: mongoose.Types.ObjectId(),
    });

    return Promise.all([
      initialSaleModel.save(),
      quotationSaleModel.save(),
      orderSaleModel.save(),
      deliverySaleModel.save(),
      paymentSaleModel.save(),
      externalSaleModel.save(),
    ]);
  });

  teardown(() => {
    sandbox.restore();

    return Promise.all([
      initialSaleModel.delete(),
      quotationSaleModel.delete(),
      orderSaleModel.delete(),
      deliverySaleModel.delete(),
      paymentSaleModel.delete(),
      externalSaleModel.delete(),
    ]);
  });

  test('finds the active sales for the requested organization id ' +
       'including the different types of active sale', async () => {
    const expectedSales = [
      // Initial
      createSale({
        id: initialSaleModel.id,
        code: initialSaleModel.code,
        description: initialSaleModel.description,
        creationDate: initialSaleModel.creationDate,
        status: initialSaleModel.status,
        quantity: initialSaleModel.quantity,
        units: initialSaleModel.units,
        productId: initialSaleModel.productId.toString(),
        companyId: initialSaleModel.companyId.toString(),
        contactId: initialSaleModel.contactId.toString(),
        sellerId: initialSaleModel.sellerId.toString(),
        organizationId: initialSaleModel.organizationId.toString(),
      }),
      // Quotation
      createSale({
        id: quotationSaleModel.id,
        code: quotationSaleModel.code,
        description: quotationSaleModel.description,
        creationDate: quotationSaleModel.creationDate,
        status: quotationSaleModel.status,
        quantity: quotationSaleModel.quantity,
        units: quotationSaleModel.units,
        productId: quotationSaleModel.productId.toString(),
        companyId: quotationSaleModel.companyId.toString(),
        contactId: quotationSaleModel.contactId.toString(),
        sellerId: quotationSaleModel.sellerId.toString(),
        organizationId: quotationSaleModel.organizationId.toString(),
      }),
      // Order
      createSale({
        id: orderSaleModel.id,
        code: orderSaleModel.code,
        description: orderSaleModel.description,
        creationDate: orderSaleModel.creationDate,
        status: orderSaleModel.status,
        quantity: orderSaleModel.quantity,
        units: orderSaleModel.units,
        productId: orderSaleModel.productId.toString(),
        companyId: orderSaleModel.companyId.toString(),
        contactId: orderSaleModel.contactId.toString(),
        sellerId: orderSaleModel.sellerId.toString(),
        organizationId: orderSaleModel.organizationId.toString(),
      }),
      // Delivery
      createSale({
        id: deliverySaleModel.id,
        code: deliverySaleModel.code,
        description: deliverySaleModel.description,
        creationDate: deliverySaleModel.creationDate,
        status: deliverySaleModel.status,
        quantity: deliverySaleModel.quantity,
        units: deliverySaleModel.units,
        productId: deliverySaleModel.productId.toString(),
        companyId: deliverySaleModel.companyId.toString(),
        contactId: deliverySaleModel.contactId.toString(),
        sellerId: deliverySaleModel.sellerId.toString(),
        organizationId: deliverySaleModel.organizationId.toString(),
      }),
    ];

    const sales = await database.sales.findActiveByOrganizationId(
      organizationModel.id
    );

    expect(sales).to.deep.equal(expectedSales);
  });

  test('throws an empty array ' +
       'when the given organization id is not present in any sale', async () => {
    const nonExistentOrganizationId = mongoose.Types.ObjectId();

    const sales = await database.sales.findActiveByOrganizationId(
      nonExistentOrganizationId
    );

    expect(sales).to.be.instanceof(Array);
    expect(sales).to.be.empty;
  });

  test('throws a sale entity not created error ' +
       'when an error occurs while casting one of the sale models', (done) => {
    sandbox.stub(database.sales, '_modelToObject')
      .throws(new SaleEntityNotCreated());

    database.sales.findActiveByOrganizationId(organizationModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(SaleEntityNotCreated);
        done();
      });
  });
});

