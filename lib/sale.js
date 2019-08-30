const Entity = require('./entity');

class Sale extends Entity {
  // - Producto
  // - Descripcion
  // - Cantidad
  // - Fecha de creacion
  // - Cliente
  // - Vendedor
  // - Status: initial > quotation > order > delivery > payment > completed
  // - Cotizaciones *
  // - Ordenes *
  // - Entregas *
  constructor({
    id, code, description, creationDate, status, quantity, units, productId,
    contactId, companyId, sellerId, organizationId,
  }) {
    super({ id });

    this.code = code;
    this.description = description;
    this.creationDate = creationDate || new Date();
    this.status = status || 'initial'; // Validate?
    this.quantity = quantity;
    this.units = units;
    this.productId = productId;
    this.contactId = contactId;
    this.companyId = companyId;
    this.sellerId = sellerId;
    this.organizationId = organizationId;
    // this.logger = logger;
  }

  static get STATUS_INITIAL() {
    return 'initial';
  }

  static get STATUS_QUOTATION() {
    return 'quotation';
  }

  static get STATUS_ORDER() {
    return 'order';
  }

  static get STATUS_PAYMENT() {
    return 'payment';
  }

  static get STATUS_COMPLETE() {
    return 'complete';
  }

  quote() {
    if (this.status != Sale.STATUS_INITIAL) {
      throw new InvalidStatus('');
    }
  }

  produce() {
    if (this.status != Sale.STATUS_QUOTATION) {
      throw new Error('');
    }
  }

  deliver() {
    if (this.status != Sale.STATUS_ORDER) {
      throw new Error('');
    }
  }

  pay() {
    if (this.status != Sale.STATUS_DELIVERY) {
      throw new Error('');
    }
  }

  complete() {
    if (this.status != Sale.STATUS_PAYMENT) {
      throw new Error('');
    }
  }
}


module.exports = Sale;
