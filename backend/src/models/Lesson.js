const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['qcm', 'fill_code', 'true_false', 'order_code', 'match_pairs'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  codeSnippet: {
    type: String,
    default: null,
  },
  options: [{
    text: String,
    isCorrect: Boolean,
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  xpReward: {
    type: Number,
    default: 10,
  },
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  exercises: [exerciseSchema],
  xpReward: {
    type: Number,
    default: 20,
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
