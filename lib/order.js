const Entity = require('./entity');

class Order extends Entity {
  // - Encargado de orden (Trabajador en taller o proveedor)
  // - Tiempo estimado de trabajo
  // - Fecha de inicio de trabajo
  // - Fecha de fin de trabajo
  // - Status
  // * Aqui se podrian agregar detalles como: maquinaria o recursos utilizados
  constructor({
    saleId, quotationId, workerId, estimatedDevelopmentTime, startDate, endDate, status, creationDate,
  }) {
    this.saleId = saleId;
    this.quotationId = quotationId;
    this.workerId = workerId;
    this.estimatedDevelopmentTime = estimatedDevelopmentTime;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.creationDate = creationDate;
  }
}

module.exports = Order;
