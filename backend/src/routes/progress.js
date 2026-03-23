const express = require('express');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/progress
router.get('/', auth, async (req, res) => {
  try {
    const progress = await UserProgress.find({ user: req.user._id })
      .populate('language')
      .populate('completedLessons.lesson');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// GET /api/progress/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progress = await UserProgress.find({ user: req.user._id });

    const totalLessonsCompleted = progress.reduce(
      (sum, p) => sum + p.completedLessons.length, 0
    );

    res.json({
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      hearts: user.hearts,
      totalLessonsCompleted,
      achievements: user.achievements,
      memberSince: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// POST /api/progress/hearts
router.post('/hearts', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'lose' or 'refill'
    const user = await User.findById(req.user._id);

    if (action === 'lose') {
      user.hearts = Math.max(0, user.hearts - 1);
    } else if (action === 'refill') {
      user.hearts = 5;
    }

    await user.save();
    res.json({ hearts: user.hearts });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

module.exports = router;
