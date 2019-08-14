const User = require('../../../user');
const UserModel = require('../../../../db/mongoose/models/user');

class UserStore {
  async create(user) {
    const model = this._objectToModel(user);

    await model.save();

    return model.id;
  }

  async findById(userId) {
    const model = await UserModel.findById(userId);

    if (!model) throw new errors.UserModelNotFound(userId);

    return this._modelToObject(model);
  }

  async update(user) {
    const model = await UserModel.findById(user.id);

    if (!model) throw new errors.UserModelNotFound(user.id);

    model.name = user.name;
    model.email = user.email;

    await model.save();
  }

  async findByOrganizationId(organizationId) {
    const models = await UserModel.find({ organizationId });

    return models.map(model => this._modelToObject(model));
  }

  _modelToObject(model) {
    let user = null;

    try {
      user = new User({
        id: model.id,
        name: model.name,
        email: model.email,
        organizationId: model.organizationId,
      });
    } catch (error) {
      throw new errors.UserEntityNotCreated(model.id, error.stack);
    }

    return user;
  }

  _objectToModel(user) {
    let model = null;

    try {
      model = new UserModel({
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      });

    } catch (error) {
      throw new errors.UserModelNotCreated(user.id, error.stack);
    }

    return model;
  }
}

module.exports = UserStore;
