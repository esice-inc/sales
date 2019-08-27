const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  creationDate: Date,
  status: String,
  price: Number,
  estimatedPaymentTime: Date,
  estimatedDeliveryTime: Date,
  saleId: mongoose.ObjectId,
  contactId: mongoose.ObjectId,
});

module.exports = mongoose.model('Quotation', schema);
