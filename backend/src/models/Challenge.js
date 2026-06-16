const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true }, // 'javascript' | 'python' | 'html-css'
  type: { type: String, enum: ['qcm', 'fill_code', 'true_false'], required: true },
  question: { type: String, required: true },
  codeSnippet: { type: String },
  options: [{ text: String, isCorrect: Boolean }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  xpReward: { type: Number, default: 50 },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
