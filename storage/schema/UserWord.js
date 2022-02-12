// Store words that user registered
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  word: { type: String, lowercase: true, trim: true },
  meaning: { type: String },
  time: { type: Date, default: Date.now() },
});

module.exports = UserWord = mongoose.model('user_word', wordSchema);
