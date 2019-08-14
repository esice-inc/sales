const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  creationDate: Date,
  status: String,
  startDate: Date,
  endDate: Date,
  estimatedDevelopmentTime: Date,
  saleId: mongoose.ObjectId,
  quotationId: mongoose.ObjectId,
  workerId: mongoose.ObjectId,
});

module.exports = mongoose.model('Order', schema);
