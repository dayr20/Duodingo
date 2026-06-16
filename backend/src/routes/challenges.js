const express = require('express');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Pool de défis rotatifs (générés dynamiquement si pas en base)
const CHALLENGE_POOL = [
  {
    title: 'Le piège du typeof',
    description: 'Un classique de JavaScript qui surprend même les développeurs expérimentés.',
    language: 'javascript',
    type: 'qcm',
    question: 'Que retourne typeof null en JavaScript ?',
    codeSnippet: 'console.log(typeof null);',
    options: [
      { text: '"null"', isCorrect: false },
      { text: '"undefined"', isCorrect: false },
      { text: '"object"', isCorrect: true },
      { text: '"boolean"', isCorrect: false },
    ],
    correctAnswer: '"object"',
    explanation: 'C\'est un bug historique de JavaScript datant de 1995. typeof null retourne "object" alors qu\'on attendrait "null".',
    xpReward: 50,
  },
  {
    title: 'Coercition mystérieuse',
    description: 'JavaScript et ses conversions implicites réservent des surprises.',
    language: 'javascript',
    type: 'qcm',
    question: 'Que retourne 0 == false en JavaScript ?',
    codeSnippet: 'console.log(0 == false);',
    options: [
      { text: 'true', isCorrect: true },
      { text: 'false', isCorrect: false },
      { text: 'undefined', isCorrect: false },
      { text: 'Erreur', isCorrect: false },
    ],
    correctAnswer: 'true',
    explanation: '== fait une coercition de type : false est converti en 0, donc 0 == 0 est true. Utilisez === pour éviter cela.',
    xpReward: 50,
  },
  {
    title: 'Portée des closures',
    description: 'Les closures JavaScript peuvent créer des comportements inattendus avec var.',
    language: 'javascript',
    type: 'qcm',
    question: 'Que va afficher ce code ?',
    codeSnippet: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}',
    options: [
      { text: '0, 1, 2', isCorrect: false },
      { text: '3, 3, 3', isCorrect: true },
      { text: '0, 0, 0', isCorrect: false },
      { text: 'Erreur', isCorrect: false },
    ],
    correctAnswer: '3, 3, 3',
    explanation: 'var a une portée de fonction. Quand les callbacks s\'exécutent, la boucle est terminée et i vaut 3. Avec let, on obtiendrait 0, 1, 2.',
    xpReward: 60,
  },
  {
    title: 'NaN est un nombre',
    description: 'Un paradoxe célèbre en JavaScript.',
    language: 'javascript',
    type: 'true_false',
    question: 'typeof NaN retourne "number" en JavaScript.',
    codeSnippet: 'typeof NaN',
    options: [
      { text: 'Vrai', isCorrect: true },
      { text: 'Faux', isCorrect: false },
    ],
    correctAnswer: 'Vrai',
    explanation: 'NaN (Not a Number) est de type "number". Pour détecter NaN, utilisez Number.isNaN() car NaN !== NaN.',
    xpReward: 40,
  },
  {
    title: 'Python : liste ou copie ?',
    description: 'L\'affectation en Python peut réserver des surprises avec les listes.',
    language: 'python',
    type: 'qcm',
    question: 'Que va afficher ce code Python ?',
    codeSnippet: 'a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)',
    options: [
      { text: '[1, 2, 3]', isCorrect: false },
      { text: '[1, 2, 3, 4]', isCorrect: true },
      { text: '[4]', isCorrect: false },
      { text: 'Erreur', isCorrect: false },
    ],
    correctAnswer: '[1, 2, 3, 4]',
    explanation: 'b = a ne copie pas la liste, les deux variables pointent vers le même objet. Pour copier : b = a.copy() ou b = a[:].',
    xpReward: 55,
  },
  {
    title: 'Python : valeur par défaut mutable',
    description: 'Un piège classique des fonctions Python.',
    language: 'python',
    type: 'true_false',
    question: 'En Python, les arguments par défaut mutables sont partagés entre tous les appels de fonction.',
    codeSnippet: 'def f(lst=[]):\n  lst.append(1)\n  return lst',
    options: [
      { text: 'Vrai', isCorrect: true },
      { text: 'Faux', isCorrect: false },
    ],
    correctAnswer: 'Vrai',
    explanation: 'Les valeurs par défaut mutables (list, dict) sont évaluées une seule fois. f() retourne [1], f() retourne [1,1], etc. Utilisez None comme défaut.',
    xpReward: 60,
  },
  {
    title: 'Spécificité CSS',
    description: 'Comprendre quelle règle CSS s\'applique en cas de conflit.',
    language: 'html-css',
    type: 'qcm',
    question: 'Quel sélecteur a la plus haute spécificité ?',
    options: [
      { text: 'p', isCorrect: false },
      { text: '.class', isCorrect: false },
      { text: '#id', isCorrect: true },
      { text: 'div p', isCorrect: false },
    ],
    correctAnswer: '#id',
    explanation: 'L\'ordre de spécificité : inline style (1000) > #id (100) > .class (10) > élément (1). Un id l\'emporte toujours sur une classe.',
    xpReward: 45,
  },
  {
    title: 'Hoisting JavaScript',
    description: 'Le "hissage" des déclarations en JavaScript.',
    language: 'javascript',
    type: 'qcm',
    question: 'Que va afficher ce code ?',
    codeSnippet: 'console.log(x);\nvar x = 5;',
    options: [
      { text: '5', isCorrect: false },
      { text: 'undefined', isCorrect: true },
      { text: 'null', isCorrect: false },
      { text: 'ReferenceError', isCorrect: false },
    ],
    correctAnswer: 'undefined',
    explanation: 'var est "hissé" (hoisted) en haut de la fonction, mais pas son initialisation. La déclaration existe mais la valeur est undefined jusqu\'à la ligne x = 5.',
    xpReward: 60,
  },
  {
    title: 'Spread operator Python',
    description: 'L\'unpacking d\'arguments en Python.',
    language: 'python',
    type: 'fill_code',
    question: 'Complétez pour fusionner deux listes en Python.',
    codeSnippet: 'a = [1, 2]\nb = [3, 4]\nc = [___a, ___b]',
    options: [
      { text: '*', isCorrect: true },
      { text: '**', isCorrect: false },
      { text: '&', isCorrect: false },
      { text: '+', isCorrect: false },
    ],
    correctAnswer: '*',
    explanation: 'L\'opérateur * décompresse une liste dans une autre. c = [*a, *b] donne [1, 2, 3, 4].',
    xpReward: 55,
  },
  {
    title: 'CSS : block vs inline',
    description: 'La différence fondamentale entre les éléments block et inline.',
    language: 'html-css',
    type: 'true_false',
    question: 'Un élément <span> prend toute la largeur disponible par défaut.',
    options: [
      { text: 'Vrai', isCorrect: false },
      { text: 'Faux', isCorrect: true },
    ],
    correctAnswer: 'Faux',
    explanation: '<span> est un élément inline. Il ne prend que la place de son contenu. Les éléments block comme <div> et <p> prennent toute la largeur.',
    xpReward: 40,
  },
  {
    title: 'Array destructuring',
    description: 'La déstructuration moderne en JavaScript.',
    language: 'javascript',
    type: 'fill_code',
    question: 'Complétez pour extraire les deux premiers éléments.',
    codeSnippet: 'const [a, b] = [1, 2, 3];\nconsole.log(___);',
    options: [
      { text: 'a + b', isCorrect: true },
      { text: 'a, b', isCorrect: false },
      { text: '[a, b]', isCorrect: false },
      { text: 'a * b', isCorrect: false },
    ],
    correctAnswer: 'a + b',
    explanation: 'a vaut 1 et b vaut 2 après la déstructuration. console.log(a + b) affiche 3.',
    xpReward: 45,
  },
  {
    title: 'Python : comprehension de liste',
    description: 'La façon pythonique de créer des listes.',
    language: 'python',
    type: 'qcm',
    question: 'Que retourne ce code ?',
    codeSnippet: '[x**2 for x in range(4)]',
    options: [
      { text: '[1, 4, 9, 16]', isCorrect: false },
      { text: '[0, 1, 4, 9]', isCorrect: true },
      { text: '[0, 1, 2, 3]', isCorrect: false },
      { text: '[4, 9, 16, 25]', isCorrect: false },
    ],
    correctAnswer: '[0, 1, 4, 9]',
    explanation: 'range(4) génère 0,1,2,3. Les carrés sont 0²=0, 1²=1, 2²=4, 3²=9.',
    xpReward: 50,
  },
];

const getTodayDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getOrCreateTodayChallenge = async () => {
  const today = getTodayDate();
  let challenge = await Challenge.findOne({ date: today });
  if (!challenge) {
    // Pick one from pool based on day-of-year for variety
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const template = CHALLENGE_POOL[dayOfYear % CHALLENGE_POOL.length];
    challenge = await Challenge.create({ date: today, ...template });
  }
  return challenge;
};

// GET /api/challenges/today
router.get('/today', auth, async (req, res) => {
  try {
    const challenge = await getOrCreateTodayChallenge();
    const completed = challenge.completedBy.map(id => id.toString()).includes(req.user._id.toString());
    res.json({
      ...challenge.toObject(),
      completed,
      completedCount: challenge.completedBy.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// POST /api/challenges/today/complete
router.post('/today/complete', auth, async (req, res) => {
  try {
    const { answer } = req.body;
    const challenge = await getOrCreateTodayChallenge();

    if (challenge.completedBy.map(id => id.toString()).includes(req.user._id.toString())) {
      return res.status(400).json({ message: 'Défi déjà complété aujourd\'hui.' });
    }

    const correct = answer === challenge.correctAnswer;
    if (!correct) {
      return res.json({ correct: false, explanation: challenge.explanation, xpEarned: 0 });
    }

    challenge.completedBy.push(req.user._id);
    await challenge.save();

    const user = await User.findById(req.user._id);
    user.xp += challenge.xpReward;
    user.level = Math.floor(user.xp / 100) + 1;
    if (!user.achievements.find(a => a.name === 'Premier défi')) {
      user.achievements.push({ name: 'Premier défi', icon: '⚡' });
    }
    await user.save();

    res.json({
      correct: true,
      explanation: challenge.explanation,
      xpEarned: challenge.xpReward,
      totalXP: user.xp,
      level: user.level,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

// GET /api/challenges/history
router.get('/history', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({
      completedBy: req.user._id,
    }).select('date title language xpReward').sort({ date: -1 }).limit(30);
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});

module.exports = router;
