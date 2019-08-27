const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  email: String,
  organizationId: mongoose.ObjectId,
});

module.exports = mongoose.model('User', schema);
