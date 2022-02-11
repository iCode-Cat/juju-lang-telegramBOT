const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: String,
    lang: String,
  },
  { timestamps: true }
);

module.exports = User = mongoose.model('user', userSchema);
