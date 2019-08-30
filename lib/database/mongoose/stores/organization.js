const Organization = require('../../../organization');
const OrganizationModel = require('../../../../db/mongoose/models/organization');
const UserOrganizationModel = require('../../../../db/mongoose/models/user-organization');
const {
  OrganizationModelNotFound, OrganizationModelNotCreated, OrganizationEntityNotCreated,
} = require('../../errors');

class OrganizationStore {
  async create(organization) {
    const model = this._objectToModel(organization);

    await model.save();

    return model.id;
  }

  async findById(organizationId) {
    const model = await OrganizationModel.findById(organizationId);

    if (!model) throw new OrganizationModelNotFound(organizationId);

    return this._modelToObject(model);
  }

  async update(organization) {
    const model = await OrganizationModel.findById(organization.id);

    if (!model) throw new OrganizationModelNotFound(organization.id);

    model.name = organization.name;

    await model.save();
  }

  async findUserActiveOrganizationById(userId, organizationId) {
    const userOrganizationModel = await UserOrganizationModel.findOne({
      userId,
      organizationId,
      startDate: {
        $lte: new Date(),
      },
      endDate: null,
    });

    if (!userOrganizationModel) {
      throw new OrganizationModelNotFound(organizationId);
    }

    return this.findById(organizationId);
  }

  _modelToObject(model) {
    let organization = null;

    try {
      organization = new Organization({
        id: model.id,
        name: model.name,
      });
    } catch (error) {
      throw new OrganizationEntityNotCreated(model.id, error.stack);
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
      throw new OrganizationModelNotCreated(organization.id, error.stack);
    }

    return model;
  }
}

module.exports = OrganizationStore;
