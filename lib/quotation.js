const Entity = require('./entity');

class Quotation extends Entity {
  // - Precio
  // - Notas o consideraciones
  // - Tiempo estimado de pago
  // - Tiempo estimado de entrega
  // - Fecha de creacion
  // - Contacto o persona con quien se hizo el acuerdo
  // - Status -> Log para esto!
  constructor({
    saleId, contactId, price, estimatedPaymentTime, estimatedDeliveryTime,
    creationDate, status,
  }) {
    this.saleId = saleId;
    this.contactId = contactId;
    this.price = price;
    this.estimatedPaymentTime = estimatedPaymentTime;
    this.estimatedDeliveryTime = estimatedDeliveryTime;
    this.creationDate = creationDate;
    this.status = status;
  }
}

module.exports = Quotation;
