const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  userId: mongoose.ObjectId,
  organizationId: mongoose.ObjectId,
});

module.exports = mongoose.model('UserOrganization', schema);
