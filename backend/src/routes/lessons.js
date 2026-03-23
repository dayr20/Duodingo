const express = require('express');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/lessons/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('topic');
    if (!lesson) {
      return res.status(404).json({ message: 'Leçon non trouvée.' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// POST /api/lessons/:id/complete
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const { score, correctAnswers, totalExercises } = req.body;
    const lesson = await Lesson.findById(req.params.id).populate('topic');

    if (!lesson) {
      return res.status(404).json({ message: 'Leçon non trouvée.' });
    }

    const user = await User.findById(req.user._id);
    const xpEarned = Math.round((correctAnswers / totalExercises) * lesson.xpReward);

    // Update user XP and level
    user.xp += xpEarned;
    user.level = Math.floor(user.xp / 100) + 1;

    // Update streak
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastPractice = user.lastPractice
      ? new Date(user.lastPractice.getFullYear(), user.lastPractice.getMonth(), user.lastPractice.getDate())
      : null;

    if (!lastPractice || lastPractice.getTime() !== today.getTime()) {
      if (lastPractice) {
        const diffDays = (today - lastPractice) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          user.streak += 1;
        } else if (diffDays > 1) {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }
    }
    user.lastPractice = now;

    // Add to completed lessons
    if (!user.completedLessons.includes(lesson._id)) {
      user.completedLessons.push(lesson._id);
    }

    // Check achievements
    if (user.completedLessons.length === 1 && !user.achievements.find(a => a.name === 'Première leçon')) {
      user.achievements.push({ name: 'Première leçon', icon: '🎯' });
    }
    if (user.streak >= 7 && !user.achievements.find(a => a.name === 'Série de 7 jours')) {
      user.achievements.push({ name: 'Série de 7 jours', icon: '🔥' });
    }
    if (user.xp >= 500 && !user.achievements.find(a => a.name === '500 XP')) {
      user.achievements.push({ name: '500 XP', icon: '⭐' });
    }

    await user.save();

    // Update progress
    const languageId = lesson.topic.language;
    let progress = await UserProgress.findOne({ user: user._id, language: languageId });

    if (!progress) {
      progress = new UserProgress({ user: user._id, language: languageId });
    }

    const alreadyCompleted = progress.completedLessons.find(
      cl => cl.lesson.toString() === lesson._id.toString()
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({
        lesson: lesson._id,
        score,
        xpEarned,
      });
    }

    await progress.save();

    res.json({
      xpEarned,
      totalXP: user.xp,
      level: user.level,
      streak: user.streak,
      newAchievements: user.achievements.slice(-1),
      score,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

module.exports = router;
