// Store words that queried before
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema(
  {
    word: { type: String, lowercase: true, trim: true },
    meaning: { type: String },
  },
  { timestamps: true }
);

module.exports = Word = mongoose.model('perm_word', wordSchema);
