const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  creationDate: Date,
  status: String,
  deliveryDate: Date,
  estimatedDeliveryTime: Date,
  saleId: mongoose.ObjectId,
  orderId: mongoose.ObjectId,
  dealerId: mongoose.ObjectId,
  contactId: mongoose.ObjectId,
});

module.exports = mongoose.model('Delivery', schema);
