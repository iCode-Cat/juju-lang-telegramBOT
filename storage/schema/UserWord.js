// Store words that user registered
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    word: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

module.exports = UserWord = mongoose.model('user_word', wordSchema);