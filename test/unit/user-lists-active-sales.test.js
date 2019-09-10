const sinon = require('sinon');
const { expect, assert } = require('chai');

require('./test-helper');

const { UserNotFound, OrganizationNotFound } = require('../../lib/errors');
const { UserModelNotFound, OrganizationModelNotFound } = require('../../lib/database/errors');
const UserListsActiveSales = require('../../lib/user-lists-active-sales');

suite('Use Case: User lists active sales', () => {
  setup(() => {
    sandbox = sinon.createSandbox();

    user = createUser({
      id: 'user-id',
      name: 'User Test',
      email: 'user@example.com',
    });
    organization = createOrganization({
      id: 'organization-id',
      name: 'Organization Test',
    });
    product = createProduct({
      id: 'product-id',
      name: 'Product Test',
      code: 'PRODUCT-TEST',
      type: 'product-type',
    });
    company = createCompany({
      id: 'company-id',
      name: 'Company Test',
    });
    contact = createContact({
      id: 'contact-id',
      name: 'Contact Test',
    });
    seller = createSeller({
      id: user.id,
      name: user.name,
    });
    initialSale = createSale({
      id: 'initial-sale-id',
      code: 'INITIAL-SALE-TEST',
      description: 'Initial sale test description',
      creationDate: new Date(),
      status: 'initial',
      quantity: 1,
      units: 'pieces',
      productId: product.id,
      companyId: company.id,
      contactId: contact.id,
      sellerId: seller.id,
      organizationId: organization.id,
    });
    quotationSale = createSale({
      id: 'quotation-sale-id',
      code: 'QUOTATION-SALE-TEST',
      description: 'Quotation sale test description',
      creationDate: new Date(),
      status: 'quotation',
      quantity: 1,
      units: 'pieces',
      productId: product.id,
      companyId: company.id,
      contactId: contact.id,
      sellerId: seller.id,
      organizationId: organization.id,
    });
    orderSale = createSale({
      id: 'order-sale-id',
      code: 'ORDER-SALE-TEST',
      description: 'Order sale test description',
      creationDate: new Date(),
      status: 'order',
      quantity: 1,
      units: 'pieces',
      productId: product.id,
      companyId: company.id,
      contactId: contact.id,
      sellerId: seller.id,
      organizationId: organization.id,
    });
    deliverySale = createSale({
      id: 'delivery-sale-id',
      code: 'DELIVERY-SALE-TEST',
      description: 'Delivery sale test description',
      creationDate: new Date(),
      status: 'delivery',
      quantity: 1,
      units: 'pieces',
      productId: product.id,
      companyId: company.id,
      contactId: contact.id,
      sellerId: seller.id,
      organizationId: organization.id,
    });
  });

  teardown(() => {
    sandbox.restore();
  });

  test('returns active sales of the organization of the given user', async () => {
    sandbox.stub(database.users, 'findById')
      .returns(Promise.resolve(user));
    sandbox.stub(database.organizations, 'findById')
      .returns(Promise.resolve(organization));
    sandbox.stub(database.organizations, 'findUserActiveOrganizationById')
      .returns(Promise.resolve(organization));
    sandbox.stub(database.sales, 'findActiveByOrganizationId')
      .returns(Promise.resolve([
        initialSale, quotationSale, orderSale, deliverySale,
      ]));

    const expectedActiveSales = [
      initialSale, quotationSale, orderSale, deliverySale
    ];

    const useCase = new UserListsActiveSales({
      userId: user.id,
      organizationId: organization.id,
      database,
    });

    const activeSales = await useCase.execute();

    expect(activeSales).to.deep.equal(expectedActiveSales);
    expect(database.users.findById.calledWith(user.id)).to.be.true;
    expect(
      database.organizations.findById.calledWith(organization.id)
    ).to.be.true;
    expect(
      database.organizations.findUserActiveOrganizationById.calledWith(
        user.id, organization.id
      )
    ).to.be.true;
    expect(
      database.sales.findActiveByOrganizationId.calledWith(organization.id)
    ).to.be.true;
  });

  test('returns an empty array when there are no active sales ' +
       'of the organization of the given user', async () => {
    sandbox.stub(database.users, 'findById')
      .returns(Promise.resolve(user));
    sandbox.stub(database.organizations, 'findById')
      .returns(Promise.resolve(organization));
    sandbox.stub(database.organizations, 'findUserActiveOrganizationById')
      .returns(Promise.resolve(organization));
    sandbox.stub(database.sales, 'findActiveByOrganizationId')
      .returns(Promise.resolve([]));

    const useCase = new UserListsActiveSales({
      userId: user.id,
      organizationId: organization.id,
      database,
    });

    const activeSales = await useCase.execute();

    expect(activeSales).to.be.empty;
    expect(database.users.findById.calledWith(user.id)).to.be.true;
    expect(
      database.organizations.findById.calledWith(organization.id)
    ).to.be.true;
    expect(
      database.organizations.findUserActiveOrganizationById.calledWith(
        user.id, organization.id
      )
    ).to.be.true;
    expect(
      database.sales.findActiveByOrganizationId.calledWith(organization.id)
    ).to.be.true;
  });

  test('throws an user model not found error ' +
       'when the given user id does not exist', async () => {
    sandbox.stub(database.users, 'findById')
      .returns(Promise.reject(new UserModelNotFound(user.id)));
    sandbox.stub(database.organizations, 'findById')
      .returns(Promise.resolve(organization));

    const useCase = new UserListsActiveSales({
      userId: user.id,
      organizationId: organization.id,
      database,
    });

    await useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(UserNotFound);
        expect(error.message).to.be.equal(`User 'user-id' was not found`);
      })
    expect(database.users.findById.calledWith(user.id)).to.be.true;
    expect(
      database.organizations.findById.calledWith(organization.id)
    ).to.be.true;
  });

  test('throws an organization model not found error ' +
       'when the given organizaiton id does not exist', async () => {
    sandbox.stub(database.users, 'findById')
      .returns(Promise.resolve(user));
    sandbox.stub(database.organizations, 'findById')
      .returns(
        Promise.reject(new OrganizationModelNotFound(organization.id))
      );

    const useCase = new UserListsActiveSales({
      userId: user.id,
      organizationId: organization.id,
      database,
    });

    await useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationNotFound);
        expect(error.message).to.be.equal(
          `Organization 'organization-id' was not found`
        );
      })
    expect(database.users.findById.calledWith(user.id)).to.be.true;
    expect(
      database.organizations.findById.calledWith(organization.id)
    ).to.be.true;
  });

  test('throws an organization model not found error ' +
       'when the given user does not belong to the given organization', async () => {
    sandbox.stub(database.users, 'findById')
      .returns(Promise.resolve(user));
    sandbox.stub(database.organizations, 'findById')
      .returns(Promise.resolve(organization));
    sandbox.stub(database.organizations, 'findUserActiveOrganizationById')
      .returns(
        Promise.reject(new OrganizationModelNotFound(organization.id))
      );

    const useCase = new UserListsActiveSales({
      userId: user.id,
      organizationId: organization.id,
      database,
    });

    await useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationNotFound);
        expect(error.message).to.be.equal(
          `Organization 'organization-id' was not found`
        );
      })
    expect(database.users.findById.calledWith(user.id)).to.be.true;
    expect(
      database.organizations.findById.calledWith(organization.id)
    ).to.be.true;
    expect(
      database.organizations.findUserActiveOrganizationById.calledWith(
        user.id, organization.id
      )
    ).to.be.true;
  });

  test('throws an organization model not found error ' +
       'when the given user is no longer part of the given organization', async () => {
    sandbox.stub(database.users, 'findById')
      .returns(Promise.resolve(user));
    sandbox.stub(database.organizations, 'findById')
      .returns(Promise.resolve(organization));
    sandbox.stub(database.organizations, 'findUserActiveOrganizationById')
      .returns(
        Promise.reject(new OrganizationModelNotFound(organization.id))
      );

    const useCase = new UserListsActiveSales({
      userId: user.id,
      organizationId: organization.id,
      database,
    });

    await useCase.execute()
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationNotFound);
        expect(error.message).to.be.equal(
          `Organization 'organization-id' was not found`
        );
      })
    expect(database.users.findById.calledWith(user.id)).to.be.true;
    expect(
      database.organizations.findById.calledWith(organization.id)
    ).to.be.true;
    expect(
      database.organizations.findUserActiveOrganizationById.calledWith(
        user.id, organization.id
      )
    ).to.be.true;
  });
});
