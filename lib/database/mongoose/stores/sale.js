const Sale = require('../../../sale');
const SaleModel = require('../../../../db/mongoose/models/sale');

const {
  SaleModelNotFound, SaleModelNotCreated, SaleEntityNotCreated,
} = require('../../errors');

class SaleStore {
  async create(sale) {
    const model = this._objectToModel(sale);

    await model.save();

    return model.id;
  }

  async findById(saleId) {
    const model = await SaleModel.findById(saleId);

    if (!model) throw new SaleModelNotFound(saleId);

    return this._modelToObject(model);
  }

  async update(sale) {
    const model = await SaleModel.findById(sale.id);

    if (!model) throw new SaleModelNotFound(sale.id);

    model.description = sale.description;
    model.status = sale.status;
    model.quantity = sale.quantity;
    model.units = sale.units;
    model.productId = sale.productId;
    model.contactId = sale.contactId;
    model.companyId = sale.companyId;
    model.sellerId = sale.sellerId;

    await model.save();
  }

  async findByProductId(productId) {
    const models = await SaleModel.find({ productId });

    return models.map(model => this._modelToObject(model));
  }

  async findByContactId(contactId) {
    const models = await SaleModel.find({ contactId });

    return models.map(model => this._modelToObject(model));
  }

  async findByCompanyId(companyId) {
    const models = await SaleModel.find({ companyId });

    return models.map(model => this._modelToObject(model));
  }

  async findBySellerId(sellerId) {
    const models = await SaleModel.find({ sellerId });

    return models.map(model => this._modelToObject(model));
  }

  async findByOrganizationId(organizationId) {
    const models = await SaleModel.find({ organizationId });

    return models.map(model => this._modelToObject(model));
  }

  async findActiveByOrganizationId(organizationId) {
    const models = await SaleModel.find(
      {
        organizationId,
        status: {
          $in: ['initial', 'quotation', 'order', 'delivery'],
        }
      },
      null,
      { sort: 'creationDate' }
    );

    return models.map(model => this._modelToObject(model));
  }

  _modelToObject(model) {
    let sale = null;

    try {
      sale = new Sale({
        id: model.id,
        code: model.code,
        description: model.description,
        creationDate: model.creationDate,
        status: model.status,
        quantity: model.quantity,
        units: model.units,
        productId: model.productId.toString(),
        contactId: model.contactId.toString(),
        companyId: model.companyId.toString(),
        sellerId: model.sellerId.toString(),
        organizationId: model.organizationId.toString(),
      });
    } catch (error) {
      throw new SaleEntityNotCreated(model.id, error.stack);
    }

    return sale;
  }

  _objectToModel(sale) {
    let model = null;

    try {
      model = new SaleModel({
        code: sale.code,
        description: sale.description,
        creationdate: sale.creationDate,
        status: sale.status,
        quantity: sale.quantity,
        units: sale.units,
        productId: sale.productId,
        contactId: sale.contactId,
        companyId: sale.companyId,
        sellerId: sale.sellerId,
      });

    } catch (error) {
      throw new SaleModelNotCreated(sale.id, error.stack);
    }

    return model;
  }
}

module.exports = SaleStore;
