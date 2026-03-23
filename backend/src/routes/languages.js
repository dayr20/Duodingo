const express = require('express');
const Language = require('../models/Language');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/languages
router.get('/', async (req, res) => {
  try {
    const languages = await Language.find().sort({ order: 1 });
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// GET /api/languages/:id/topics
router.get('/:id/topics', async (req, res) => {
  try {
    const topics = await Topic.find({ language: req.params.id }).sort({ order: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// GET /api/languages/:langId/topics/:topicId/lessons
router.get('/:langId/topics/:topicId/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({ topic: req.params.topicId })
      .sort({ order: 1 })
      .select('-exercises');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

module.exports = router;
