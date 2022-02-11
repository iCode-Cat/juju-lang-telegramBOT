// Store temporary word of an user.
const mongoose = require('mongoose');

const tempWordSchema = new mongoose.Schema(
  {
    userId: String,
    word: { type: String, lowercase: true, trim: true },
    meaning: { type: String },
  },
  { timestamps: true }
);

module.exports = UserTemp = mongoose.model('temp_word', tempWordSchema);
