const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  code: String,
  description: String,
  creationDate: Date,
  status: String,
  quantity: Number,
  units: String,
  productId: mongoose.ObjectId,
  contactId: mongoose.ObjectId,
  companyId: mongoose.ObjectId,
  sellerId: mongoose.ObjectId,
  organizationId: mongoose.ObjectId,
});

module.exports = mongoose.model('Sale', schema);
