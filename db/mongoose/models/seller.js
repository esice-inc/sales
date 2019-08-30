const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: mongoose.ObjectId,
});

module.exports = mongoose.model('Seller', schema);
