const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  OrganizationModelNotFound, OrganizationEntityNotCreated,
} = require('../../../../../../lib/database/errors');

suite('Mongoose OrganizationStore #findUserActiveOrganizationById()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    activeUserModel = createUserModel({
      name: 'Active User Test',
      email: 'user@example.com',
    });
    inactiveUserModel = createUserModel({
      name: 'Inactive User Test',
      email: 'user@example.com',
    });
    organizationModel = createOrganizationModel({
      name: 'Organization Test',
    });

    return Promise.all([
      activeUserModel.save(),
      inactiveUserModel.save(),
      organizationModel.save(),
    ]);
  });

  suiteTeardown(() => {
    return Promise.all([
      activeUserModel.delete(),
      inactiveUserModel.delete(),
      organizationModel.delete(),
    ]);
  });

  setup(() => {
    activeUserOrganizationModel = createUserOrganizationModel({
      startDate: new Date(),
      endDate: null,
      userId: activeUserModel.id,
      organizationId: organizationModel.id,
    });

    inactiveUserOrganizationModel = createUserOrganizationModel({
      startDate: new Date(),
      endDate: new Date(),
      userId: inactiveUserModel.id,
      organizationId: organizationModel.id,
    });

    return Promise.all([
      activeUserOrganizationModel.save(),
      inactiveUserOrganizationModel.save(),
    ]);
  });

  teardown(() => {
    sandbox.restore();

    return Promise.all([
      activeUserOrganizationModel.delete(),
      inactiveUserOrganizationModel.delete(),
    ]);
  });

  test('finds the user active organization for the requested id', async () => {
    const expectedOrganization = createOrganization({
      id: organizationModel.id.toString(),
      name: organizationModel.name,
    });

    const organization = await database.organizations.findUserActiveOrganizationById(
      activeUserModel.id, organizationModel.id
    );

    expect(organization).to.deep.equal(expectedOrganization);
  });

  test('finds the user active organization for the requested id ' +
       'even when the user belongs to multiple organizations', async () => {
    const secondOrganizationModel = createOrganizationModel({
      name: 'Second Organization Test',
    });
    await secondOrganizationModel.save();

    const userOrganizationModel = createUserOrganizationModel({
      startDate: new Date(),
      endDate: null,
      userId: activeUserModel.id,
      organizationId: secondOrganizationModel.id,
    });
    await userOrganizationModel.save();

    const expectedOrganization = createOrganization({
      id: organizationModel.id.toString(),
      name: organizationModel.name,
    });

    const organization = await database.organizations.findUserActiveOrganizationById(
      activeUserModel.id, organizationModel.id,
    )

    expect(organization).to.deep.equal(expectedOrganization);
  });

  test('throws an organization model not found error ' +
       'when the given user does not belong to the organization', (done) => {
    const nonExistentUserId = mongoose.Types.ObjectId();

    database.organizations.findUserActiveOrganizationById(
      nonExistentUserId, organizationModel.id
    )
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationModelNotFound);
        done();
      });
  });

  test('throws an organization model not found error ' +
       'when the given organization id does not exist', (done) => {
    const nonExistentOrganizationId = mongoose.Types.ObjectId();

    database.organizations.findUserActiveOrganizationById(
      activeUserModel.id, nonExistentOrganizationId
    )
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationModelNotFound);
        done();
      });
  });

  test('throws an organization model not found error ' +
       'when the given user is no longer active in the organization', (done) => {
    database.organizations.findUserActiveOrganizationById(
      inactiveUserModel.id, organizationModel.id
    )
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationModelNotFound);
        done();
      });
  });

  test('throws an organization model not found error ' +
       'when the given user is not active in the organization yet', async () => {
    const tomorrow = new Date().setDate((new Date()).getDate() + 1);
    const userModel = createUserModel({
      name: 'User Test',
      email: 'user@example.com',
    });
    await userModel.save();

    const userOrganizationModel = createUserOrganizationModel({
      startDate: tomorrow,
      endDate: null,
      userId: userModel.id,
      organizationId: organizationModel.id,
    });
    await userOrganizationModel.save();

    await database.organizations.findUserActiveOrganizationById(
      userModel.id, organizationModel.id,
    )
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationModelNotFound);
      });
  });

  test('throws an organization entity not created error ' +
       'when an error occurs while casting the organization model', (done) => {
    sandbox.stub(database.organizations, '_modelToObject')
      .throws(new OrganizationEntityNotCreated());

    database.organizations.findUserActiveOrganizationById(
      activeUserModel.id, organizationModel.id
    )
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationEntityNotCreated);
        done();
      });
  });

  // test when user does not belong to the organization
  // test when user starting date is in the future
  // test when user is no longer part of the organization
  // test when user starting date in organization is today -> MISSING
  // test when user belongs to multiple organizations -> MISSING
});

