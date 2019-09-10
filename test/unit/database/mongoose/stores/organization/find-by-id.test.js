const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

// Mongoose store helper
//   - Includes helper functions to create models
//   - Includes helper functions to create entities
require('../test-helper');

const {
  OrganizationModelNotFound, OrganizationEntityNotCreated,
} = require('../../../../../../lib/database/errors');

suite('Mongoose OrganizationStore #findById()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();

    // Create included models
    // model = createModel({});

    return Promise.all(
      [
        // model.save();
      ]
    );
  });

  suiteTeardown(() => {
    // Delete included models
    return Promise.all(
      [
        // model.delete();
      ]
    );
  });

  setup(() => {
    // Create included entities (using included models)
    // entity = createEntity({});

    // Create model-to-test
    // Since the following model is the one we want to test
    // we need to create it for each test
    organizationModel = createOrganizationModel({
      name: 'Organization Test',
    });

    // Save model-to-test
    return organizationModel.save();
  });

  teardown(() => {
    sandbox.restore();

    // Delete model-to-test
    // Since we are creating a new model for each test we
    // need to remove it so the database is not keeping trash
    return organizationModel.delete();
  });

  test('finds the organization for the requested id', async () => {
    const expectedOrganization = createOrganization({
      id: organizationModel.id,
      name: organizationModel.name,
    });

    const organization = await database.organizations.findById(
      organizationModel.id
    );

    expect(organization).to.deep.equal(expectedOrganization);
  });

  test('throws an organization model not found error ' +
       'when the given organization id does not exist', (done) => {
    const nonExistentOrganizationId = mongoose.Types.ObjectId();

    database.organizations.findById(nonExistentOrganizationId)
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationModelNotFound);
        done();
      });
  });

  test('throws an organization entity not created error ' +
       'when an error occurs while casting the organization model', (done) => {
    sandbox.stub(database.organizations, '_modelToObject')
      .throws(new OrganizationEntityNotCreated());

    database.organizations.findById(organizationModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(OrganizationEntityNotCreated);
        done();
      });
  });
});

