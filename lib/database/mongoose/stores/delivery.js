const Delivery = require('../../../delivery');
const DeliveryModel = require('../../../../db/mongoose/models/delivery');

class DeliveryStore {
  async create(delivery) {
    const model = this._objectToModel(delivery);

    await model.save();

    return model.id;
  }

  async findById(deliveryId) {
    const model = await DeliveryModel.findById(deliveryId);

    if (!model) throw new errors.DeliveryModelNotFound(deliveryId);

    return this._modelToObject(model);
  }

  async update(delivery) {
    const model = await DeliveryModel.findById(delivery.id);

    if (!model) throw new errors.DeliveryModelNotFound(delivery.id);

    model.status = delivery.status;
    model.deliveryDate = delivery.deliveryDate;
    model.estimatedDeliveryTime = delivery.estimatedDeliveryTime;
    model.dealerId = delivery.dealerId;
    model.contactId = delivery.contactId;

    await model.save();
  }

  async findBySaleId(saleId) {
    const models = await DeliveryModel.find({ saleId });

    return models.map(model => this._modelToObject(model));
  }

  async findByOrderId(orderId) {
    const models = await DeliveryModel.find({ orderId });

    return models.map(model => this._modelToObject(model));
  }

  async findByDealerId(dealerId) {
    const models = await DeliveryModel.find({ dealerId });

    return models.map(model => this._modelToObject(model));
  }

  async findBycontactId(contactId) {
    const models = await DeliveryModel.find({ contactId });

    return models.map(model => this._modelToObject(model));
  }

  _modelToObject(model) {
    let delivery = null;

    try {
      delivery = new Delivery({
        id: model.id,
        creationDate: model.creationDate,
        status: model.status,
        deliveryDate: model.deliveryDate,
        estimatedDeliveryTime: model.estimatedDeliveryTime,
        dealerId: model.dealerId,
        contactId: model.contactId,
        saleId: model.saleId,
        orderId: model.orderId,
      });
    } catch (error) {
      throw new errors.DeliveryEntityNotCreated(model.id, error.stack);
    }

    return delivery;
  }

  _objectToModel(delivery) {
    let model = null;

    try {
      model = new DeliveryModel({
        creationDate: delivery.creationDate,
        status: delivery.status,
        deliveryDate: delivery.deliveryDate,
        estimatedDeliveryTime: delivery.estimatedDeliveryTime,
        dealerId: delivery.dealerId,
        contactId: delivery.contactId,
        saleId: delivery.saleId,
        orderId: delivery.orderId,
      });

    } catch (error) {
      throw new errors.DeliveryModelNotCreated(delivery.id, error.stack);
    }

    return model;
  }
}

module.exports = DeliveryStore;
