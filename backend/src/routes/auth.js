const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? 'Cet email est déjà utilisé.'
          : 'Ce nom d\'utilisateur est déjà pris.',
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        hearts: user.hearts,
        streak: user.streak,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Update streak
    const now = new Date();
    const lastPractice = user.lastPractice;
    if (lastPractice) {
      const diffHours = (now - lastPractice) / (1000 * 60 * 60);
      if (diffHours > 48) {
        user.streak = 0;
      }
    }
    user.lastPractice = now;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        hearts: user.hearts,
        streak: user.streak,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      xp: req.user.xp,
      level: req.user.level,
      hearts: req.user.hearts,
      streak: req.user.streak,
      avatar: req.user.avatar,
      achievements: req.user.achievements,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = router;
