const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true,
  },
  completedLessons: [{
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    completedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
  }],
  topicProgress: [{
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    lessonsCompleted: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
  }],
}, { timestamps: true });

userProgressSchema.index({ user: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
