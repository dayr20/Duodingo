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

const HEART_REGEN_MINUTES = 30;
const MAX_HEARTS = 5;

const applyHeartRegen = (user) => {
  if (user.hearts >= MAX_HEARTS) return;
  if (!user.heartsLastLost) return;

  const minutesSinceLost = (Date.now() - new Date(user.heartsLastLost).getTime()) / 60000;
  const heartsToRegen = Math.min(
    Math.floor(minutesSinceLost / HEART_REGEN_MINUTES),
    MAX_HEARTS - user.hearts,
  );

  if (heartsToRegen > 0) {
    user.hearts = Math.min(user.hearts + heartsToRegen, MAX_HEARTS);
    if (user.hearts >= MAX_HEARTS) {
      user.heartsLastLost = null;
    }
  }
};

// POST /api/progress/hearts
router.post('/hearts', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'lose' or 'refill'
    const user = await User.findById(req.user._id);

    applyHeartRegen(user);

    if (action === 'lose') {
      if (user.hearts > 0) {
        user.hearts = user.hearts - 1;
        if (!user.heartsLastLost || user.hearts < MAX_HEARTS) {
          user.heartsLastLost = new Date();
        }
      }
    } else if (action === 'refill') {
      user.hearts = MAX_HEARTS;
      user.heartsLastLost = null;
    }

    await user.save();

    const nextRegenAt = user.hearts < MAX_HEARTS && user.heartsLastLost
      ? new Date(new Date(user.heartsLastLost).getTime() + HEART_REGEN_MINUTES * 60000)
      : null;

    res.json({ hearts: user.hearts, nextRegenAt });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// GET /api/progress/hearts
router.get('/hearts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    applyHeartRegen(user);
    await user.save();

    const nextRegenAt = user.hearts < MAX_HEARTS && user.heartsLastLost
      ? new Date(new Date(user.heartsLastLost).getTime() + HEART_REGEN_MINUTES * 60000)
      : null;

    res.json({ hearts: user.hearts, nextRegenAt, regenMinutes: HEART_REGEN_MINUTES });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// GET /api/progress/leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find({})
      .select('username xp level streak avatar')
      .sort({ xp: -1 })
      .limit(20);

    const leaderboard = users.map((u, index) => ({
      rank: index + 1,
      username: u.username,
      xp: u.xp,
      level: u.level,
      streak: u.streak,
      avatar: u.avatar,
      isMe: u._id.toString() === req.user._id.toString(),
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

module.exports = router;
