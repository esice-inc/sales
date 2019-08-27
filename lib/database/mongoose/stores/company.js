const Company = require('../../../company');
const CompanyModel = require('../../../../db/mongoose/models/company');

class CompanyStore {
  async create(company) {
    const model = this._objectToModel(company);

    await model.save();

    return model.id;
  }

  async findById(companyId) {
    const model = await CompanyModel.findById(companyId);

    if (!model) throw new errors.CompanyModelNotFound(companyId);

    return this._modelToObject(model);
  }

  async findAll() {
    const models = await CompanyModel.find();

    return models.map(model => this._modelToObject(model));
  }

  async update(company) {
    const model = await CompanyModel.findById(company.id);

    if (!model) throw new errors.CompanyModelNotFound(company.id);

    model.name = company.name;

    await model.save();
  }

  _modelToObject(model) {
    let company = null;

    try {
      company = new Company({
        id: model.id,
        name: model.name,
        creationDate: model.creationDate,
      });
    } catch (error) {
      throw new errors.CompanyEntityNotCreated(model.id, error.stack);
    }

    return company;
  }

  _objectToModel(company) {
    let model = null;

    try {
      model = new companyModel({
        name: company.name,
        creationDate: company.creationDate,
      });

    } catch (error) {
      throw new errors.CompanyModelNotCreated(company.id, error.stack);
    }

    return model;
  }
}

module.exports = CompanyStore;
