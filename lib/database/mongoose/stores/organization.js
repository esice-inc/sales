const Organization = require('../../../organization');
const OrganizationModel = require('../../../../db/mongoose/models/organization');

class OrganizationStore {
  async create(organization) {
    const model = this._objectToModel(organization);

    await model.save();

    return model.id;
  }

  async findById(organizationId) {
    const model = await OrganizationModel.findById(organizationId);

    if (!model) throw new errors.OrganizationModelNotFound(organizationId);

    return this._modelToObject(model);
  }

  async update(organization) {
    const model = await OrganizationModel.findById(organization.id);

    if (!model) throw new errors.OrganizationModelNotFound(organization.id);

    model.name = organization.name;

    await model.save();
  }

  _modelToObject(model) {
    let organization = null;

    try {
      organization = new Organization({
        id: model.id,
        name: model.name,
      });
    } catch (error) {
      throw new errors.OrganizationEntityNotCreated(model.id, error.stack);
    }

    return organization;
  }

  _objectToModel(organization) {
    let model = null;

    try {
      model = new OrganizationModel({
        name: organization.name,
      });

    } catch (error) {
      throw new errors.OrganizationModelNotCreated(organization.id, error.stack);
    }

    return model;
  }
}

module.exports = OrganizationStore;
