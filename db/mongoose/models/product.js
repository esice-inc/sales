const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  code: String,
  type: String,
});

module.exports = mongoose.model('Product', schema);
