const Entity = require('./entity');

class Delivery extends Entity {
  // - Encargado de entrega (Trabajador que entrega)
  // - Fecha estimada de entrega
  // - Fecha de entrega
  // - Contacto que recibe
  // - Status
  constructor({
    saleId, orderId, dealerId, contactId, estimatedDeliveryTime, deliveryDate,
    status, creationDate,
  }) {
    this.saleId = saleId;
    this.orderId = orderId;
    this.dealerId = dealerId;
    this.contactId = contactId;
    this.estimatedDeliveryTime = estimatedDeliveryTime;
    this.deliveryDate = deliveryDate;
    this.status = status;
    this.creationDate = creationDate;
  }
}

module.exports = Delivery;
