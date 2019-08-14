const Quotation = require('../../../quotation');
const QuotationModel = require('../../../../db/mongoose/models/quotation');

class QuotationStore {
  async create(quotation) {
    const model = this._objectToModel(quotation);

    await model.save();

    return model.id;
  }

  async findById(quotationId) {
    const model = await QuotationModel.findById(quotationId);

    if (!model) throw new errors.QuotationModelNotFound(quotationId);

    return this._modelToObject(model);
  }

  async update(quotation) {
    const model = await QuotationModel.findById(quotation.id);

    if (!model) throw new errors.QuotationModelNotFound(quotation.id);

    model.status = quotation.status;
    model.price = quotation.price;
    model.estimatedPaymentTime = quotation.estimatedPaymentTime;
    model.estimatedDeliveryTime = quotation.estimatedDeliveryTime;
    model.contactId = quotation.contactId;

    await model.save();
  }

  async findBySaleId(saleId) {
    const models = await QuotationModel.find({ saleId });

    return models.map(model => this._modelToObject(model));
  }

  async findByContactId(contactId) {
    const models = await QuotationModel.find({ contactId });

    return models.map(model => this._modelToObject(model));
  }

  _modelToObject(model) {
    let quotation = null;

    try {
      quotation = new Quotation({
        id: model.id,
        creationDate: model.creationDate,
        status: model.status,
        price: model.price,
        estimatedPaymentTime: model.estimatedPaymentTime,
        estimatedDeliveryTime: model.estimatedDeliveryTime,
        contactId: model.contactId,
        saleId: model.saleId,
      });
    } catch (error) {
      throw new errors.QuotationEntityNotCreated(model.id, error.stack);
    }

    return quotation;
  }

  _objectToModel(quotation) {
    let model = null;

    try {
      model = new QuotationModel({
        creationDate: quotation.creationDate,
        status: quotation.status,
        price: quotation.price,
        estimatedPaymentTime: quotation.estimatedPaymentTime,
        estimatedDeliveryTime: quotation.estimatedDeliveryTime,
        contactId: quotation.contactId,
        saleId: quotation.saleId,
      });

    } catch (error) {
      throw new errors.QuotationModelNotCreated(quotation.id, error.stack);
    }

    return model;
  }
}

module.exports = QuotationStore;
