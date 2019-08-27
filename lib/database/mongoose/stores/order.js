const Order = require('../../../order');
const OrderModel = require('../../../../db/mongoose/models/order');

class OrderStore {
  async create(order) {
    const model = this._objectToModel(order);

    await model.save();

    return model.id;
  }

  async findById(orderId) {
    const model = await OrderModel.findById(orderId);

    if (!model) throw new errors.OrderModelNotFound(orderId);

    return this._modelToObject(model);
  }

  async update(order) {
    const model = await OrderModel.findById(order.id);

    if (!model) throw new errors.OrderModelNotFound(order.id);

    model.status = order.status;
    model.startDate = order.startDate;
    model.endDate = order.endDate;
    model.estimatedDevelopmentTime = order.estimatedDevelopmentTime;
    model.workerId = order.workerId;

    await model.save();
  }

  async findBySaleId(saleId) {
    const models = await OrderModel.find({ saleId });

    return models.map(model => this._modelToObject(model));
  }

  async findByQuotationId(quotationId) {
    const models = await OrderModel.find({ quotationId });

    return models.map(model => this._modelToObject(model));
  }

  async findByWorkerId(workerId) {
    const models = await OrderModel.find({ workerId });

    return models.map(model => this._modelToObject(model));
  }

  _modelToObject(model) {
    let order = null;

    try {
      order = new Order({
        id: model.id,
        creationDate: model.creationDate,
        status: model.status,
        startDate: model.startDate,
        endDate: model.endDate,
        estimatedDevelopmentTime: model.estimatedDevelopmentTime,
        workerId: model.workerId,
        saleId: model.saleId,
        quotationId: model.quotationId,
      });
    } catch (error) {
      throw new errors.OrderEntityNotCreated(model.id, error.stack);
    }

    return order;
  }

  _objectToModel(order) {
    let model = null;

    try {
      model = new OrderModel({
        creationDate: order.creationDate,
        status: order.status,
        startDate: order.startDate,
        endDate: order.endDate,
        estimatedDevelopmentTime: order.estimatedDevelopmentTime,
        workerId: order.workerId,
        saleId: order.saleId,
        quotationId: order.quotationId,
      });

    } catch (error) {
      throw new errors.OrderModelNotCreated(order.id, error.stack);
    }

    return model;
  }
}

module.exports = OrderStore;
