const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  creationDate: Date,
});

module.exports = mongoose.model('Company', schema);
