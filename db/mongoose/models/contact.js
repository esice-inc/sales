const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  email: String,
  telephone: String,
});

module.exports = mongoose.model('Contact', schema);
