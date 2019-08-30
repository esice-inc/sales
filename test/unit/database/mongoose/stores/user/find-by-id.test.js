const sinon = require('sinon');
const mongoose = require('mongoose');
const { assert, expect } = require('chai');

require('../test-helper');

const {
  UserModelNotFound, UserEntityNotCreated,
} = require('../../../../../../lib/database/errors');

suite('Mongoose UserStore #findById()', () => {
  suiteSetup(() => {
    sandbox = sinon.createSandbox();
  });

  suiteTeardown(() => {
  });

  setup(() => {
    userModel = createUserModel({
      name: 'User Test',
      email: 'user@example.com',
    });

    return userModel.save();
  });

  teardown(() => {
    sandbox.restore();

    return userModel.delete();
  });

  test('finds the user for the requested id', async () => {
    const expectedUser = createUser({
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
    });

    const user = await database.users.findById(userModel.id);

    expect(user).to.deep.equal(expectedUser);
  });

  test('throws an user model not found error ' +
       'when the given user id does not exist', (done) => {
    const nonExistentUserId = mongoose.Types.ObjectId();

    database.users.findById(nonExistentUserId)
      .catch((error) => {
        expect(error).to.be.instanceof(UserModelNotFound);
        done();
      });
  });

  test('throws an user entity not created error ' +
       'when an error occurs while casting the user model', (done) => {
    sandbox.stub(database.users, '_modelToObject')
      .throws(new UserEntityNotCreated());

    database.users.findById(userModel.id)
      .catch((error) => {
        expect(error).to.be.instanceof(UserEntityNotCreated);
        done();
      });
  });
});

