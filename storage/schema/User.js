const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  lang: String,
});

module.exports = User = mongoose.model('user', userSchema);
