const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const Language = require('../models/Language');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connecté pour le seeding...');

    await Language.deleteMany({});
    await Topic.deleteMany({});
    await Lesson.deleteMany({});
    await User.deleteMany({ email: { $in: ['test@duodingo.com', 'demo@duodingo.com', 'alice@duodingo.com', 'bob@duodingo.com', 'charlie@duodingo.com'] } });

    // === COMPTES DE TEST ===
    await User.create({ username: 'test', email: 'test@duodingo.com', password: 'test1234', xp: 0, level: 1, hearts: 5, streak: 0 });
    await User.create({ username: 'demo', email: 'demo@duodingo.com', password: 'demo1234', xp: 350, level: 4, hearts: 5, streak: 7 });
    await User.create({ username: 'CodeMaster', email: 'alice@duodingo.com', password: 'alice1234', xp: 2500, level: 26, hearts: 5, streak: 45 });
    await User.create({ username: 'DevNinja', email: 'bob@duodingo.com', password: 'bob1234', xp: 2100, level: 22, hearts: 5, streak: 30 });
    await User.create({ username: 'ByteRunner', email: 'charlie@duodingo.com', password: 'charlie1234', xp: 1800, level: 19, hearts: 5, streak: 21 });

    console.log('Comptes de test créés: test@duodingo.com/test1234 | demo@duodingo.com/demo1234');

    // === LANGUAGES ===
    const javascript = await Language.create({ name: 'JavaScript', slug: 'javascript', icon: 'logo-javascript', color: '#F7DF1E', description: 'Le langage du web. Apprenez à créer des sites interactifs.', order: 1 });
    const python = await Language.create({ name: 'Python', slug: 'python', icon: 'logo-python', color: '#3776AB', description: 'Simple et puissant. Idéal pour débuter la programmation.', order: 2 });
    const html = await Language.create({ name: 'HTML/CSS', slug: 'html-css', icon: 'code-slash', color: '#E34F26', description: 'Les bases du web. Créez vos premières pages web.', order: 3 });
    const sql = await Language.create({ name: 'SQL', slug: 'sql', icon: 'server-outline', color: '#336791', description: 'Interrogez et manipulez des bases de données.', order: 4 });
    const typescript = await Language.create({ name: 'TypeScript', slug: 'typescript', icon: 'code-working-outline', color: '#3178C6', description: 'JavaScript avec des types. Plus sûr, plus lisible.', order: 5 });

    // === TOPICS JAVASCRIPT ===
    const jsVariables = await Topic.create({ name: 'Variables', slug: 'variables', icon: 'cube-outline', language: javascript._id, order: 1, requiredXP: 0, description: 'Apprenez à stocker des données avec let, const et var.' });
    const jsTypes = await Topic.create({ name: 'Types de données', slug: 'types', icon: 'layers-outline', language: javascript._id, order: 2, requiredXP: 50, description: 'Strings, Numbers, Booleans et plus encore.' });
    const jsConditions = await Topic.create({ name: 'Conditions', slug: 'conditions', icon: 'git-branch-outline', language: javascript._id, order: 3, requiredXP: 120, description: 'Prenez des décisions avec if, else et switch.' });
    const jsLoops = await Topic.create({ name: 'Boucles', slug: 'boucles', icon: 'refresh-outline', language: javascript._id, order: 4, requiredXP: 200, description: 'Répétez des actions avec for, while et do...while.' });
    const jsFunctions = await Topic.create({ name: 'Fonctions', slug: 'fonctions', icon: 'code-working-outline', language: javascript._id, order: 5, requiredXP: 300, description: 'Créez des blocs de code réutilisables.' });
    const jsArrays = await Topic.create({ name: 'Tableaux', slug: 'tableaux', icon: 'list-outline', language: javascript._id, order: 6, requiredXP: 400, description: 'Manipulez des collections de données.' });

    // === TOPICS PYTHON ===
    const pyIntro = await Topic.create({ name: 'Introduction', slug: 'introduction', icon: 'rocket-outline', language: python._id, order: 1, requiredXP: 0, description: 'Vos premiers pas en Python.' });
    const pyVariables = await Topic.create({ name: 'Variables', slug: 'variables-py', icon: 'cube-outline', language: python._id, order: 2, requiredXP: 50, description: 'Stocker des données en Python.' });
    const pyConditions = await Topic.create({ name: 'Conditions', slug: 'conditions-py', icon: 'git-branch-outline', language: python._id, order: 3, requiredXP: 120, description: 'if, elif, else en Python.' });
    const pyLoops = await Topic.create({ name: 'Boucles', slug: 'boucles-py', icon: 'refresh-outline', language: python._id, order: 4, requiredXP: 200, description: 'for et while en Python.' });

    // === TOPICS HTML/CSS ===
    const htmlBasics = await Topic.create({ name: 'Bases HTML', slug: 'bases-html', icon: 'document-outline', language: html._id, order: 1, requiredXP: 0, description: 'Les balises essentielles du HTML.' });
    const cssBasics = await Topic.create({ name: 'Bases CSS', slug: 'bases-css', icon: 'color-palette-outline', language: html._id, order: 2, requiredXP: 50, description: 'Stylisez vos pages web.' });
    const cssLayout = await Topic.create({ name: 'Mise en page', slug: 'css-layout', icon: 'grid-outline', language: html._id, order: 3, requiredXP: 120, description: 'Flexbox et mise en page CSS.' });

    // ==========================================
    // === LESSONS JAVASCRIPT - Variables ===
    // ==========================================
    await Lesson.create({
      title: 'Déclarer une variable',
      topic: jsVariables._id, order: 1, xpReward: 20,
      description: 'Apprenez à créer des variables avec let et const.',
      exercises: [
        { type: 'qcm', question: 'Quel mot-clé est recommandé pour déclarer une variable qui ne change pas ?', options: [{ text: 'var', isCorrect: false }, { text: 'let', isCorrect: false }, { text: 'const', isCorrect: true }, { text: 'variable', isCorrect: false }], correctAnswer: 'const', explanation: 'const déclare une constante dont la valeur ne peut pas être réassignée.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez le code pour déclarer une variable "age" avec la valeur 25.', codeSnippet: '___ age = 25;', options: [{ text: 'let', isCorrect: true }, { text: 'var', isCorrect: false }, { text: 'int', isCorrect: false }, { text: 'define', isCorrect: false }], correctAnswer: 'let', explanation: 'let permet de déclarer une variable dont la valeur peut changer.', xpReward: 10 },
        { type: 'true_false', question: 'En JavaScript, on peut réassigner la valeur d\'une variable déclarée avec const.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'const crée une constante. Une fois assignée, sa valeur ne peut pas être changée.', xpReward: 10 },
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'let x = 10;\nx = 20;\nconsole.log(x);', options: [{ text: '10', isCorrect: false }, { text: '20', isCorrect: true }, { text: 'undefined', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: '20', explanation: 'let permet la réassignation. x est d\'abord 10, puis réassigné à 20.', xpReward: 10 },
        { type: 'order_code', question: 'Mettez les lignes dans le bon ordre pour déclarer et afficher une variable.', options: [{ text: 'let message = "Bonjour";', isCorrect: true }, { text: 'console.log(message);', isCorrect: true }], correctAnswer: ['let message = "Bonjour";', 'console.log(message);'], explanation: 'On doit d\'abord déclarer la variable avant de l\'utiliser.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Nommer ses variables',
      topic: jsVariables._id, order: 2, xpReward: 20,
      description: 'Les règles de nommage des variables en JavaScript.',
      exercises: [
        { type: 'qcm', question: 'Quel nom de variable est valide en JavaScript ?', options: [{ text: '2nombre', isCorrect: false }, { text: 'mon-nom', isCorrect: false }, { text: 'monNom', isCorrect: true }, { text: 'class', isCorrect: false }], correctAnswer: 'monNom', explanation: 'monNom utilise le camelCase et ne commence pas par un chiffre.', xpReward: 10 },
        { type: 'true_false', question: 'Un nom de variable peut commencer par un chiffre en JavaScript.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'Les noms de variables ne peuvent pas commencer par un chiffre.', xpReward: 10 },
        { type: 'qcm', question: 'Quelle convention de nommage est la plus utilisée en JavaScript ?', options: [{ text: 'snake_case', isCorrect: false }, { text: 'camelCase', isCorrect: true }, { text: 'PascalCase', isCorrect: false }, { text: 'kebab-case', isCorrect: false }], correctAnswer: 'camelCase', explanation: 'Le camelCase est la convention standard en JavaScript (ex: monAge, firstName).', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour déclarer une constante pour le nombre maximum d\'essais.', codeSnippet: 'const ___ = 3;', options: [{ text: 'MAX_ESSAIS', isCorrect: true }, { text: '3essais', isCorrect: false }, { text: 'max-essais', isCorrect: false }, { text: 'class', isCorrect: false }], correctAnswer: 'MAX_ESSAIS', explanation: 'Les constantes sont souvent écrites en MAJUSCULES avec des underscores.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Portée des variables',
      topic: jsVariables._id, order: 3, xpReward: 25,
      description: 'Comprendre la portée (scope) des variables.',
      exercises: [
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'let x = "global";\nfunction test() {\n  let x = "local";\n  console.log(x);\n}\ntest();', options: [{ text: '"global"', isCorrect: false }, { text: '"local"', isCorrect: true }, { text: 'undefined', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: '"local"', explanation: 'La variable locale x dans la fonction masque la variable globale.', xpReward: 10 },
        { type: 'true_false', question: 'Une variable déclarée avec let dans un bloc {} est accessible en dehors de ce bloc.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'let a une portée de bloc. Elle n\'est accessible qu\'à l\'intérieur du bloc {}.', xpReward: 10 },
        { type: 'qcm', question: 'Quel mot-clé crée une variable avec portée de fonction (pas de bloc) ?', options: [{ text: 'let', isCorrect: false }, { text: 'const', isCorrect: false }, { text: 'var', isCorrect: true }, { text: 'global', isCorrect: false }], correctAnswer: 'var', explanation: 'var a une portée de fonction, contrairement à let et const qui ont une portée de bloc.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour déclarer x comme variable globale, puis locale.', codeSnippet: '___ x = 10;\nfunction f() {\n  ___ x = 20;\n}', options: [{ text: 'let', isCorrect: true }, { text: 'const', isCorrect: false }, { text: 'var', isCorrect: false }, { text: 'global', isCorrect: false }], correctAnswer: 'let', explanation: 'On peut utiliser let aux deux niveaux pour créer deux variables distinctes.', xpReward: 10 },
      ],
    });

    // ==========================================
    // === LESSONS JAVASCRIPT - Types ===
    // ==========================================
    await Lesson.create({
      title: 'Strings et Numbers',
      topic: jsTypes._id, order: 1, xpReward: 25,
      description: 'Les types de base : chaînes de caractères et nombres.',
      exercises: [
        { type: 'qcm', question: 'Quel est le type de "Hello" en JavaScript ?', options: [{ text: 'number', isCorrect: false }, { text: 'string', isCorrect: true }, { text: 'text', isCorrect: false }, { text: 'char', isCorrect: false }], correctAnswer: 'string', explanation: 'Les textes entre guillemets sont des strings (chaînes de caractères).', xpReward: 10 },
        { type: 'qcm', question: 'Que retourne typeof 42 ?', codeSnippet: 'typeof 42', options: [{ text: '"integer"', isCorrect: false }, { text: '"number"', isCorrect: true }, { text: '"float"', isCorrect: false }, { text: '"num"', isCorrect: false }], correctAnswer: '"number"', explanation: 'En JavaScript, tous les nombres (entiers et décimaux) sont de type "number".', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour créer une string avec des template literals.', codeSnippet: 'let nom = "Alice";\nlet message = `Bonjour ${nom}!`;', options: [{ text: '`', isCorrect: true }, { text: '"', isCorrect: false }, { text: "'", isCorrect: false }, { text: '(', isCorrect: false }], correctAnswer: '`', explanation: 'Les template literals utilisent les backticks (`) pour permettre l\'interpolation.', xpReward: 10 },
        { type: 'true_false', question: '"5" + 3 donne 8 en JavaScript.', codeSnippet: '"5" + 3', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'L\'opérateur + avec une string fait une concaténation. "5" + 3 donne "53".', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Booleans et null',
      topic: jsTypes._id, order: 2, xpReward: 25,
      description: 'Les valeurs booléennes, null et undefined.',
      exercises: [
        { type: 'qcm', question: 'Quelles sont les deux valeurs booléennes possibles en JavaScript ?', options: [{ text: 'yes / no', isCorrect: false }, { text: 'true / false', isCorrect: true }, { text: '1 / 0', isCorrect: false }, { text: 'on / off', isCorrect: false }], correctAnswer: 'true / false', explanation: 'En JavaScript, les booléens sont true (vrai) et false (faux).', xpReward: 10 },
        { type: 'qcm', question: 'Que retourne typeof null ?', codeSnippet: 'typeof null', options: [{ text: '"null"', isCorrect: false }, { text: '"undefined"', isCorrect: false }, { text: '"object"', isCorrect: true }, { text: '"boolean"', isCorrect: false }], correctAnswer: '"object"', explanation: 'C\'est un bug historique de JavaScript : typeof null retourne "object" au lieu de "null".', xpReward: 10 },
        { type: 'true_false', question: 'undefined et null sont la même chose en JavaScript.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'undefined = variable déclarée sans valeur. null = absence intentionnelle de valeur.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour vérifier si une variable est nulle.', codeSnippet: 'let x = null;\nif (x === ___) {\n  console.log("x est null");\n}', options: [{ text: 'null', isCorrect: true }, { text: '"null"', isCorrect: false }, { text: 'undefined', isCorrect: false }, { text: '0', isCorrect: false }], correctAnswer: 'null', explanation: 'On compare avec null (sans guillemets) pour vérifier si une valeur est nulle.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Conversion de types',
      topic: jsTypes._id, order: 3, xpReward: 30,
      description: 'Convertir entre les différents types de données.',
      exercises: [
        { type: 'qcm', question: 'Comment convertir la string "42" en nombre ?', options: [{ text: 'Number("42")', isCorrect: true }, { text: 'toNumber("42")', isCorrect: false }, { text: 'int("42")', isCorrect: false }, { text: 'parse("42")', isCorrect: false }], correctAnswer: 'Number("42")', explanation: 'Number() convertit une valeur en nombre. parseInt() et parseFloat() fonctionnent aussi.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour convertir le nombre 42 en string.', codeSnippet: 'let n = 42;\nlet s = ___(n);', options: [{ text: 'String', isCorrect: true }, { text: 'Text', isCorrect: false }, { text: 'toString', isCorrect: false }, { text: 'str', isCorrect: false }], correctAnswer: 'String', explanation: 'String() convertit n\'importe quelle valeur en chaîne de caractères.', xpReward: 10 },
        { type: 'true_false', question: 'Boolean(0) retourne true en JavaScript.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: '0, "", null, undefined, NaN sont des valeurs "falsy" qui donnent false avec Boolean().', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre pour lire un nombre depuis une string.', options: [{ text: 'let str = "3.14";', isCorrect: true }, { text: 'let n = parseFloat(str);', isCorrect: true }, { text: 'console.log(n + 1);', isCorrect: true }], correctAnswer: ['let str = "3.14";', 'let n = parseFloat(str);', 'console.log(n + 1);'], explanation: 'parseFloat() lit un nombre décimal depuis une chaîne.', xpReward: 10 },
      ],
    });

    // ==========================================
    // === LESSONS JAVASCRIPT - Conditions ===
    // ==========================================
    await Lesson.create({
      title: 'If et Else',
      topic: jsConditions._id, order: 1, xpReward: 25,
      description: 'Apprenez à utiliser les conditions if/else.',
      exercises: [
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'let age = 20;\nif (age >= 18) {\n  console.log("Majeur");\n} else {\n  console.log("Mineur");\n}', options: [{ text: 'Majeur', isCorrect: true }, { text: 'Mineur', isCorrect: false }, { text: 'undefined', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: 'Majeur', explanation: '20 >= 18 est vrai, donc le bloc if s\'exécute.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez la condition pour vérifier si un nombre est positif.', codeSnippet: 'let n = 5;\n___ (n > 0) {\n  console.log("Positif");\n}', options: [{ text: 'if', isCorrect: true }, { text: 'when', isCorrect: false }, { text: 'check', isCorrect: false }, { text: 'while', isCorrect: false }], correctAnswer: 'if', explanation: 'Le mot-clé if est utilisé pour les conditions en JavaScript.', xpReward: 10 },
        { type: 'qcm', question: 'Quel opérateur vérifie l\'égalité stricte (valeur ET type) ?', options: [{ text: '=', isCorrect: false }, { text: '==', isCorrect: false }, { text: '===', isCorrect: true }, { text: '!=', isCorrect: false }], correctAnswer: '===', explanation: '=== compare la valeur ET le type. == ne compare que la valeur.', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre ce code qui vérifie si un nombre est pair.', options: [{ text: 'let nombre = 4;', isCorrect: true }, { text: 'if (nombre % 2 === 0) {', isCorrect: true }, { text: '  console.log("Pair");', isCorrect: true }, { text: '}', isCorrect: true }], correctAnswer: ['let nombre = 4;', 'if (nombre % 2 === 0) {', '  console.log("Pair");', '}'], explanation: 'L\'opérateur % (modulo) donne le reste de la division.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Else if et Switch',
      topic: jsConditions._id, order: 2, xpReward: 30,
      description: 'Gérer plusieurs cas avec else if et switch.',
      exercises: [
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'let note = 15;\nif (note >= 18) {\n  console.log("Excellent");\n} else if (note >= 12) {\n  console.log("Bien");\n} else {\n  console.log("Insuffisant");\n}', options: [{ text: 'Excellent', isCorrect: false }, { text: 'Bien', isCorrect: true }, { text: 'Insuffisant', isCorrect: false }, { text: 'undefined', isCorrect: false }], correctAnswer: 'Bien', explanation: '15 n\'est pas >= 18, mais 15 >= 12, donc "Bien" s\'affiche.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez le switch pour gérer le jour de la semaine.', codeSnippet: 'let jour = "lundi";\n___ (jour) {\n  case "lundi":\n    console.log("Début de semaine");\n    break;\n}', options: [{ text: 'switch', isCorrect: true }, { text: 'case', isCorrect: false }, { text: 'select', isCorrect: false }, { text: 'check', isCorrect: false }], correctAnswer: 'switch', explanation: 'switch est utilisé pour comparer une valeur à plusieurs cas.', xpReward: 10 },
        { type: 'true_false', question: 'Dans un switch, le mot-clé break est obligatoire pour chaque case.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'break n\'est pas obligatoire mais sans lui, les cases suivants s\'exécutent aussi (fall-through).', xpReward: 10 },
        { type: 'qcm', question: 'Que signifie le case default dans un switch ?', options: [{ text: 'Le premier cas', isCorrect: false }, { text: 'Le cas par défaut si aucun autre ne correspond', isCorrect: true }, { text: 'Un cas qui ne s\'exécute jamais', isCorrect: false }, { text: 'Le cas le plus important', isCorrect: false }], correctAnswer: 'Le cas par défaut si aucun autre ne correspond', explanation: 'default s\'exécute si aucun case ne correspond à la valeur testée.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Opérateur ternaire',
      topic: jsConditions._id, order: 3, xpReward: 25,
      description: 'L\'opérateur ternaire : une condition en une ligne.',
      exercises: [
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'let age = 20;\nlet statut = age >= 18 ? "adulte" : "mineur";\nconsole.log(statut);', options: [{ text: '"adulte"', isCorrect: true }, { text: '"mineur"', isCorrect: false }, { text: 'true', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: '"adulte"', explanation: 'age >= 18 est true, donc l\'opérateur ternaire retourne "adulte".', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez l\'opérateur ternaire pour vérifier si x est pair.', codeSnippet: 'let x = 4;\nlet result = x % 2 === 0 ___ "pair" : "impair";', options: [{ text: '?', isCorrect: true }, { text: ':', isCorrect: false }, { text: 'then', isCorrect: false }, { text: '=>', isCorrect: false }], correctAnswer: '?', explanation: 'La syntaxe est : condition ? valeurSiVrai : valeurSiFaux', xpReward: 10 },
        { type: 'true_false', question: 'L\'opérateur ternaire peut remplacer un if/else simple.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'L\'opérateur ternaire est une version condensée du if/else pour les expressions simples.', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre cet opérateur ternaire.', options: [{ text: 'let score = 85;', isCorrect: true }, { text: 'let mention = score >= 80', isCorrect: true }, { text: '  ? "Bien"', isCorrect: true }, { text: '  : "Passable";', isCorrect: true }], correctAnswer: ['let score = 85;', 'let mention = score >= 80', '  ? "Bien"', '  : "Passable";'], explanation: 'L\'opérateur ternaire : condition ? siVrai : siFaux', xpReward: 10 },
      ],
    });

    // ==========================================
    // === LESSONS JAVASCRIPT - Boucles ===
    // ==========================================
    await Lesson.create({
      title: 'La boucle for',
      topic: jsLoops._id, order: 1, xpReward: 25,
      description: 'Répétez des actions avec la boucle for.',
      exercises: [
        { type: 'qcm', question: 'Combien de fois "Hello" sera affiché ?', codeSnippet: 'for (let i = 0; i < 3; i++) {\n  console.log("Hello");\n}', options: [{ text: '2', isCorrect: false }, { text: '3', isCorrect: true }, { text: '4', isCorrect: false }, { text: 'Infini', isCorrect: false }], correctAnswer: '3', explanation: 'i prend les valeurs 0, 1, 2 (3 itérations car i < 3).', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour créer une boucle qui compte de 1 à 5.', codeSnippet: 'for (let i = 1; i ___ 5; i++) {\n  console.log(i);\n}', options: [{ text: '<=', isCorrect: true }, { text: '<', isCorrect: false }, { text: '>', isCorrect: false }, { text: '!=', isCorrect: false }], correctAnswer: '<=', explanation: 'Pour inclure 5, on utilise <= (inférieur ou égal).', xpReward: 10 },
        { type: 'true_false', question: 'Une boucle for doit toujours commencer à 0.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'On peut initialiser la variable de boucle à n\'importe quelle valeur.', xpReward: 10 },
        { type: 'qcm', question: 'Que fait l\'instruction break dans une boucle ?', options: [{ text: 'Elle met en pause la boucle', isCorrect: false }, { text: 'Elle sort immédiatement de la boucle', isCorrect: true }, { text: 'Elle recommence au début', isCorrect: false }, { text: 'Elle continue à l\'itération suivante', isCorrect: false }], correctAnswer: 'Elle sort immédiatement de la boucle', explanation: 'break interrompt la boucle et reprend l\'exécution après elle.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'While et Do...While',
      topic: jsLoops._id, order: 2, xpReward: 25,
      description: 'Les boucles while et do...while.',
      exercises: [
        { type: 'qcm', question: 'Combien de fois la boucle s\'exécute-t-elle ?', codeSnippet: 'let i = 0;\nwhile (i < 4) {\n  i++;\n}', options: [{ text: '3', isCorrect: false }, { text: '4', isCorrect: true }, { text: '5', isCorrect: false }, { text: 'Infini', isCorrect: false }], correctAnswer: '4', explanation: 'i prend les valeurs 0, 1, 2, 3 puis la condition i < 4 devient fausse.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez la boucle while pour afficher les nombres pairs de 0 à 8.', codeSnippet: 'let n = 0;\n___ (n <= 8) {\n  console.log(n);\n  n += 2;\n}', options: [{ text: 'while', isCorrect: true }, { text: 'for', isCorrect: false }, { text: 'loop', isCorrect: false }, { text: 'repeat', isCorrect: false }], correctAnswer: 'while', explanation: 'while exécute le bloc tant que la condition est vraie.', xpReward: 10 },
        { type: 'true_false', question: 'Un do...while s\'exécute toujours au moins une fois.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'do...while teste la condition APRÈS l\'exécution, donc le corps s\'exécute au moins une fois.', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre une boucle do...while.', options: [{ text: 'let count = 0;', isCorrect: true }, { text: 'do {', isCorrect: true }, { text: '  count++;', isCorrect: true }, { text: '} while (count < 3);', isCorrect: true }], correctAnswer: ['let count = 0;', 'do {', '  count++;', '} while (count < 3);'], explanation: 'do { ... } while (condition) exécute d\'abord le bloc, puis vérifie la condition.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Parcourir un tableau',
      topic: jsLoops._id, order: 3, xpReward: 30,
      description: 'Utiliser forEach et for...of pour parcourir des tableaux.',
      exercises: [
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'const fruits = ["pomme", "banane", "cerise"];\nfruits.forEach(f => console.log(f));', options: [{ text: 'pomme seulement', isCorrect: false }, { text: 'Les 3 fruits sur 3 lignes', isCorrect: true }, { text: '[pomme, banane, cerise]', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: 'Les 3 fruits sur 3 lignes', explanation: 'forEach appelle la fonction pour chaque élément du tableau.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour parcourir le tableau avec for...of.', codeSnippet: 'const nombres = [1, 2, 3];\nfor (___ n of nombres) {\n  console.log(n * 2);\n}', options: [{ text: 'let', isCorrect: true }, { text: 'var', isCorrect: false }, { text: 'each', isCorrect: false }, { text: 'const', isCorrect: false }], correctAnswer: 'let', explanation: 'for...of itère sur les valeurs d\'un itérable comme un tableau.', xpReward: 10 },
        { type: 'true_false', question: 'for...of peut être utilisé pour parcourir les propriétés d\'un objet.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'for...of est pour les itérables (tableaux, strings...). Pour les objets, utilisez for...in.', xpReward: 10 },
        { type: 'qcm', question: 'Quelle méthode permet de parcourir un tableau ET transformer ses éléments ?', options: [{ text: 'forEach()', isCorrect: false }, { text: 'for...of', isCorrect: false }, { text: 'map()', isCorrect: true }, { text: 'each()', isCorrect: false }], correctAnswer: 'map()', explanation: 'map() crée un nouveau tableau avec les résultats de la fonction appliquée à chaque élément.', xpReward: 10 },
      ],
    });

    // ==========================================
    // === LESSONS JAVASCRIPT - Fonctions ===
    // ==========================================
    await Lesson.create({
      title: 'Créer une fonction',
      topic: jsFunctions._id, order: 1, xpReward: 25,
      description: 'Apprenez à déclarer et appeler des fonctions.',
      exercises: [
        { type: 'qcm', question: 'Quel mot-clé est utilisé pour déclarer une fonction ?', options: [{ text: 'func', isCorrect: false }, { text: 'def', isCorrect: false }, { text: 'function', isCorrect: true }, { text: 'method', isCorrect: false }], correctAnswer: 'function', explanation: 'En JavaScript, on utilise le mot-clé function pour déclarer une fonction.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour que la fonction retourne la somme de a et b.', codeSnippet: 'function addition(a, b) {\n  ___ a + b;\n}', options: [{ text: 'return', isCorrect: true }, { text: 'give', isCorrect: false }, { text: 'send', isCorrect: false }, { text: 'output', isCorrect: false }], correctAnswer: 'return', explanation: 'Le mot-clé return renvoie une valeur depuis la fonction.', xpReward: 10 },
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'function saluer(nom) {\n  return "Bonjour " + nom;\n}\nconsole.log(saluer("Alice"));', options: [{ text: 'Bonjour', isCorrect: false }, { text: 'Bonjour Alice', isCorrect: true }, { text: 'undefined', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: 'Bonjour Alice', explanation: 'La fonction concatène "Bonjour " avec le paramètre nom ("Alice").', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre pour créer et appeler une fonction.', options: [{ text: 'function doubler(n) {', isCorrect: true }, { text: '  return n * 2;', isCorrect: true }, { text: '}', isCorrect: true }, { text: 'console.log(doubler(5));', isCorrect: true }], correctAnswer: ['function doubler(n) {', '  return n * 2;', '}', 'console.log(doubler(5));'], explanation: 'On déclare d\'abord la fonction, puis on l\'appelle.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Fonctions fléchées',
      topic: jsFunctions._id, order: 2, xpReward: 30,
      description: 'La syntaxe moderne des arrow functions.',
      exercises: [
        { type: 'qcm', question: 'Quelle est la version arrow function de function add(a,b) { return a+b; } ?', options: [{ text: '(a, b) => a + b', isCorrect: true }, { text: 'fn(a, b) => a + b', isCorrect: false }, { text: 'arrow(a, b) { a + b }', isCorrect: false }, { text: '(a, b) -> a + b', isCorrect: false }], correctAnswer: '(a, b) => a + b', explanation: 'Les arrow functions utilisent => et retournent implicitement si pas d\'accolades.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez cette arrow function qui double un nombre.', codeSnippet: 'const doubler = n ___ n * 2;', options: [{ text: '=>', isCorrect: true }, { text: '->', isCorrect: false }, { text: '=', isCorrect: false }, { text: ':', isCorrect: false }], correctAnswer: '=>', explanation: 'La flèche => est la syntaxe des arrow functions en JavaScript.', xpReward: 10 },
        { type: 'true_false', question: 'Une arrow function avec un seul paramètre peut omettre les parenthèses.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'n => n * 2 est valide. Les parenthèses sont optionnelles avec un seul paramètre.', xpReward: 10 },
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'const carre = x => x * x;\nconsole.log(carre(4));', options: [{ text: '8', isCorrect: false }, { text: '16', isCorrect: true }, { text: '4', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: '16', explanation: 'carre(4) retourne 4 * 4 = 16.', xpReward: 10 },
      ],
    });

    // ==========================================
    // === LESSONS JAVASCRIPT - Tableaux ===
    // ==========================================
    await Lesson.create({
      title: 'Introduction aux tableaux',
      topic: jsArrays._id, order: 1, xpReward: 25,
      description: 'Créer et accéder aux éléments d\'un tableau.',
      exercises: [
        { type: 'qcm', question: 'Que va afficher ce code ?', codeSnippet: 'const fruits = ["pomme", "banane", "cerise"];\nconsole.log(fruits[1]);', options: [{ text: '"pomme"', isCorrect: false }, { text: '"banane"', isCorrect: true }, { text: '"cerise"', isCorrect: false }, { text: 'undefined', isCorrect: false }], correctAnswer: '"banane"', explanation: 'Les index commencent à 0. fruits[1] est le deuxième élément : "banane".', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour obtenir la longueur du tableau.', codeSnippet: 'const tab = [1, 2, 3, 4];\nconsole.log(tab.___);', options: [{ text: 'length', isCorrect: true }, { text: 'size', isCorrect: false }, { text: 'count', isCorrect: false }, { text: 'len', isCorrect: false }], correctAnswer: 'length', explanation: 'La propriété length retourne le nombre d\'éléments dans le tableau.', xpReward: 10 },
        { type: 'true_false', question: 'Un tableau JavaScript peut contenir des éléments de types différents.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'En JavaScript, un tableau peut mélanger strings, numbers, booleans, objets, etc.', xpReward: 10 },
        { type: 'qcm', question: 'Quelle méthode ajoute un élément à la fin d\'un tableau ?', options: [{ text: 'add()', isCorrect: false }, { text: 'append()', isCorrect: false }, { text: 'push()', isCorrect: true }, { text: 'insert()', isCorrect: false }], correctAnswer: 'push()', explanation: 'push() ajoute un ou plusieurs éléments à la fin du tableau et retourne sa nouvelle longueur.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Méthodes de tableaux',
      topic: jsArrays._id, order: 2, xpReward: 30,
      description: 'Les méthodes essentielles : filter, map, find.',
      exercises: [
        { type: 'qcm', question: 'Que retourne ce code ?', codeSnippet: 'const nombres = [1, 2, 3, 4, 5];\nconst pairs = nombres.filter(n => n % 2 === 0);\nconsole.log(pairs);', options: [{ text: '[1, 3, 5]', isCorrect: false }, { text: '[2, 4]', isCorrect: true }, { text: '[1, 2, 3, 4, 5]', isCorrect: false }, { text: '2', isCorrect: false }], correctAnswer: '[2, 4]', explanation: 'filter() crée un nouveau tableau avec les éléments pour lesquels la fonction retourne true.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour doubler chaque élément du tableau.', codeSnippet: 'const nums = [1, 2, 3];\nconst doubles = nums.___(n => n * 2);', options: [{ text: 'map', isCorrect: true }, { text: 'filter', isCorrect: false }, { text: 'forEach', isCorrect: false }, { text: 'find', isCorrect: false }], correctAnswer: 'map', explanation: 'map() transforme chaque élément et retourne un nouveau tableau.', xpReward: 10 },
        { type: 'true_false', question: 'La méthode filter() modifie le tableau d\'origine.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'filter() retourne un nouveau tableau sans modifier l\'original.', xpReward: 10 },
        { type: 'qcm', question: 'Quelle méthode retourne le premier élément satisfaisant une condition ?', options: [{ text: 'filter()', isCorrect: false }, { text: 'map()', isCorrect: false }, { text: 'find()', isCorrect: true }, { text: 'some()', isCorrect: false }], correctAnswer: 'find()', explanation: 'find() retourne le premier élément pour lequel la fonction retourne true (ou undefined si aucun).', xpReward: 10 },
      ],
    });

    // ==========================================
    // === LESSONS PYTHON ===
    // ==========================================
    await Lesson.create({
      title: 'Premier programme',
      topic: pyIntro._id, order: 1, xpReward: 20,
      description: 'Écrivez votre premier programme Python.',
      exercises: [
        { type: 'qcm', question: 'Quelle fonction affiche du texte en Python ?', options: [{ text: 'console.log()', isCorrect: false }, { text: 'echo()', isCorrect: false }, { text: 'print()', isCorrect: true }, { text: 'write()', isCorrect: false }], correctAnswer: 'print()', explanation: 'En Python, print() est la fonction pour afficher du texte.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour afficher "Hello World".', codeSnippet: '___("Hello World")', options: [{ text: 'print', isCorrect: true }, { text: 'echo', isCorrect: false }, { text: 'log', isCorrect: false }, { text: 'display', isCorrect: false }], correctAnswer: 'print', explanation: 'print() est la fonction d\'affichage en Python.', xpReward: 10 },
        { type: 'true_false', question: 'Python utilise des accolades {} pour délimiter les blocs de code.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'Python utilise l\'indentation (espaces/tabulations) pour délimiter les blocs.', xpReward: 10 },
        { type: 'qcm', question: 'Comment écrire un commentaire en Python ?', options: [{ text: '// commentaire', isCorrect: false }, { text: '/* commentaire */', isCorrect: false }, { text: '# commentaire', isCorrect: true }, { text: '-- commentaire', isCorrect: false }], correctAnswer: '# commentaire', explanation: 'En Python, les commentaires commencent par le symbole #.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Variables Python',
      topic: pyVariables._id, order: 1, xpReward: 20,
      description: 'Les variables en Python.',
      exercises: [
        { type: 'qcm', question: 'Comment déclarer une variable "age" valant 25 en Python ?', options: [{ text: 'let age = 25', isCorrect: false }, { text: 'int age = 25', isCorrect: false }, { text: 'age = 25', isCorrect: true }, { text: 'var age = 25', isCorrect: false }], correctAnswer: 'age = 25', explanation: 'En Python, pas besoin de mot-clé pour déclarer une variable.', xpReward: 10 },
        { type: 'true_false', question: 'En Python, il faut déclarer le type d\'une variable.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'Python est un langage à typage dynamique. Le type est déduit automatiquement.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour afficher le type de la variable x.', codeSnippet: 'x = 3.14\nprint(___(x))', options: [{ text: 'type', isCorrect: true }, { text: 'typeof', isCorrect: false }, { text: 'class', isCorrect: false }, { text: 'kind', isCorrect: false }], correctAnswer: 'type', explanation: 'La fonction type() retourne le type d\'une variable en Python.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Strings Python',
      topic: pyVariables._id, order: 2, xpReward: 25,
      description: 'Manipuler les chaînes de caractères en Python.',
      exercises: [
        { type: 'qcm', question: 'Que va afficher ce code Python ?', codeSnippet: 'nom = "Alice"\nprint(f"Bonjour {nom}!")', options: [{ text: 'Bonjour nom!', isCorrect: false }, { text: 'Bonjour Alice!', isCorrect: true }, { text: 'f"Bonjour {nom}!"', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: 'Bonjour Alice!', explanation: 'Les f-strings (préfixe f) permettent d\'insérer des variables dans une chaîne.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour obtenir la longueur de la chaîne.', codeSnippet: 'texte = "Python"\nprint(___(texte))', options: [{ text: 'len', isCorrect: true }, { text: 'length', isCorrect: false }, { text: 'size', isCorrect: false }, { text: 'count', isCorrect: false }], correctAnswer: 'len', explanation: 'La fonction len() retourne la longueur d\'une chaîne ou d\'une liste.', xpReward: 10 },
        { type: 'true_false', question: 'En Python, on peut multiplier une string : "ab" * 3 donne "ababab".', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'Python permet la répétition de chaînes avec l\'opérateur *. "ab" * 3 = "ababab".', xpReward: 10 },
        { type: 'qcm', question: 'Comment accéder au premier caractère de la string "Python" ?', options: [{ text: '"Python"[1]', isCorrect: false }, { text: '"Python"[0]', isCorrect: true }, { text: '"Python".first()', isCorrect: false }, { text: '"Python".charAt(0)', isCorrect: false }], correctAnswer: '"Python"[0]', explanation: 'Comme JavaScript, les index commencent à 0 en Python.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'If / elif / else',
      topic: pyConditions._id, order: 1, xpReward: 25,
      description: 'Les conditions en Python.',
      exercises: [
        { type: 'qcm', question: 'Quelle est la syntaxe correcte du "else if" en Python ?', options: [{ text: 'else if', isCorrect: false }, { text: 'elsif', isCorrect: false }, { text: 'elif', isCorrect: true }, { text: 'elseif', isCorrect: false }], correctAnswer: 'elif', explanation: 'Python utilise elif (contraction de "else if") pour les conditions multiples.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez ce programme Python.', codeSnippet: 'note = 15\n___ note >= 16:\n  print("Très bien")\n___ note >= 12:\n  print("Bien")\nelse:\n  print("Passable")', options: [{ text: 'if', isCorrect: true }, { text: 'elif', isCorrect: false }, { text: 'when', isCorrect: false }, { text: 'check', isCorrect: false }], correctAnswer: 'if', explanation: 'if commence la condition, puis elif pour les cas suivants.', xpReward: 10 },
        { type: 'true_false', question: 'En Python, les blocs if/else doivent terminer par deux-points (:).', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'En Python, les structures de contrôle (if, for, while, def) se terminent par :.', xpReward: 10 },
        { type: 'qcm', question: 'Que va afficher ce code Python ?', codeSnippet: 'x = 10\nif x > 5:\n  print("Grand")\nelse:\n  print("Petit")', options: [{ text: 'Petit', isCorrect: false }, { text: 'Grand', isCorrect: true }, { text: 'Grand Petit', isCorrect: false }, { text: 'Erreur', isCorrect: false }], correctAnswer: 'Grand', explanation: '10 > 5 est True, donc "Grand" s\'affiche.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Boucles Python',
      topic: pyLoops._id, order: 1, xpReward: 25,
      description: 'Les boucles for et while en Python.',
      exercises: [
        { type: 'qcm', question: 'Que va afficher ce code Python ?', codeSnippet: 'for i in range(3):\n  print(i)', options: [{ text: '1 2 3', isCorrect: false }, { text: '0 1 2', isCorrect: true }, { text: '0 1 2 3', isCorrect: false }, { text: '1 2', isCorrect: false }], correctAnswer: '0 1 2', explanation: 'range(3) génère les valeurs 0, 1, 2 (exclut 3).', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour parcourir une liste.', codeSnippet: 'fruits = ["pomme", "banane"]\n___ fruit in fruits:\n  print(fruit)', options: [{ text: 'for', isCorrect: true }, { text: 'while', isCorrect: false }, { text: 'foreach', isCorrect: false }, { text: 'loop', isCorrect: false }], correctAnswer: 'for', explanation: 'La boucle for...in est la façon pythonique de parcourir une liste.', xpReward: 10 },
        { type: 'true_false', question: 'range(1, 5) génère les nombres 1, 2, 3, 4, 5.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'range(1, 5) génère 1, 2, 3, 4. La borne supérieure est exclue.', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre ce programme Python.', options: [{ text: 'total = 0', isCorrect: true }, { text: 'for n in range(1, 6):', isCorrect: true }, { text: '  total += n', isCorrect: true }, { text: 'print(total)', isCorrect: true }], correctAnswer: ['total = 0', 'for n in range(1, 6):', '  total += n', 'print(total)'], explanation: 'Ce programme calcule la somme de 1 à 5 (= 15).', xpReward: 10 },
      ],
    });

    // ==========================================
    // === LESSONS HTML/CSS ===
    // ==========================================
    await Lesson.create({
      title: 'Structure HTML',
      topic: htmlBasics._id, order: 1, xpReward: 20,
      description: 'La structure de base d\'une page HTML.',
      exercises: [
        { type: 'qcm', question: 'Quelle balise contient le contenu visible d\'une page HTML ?', options: [{ text: '<head>', isCorrect: false }, { text: '<body>', isCorrect: true }, { text: '<html>', isCorrect: false }, { text: '<div>', isCorrect: false }], correctAnswer: '<body>', explanation: 'La balise <body> contient tout le contenu visible de la page.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez la balise pour créer un titre principal.', codeSnippet: '<___>Mon premier titre</___>', options: [{ text: 'h1', isCorrect: true }, { text: 'title', isCorrect: false }, { text: 'header', isCorrect: false }, { text: 'heading', isCorrect: false }], correctAnswer: 'h1', explanation: '<h1> est la balise pour le titre principal (heading 1).', xpReward: 10 },
        { type: 'true_false', question: 'Les balises HTML doivent toujours être fermées.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'Certaines balises comme <img>, <br>, <input> sont auto-fermantes.', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre la structure HTML de base.', options: [{ text: '<!DOCTYPE html>', isCorrect: true }, { text: '<html>', isCorrect: true }, { text: '<body>', isCorrect: true }, { text: '</body>', isCorrect: true }, { text: '</html>', isCorrect: true }], correctAnswer: ['<!DOCTYPE html>', '<html>', '<body>', '</body>', '</html>'], explanation: 'DOCTYPE en premier, puis html, body, et les fermetures dans l\'ordre inverse.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Liens et images',
      topic: htmlBasics._id, order: 2, xpReward: 20,
      description: 'Créer des liens et insérer des images.',
      exercises: [
        { type: 'qcm', question: 'Quelle balise crée un lien hypertexte ?', options: [{ text: '<link>', isCorrect: false }, { text: '<a>', isCorrect: true }, { text: '<href>', isCorrect: false }, { text: '<url>', isCorrect: false }], correctAnswer: '<a>', explanation: 'La balise <a> (anchor) crée des liens. L\'attribut href contient l\'URL.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour créer un lien vers Google.', codeSnippet: '<a ___="https://google.com">Google</a>', options: [{ text: 'href', isCorrect: true }, { text: 'src', isCorrect: false }, { text: 'url', isCorrect: false }, { text: 'link', isCorrect: false }], correctAnswer: 'href', explanation: 'L\'attribut href spécifie la destination du lien.', xpReward: 10 },
        { type: 'qcm', question: 'Quel attribut d\'une balise <img> contient le chemin de l\'image ?', options: [{ text: 'href', isCorrect: false }, { text: 'path', isCorrect: false }, { text: 'src', isCorrect: true }, { text: 'url', isCorrect: false }], correctAnswer: 'src', explanation: 'L\'attribut src (source) contient le chemin ou l\'URL de l\'image.', xpReward: 10 },
        { type: 'true_false', question: 'L\'attribut alt d\'une image est obligatoire pour l\'accessibilité.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'L\'attribut alt fournit une description textuelle pour les lecteurs d\'écran et si l\'image ne charge pas.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Premiers styles CSS',
      topic: cssBasics._id, order: 1, xpReward: 20,
      description: 'Appliquer du style à vos éléments HTML.',
      exercises: [
        { type: 'qcm', question: 'Quelle propriété CSS change la couleur du texte ?', options: [{ text: 'text-color', isCorrect: false }, { text: 'font-color', isCorrect: false }, { text: 'color', isCorrect: true }, { text: 'text-style', isCorrect: false }], correctAnswer: 'color', explanation: 'La propriété color définit la couleur du texte.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour mettre le texte en rouge.', codeSnippet: 'h1 {\n  ___: red;\n}', options: [{ text: 'color', isCorrect: true }, { text: 'text-color', isCorrect: false }, { text: 'font-color', isCorrect: false }, { text: 'background', isCorrect: false }], correctAnswer: 'color', explanation: 'La propriété color change la couleur du texte.', xpReward: 10 },
        { type: 'true_false', question: 'En CSS, le sélecteur .maClasse cible un élément avec l\'attribut id="maClasse".', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'Le point (.) cible une classe. Le dièse (#) cible un id.', xpReward: 10 },
        { type: 'qcm', question: 'Quelle propriété CSS change la taille du texte ?', options: [{ text: 'text-size', isCorrect: false }, { text: 'font-size', isCorrect: true }, { text: 'size', isCorrect: false }, { text: 'font-weight', isCorrect: false }], correctAnswer: 'font-size', explanation: 'font-size définit la taille de la police. Ex: font-size: 16px;', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Box Model',
      topic: cssBasics._id, order: 2, xpReward: 25,
      description: 'Comprendre le modèle de boîte CSS.',
      exercises: [
        { type: 'qcm', question: 'Dans le box model CSS, dans quel ordre va-t-on du centre vers l\'extérieur ?', options: [{ text: 'content → border → padding → margin', isCorrect: false }, { text: 'content → padding → border → margin', isCorrect: true }, { text: 'padding → content → border → margin', isCorrect: false }, { text: 'margin → border → padding → content', isCorrect: false }], correctAnswer: 'content → padding → border → margin', explanation: 'De l\'intérieur vers l\'extérieur : contenu, padding (rembourrage), border (bordure), margin (marge).', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour ajouter un espace intérieur de 20px.', codeSnippet: 'div {\n  ___: 20px;\n}', options: [{ text: 'padding', isCorrect: true }, { text: 'margin', isCorrect: false }, { text: 'border', isCorrect: false }, { text: 'spacing', isCorrect: false }], correctAnswer: 'padding', explanation: 'padding ajoute un espace entre le contenu et la bordure.', xpReward: 10 },
        { type: 'true_false', question: 'margin: 10px 20px applique 10px en haut/bas et 20px à gauche/droite.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'Avec 2 valeurs, la première s\'applique verticalement (haut/bas) et la seconde horizontalement (gauche/droite).', xpReward: 10 },
        { type: 'qcm', question: 'Comment centrer un élément bloc horizontalement ?', options: [{ text: 'margin: center;', isCorrect: false }, { text: 'align: center;', isCorrect: false }, { text: 'margin: 0 auto;', isCorrect: true }, { text: 'position: center;', isCorrect: false }], correctAnswer: 'margin: 0 auto;', explanation: 'margin: 0 auto centre un élément bloc (qui a une largeur définie).', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Flexbox',
      topic: cssLayout._id, order: 1, xpReward: 30,
      description: 'Maîtriser la mise en page avec Flexbox.',
      exercises: [
        { type: 'qcm', question: 'Quelle propriété active Flexbox sur un conteneur ?', options: [{ text: 'flex: true;', isCorrect: false }, { text: 'display: flex;', isCorrect: true }, { text: 'layout: flex;', isCorrect: false }, { text: 'position: flex;', isCorrect: false }], correctAnswer: 'display: flex;', explanation: 'display: flex transforme un élément en conteneur flex.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez pour centrer les éléments horizontalement.', codeSnippet: '.container {\n  display: flex;\n  ___-content: center;\n}', options: [{ text: 'justify', isCorrect: true }, { text: 'align', isCorrect: false }, { text: 'center', isCorrect: false }, { text: 'flex', isCorrect: false }], correctAnswer: 'justify', explanation: 'justify-content contrôle l\'alignement sur l\'axe principal (horizontal par défaut).', xpReward: 10 },
        { type: 'true_false', question: 'align-items: center centre les éléments verticalement dans un conteneur flex.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'align-items contrôle l\'alignement sur l\'axe croisé (vertical pour flex-direction: row).', xpReward: 10 },
        { type: 'qcm', question: 'Quelle propriété fait passer les éléments à la ligne suivante si nécessaire ?', options: [{ text: 'flex-flow: wrap;', isCorrect: false }, { text: 'flex-wrap: wrap;', isCorrect: true }, { text: 'wrap: true;', isCorrect: false }, { text: 'overflow: wrap;', isCorrect: false }], correctAnswer: 'flex-wrap: wrap;', explanation: 'flex-wrap: wrap permet aux éléments de passer à la ligne quand il n\'y a plus de place.', xpReward: 10 },
      ],
    });

    // ==========================================
    // === TOPICS SQL ===
    // ==========================================
    const sqlIntro = await Topic.create({ name: 'Introduction', slug: 'sql-intro', icon: 'server-outline', language: sql._id, order: 1, requiredXP: 0, description: 'Les bases du langage SQL.' });
    const sqlSelect = await Topic.create({ name: 'SELECT', slug: 'sql-select', icon: 'search-outline', language: sql._id, order: 2, requiredXP: 50, description: 'Interroger des données avec SELECT.' });
    const sqlFilter = await Topic.create({ name: 'Filtres', slug: 'sql-filter', icon: 'funnel-outline', language: sql._id, order: 3, requiredXP: 120, description: 'WHERE, AND, OR, LIKE.' });

    await Lesson.create({
      title: 'Qu\'est-ce que SQL ?',
      topic: sqlIntro._id, order: 1, xpReward: 20,
      description: 'Introduction au langage de bases de données.',
      exercises: [
        { type: 'qcm', question: 'Que signifie SQL ?', options: [{ text: 'Simple Query Language', isCorrect: false }, { text: 'Structured Query Language', isCorrect: true }, { text: 'System Query Logic', isCorrect: false }, { text: 'Standard Query List', isCorrect: false }], correctAnswer: 'Structured Query Language', explanation: 'SQL = Structured Query Language. C\'est le langage standard pour interagir avec les bases de données relationnelles.', xpReward: 10 },
        { type: 'qcm', question: 'Quelle commande SQL lit des données ?', options: [{ text: 'READ', isCorrect: false }, { text: 'GET', isCorrect: false }, { text: 'SELECT', isCorrect: true }, { text: 'FETCH', isCorrect: false }], correctAnswer: 'SELECT', explanation: 'SELECT est la commande pour lire/interroger des données dans une base SQL.', xpReward: 10 },
        { type: 'true_false', question: 'SQL est sensible à la casse pour les mots-clés (SELECT, FROM...).', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'Les mots-clés SQL ne sont pas sensibles à la casse. SELECT, select et Select sont équivalents. Mais les noms de colonnes peuvent l\'être selon la base.', xpReward: 10 },
        { type: 'qcm', question: 'Laquelle de ces bases de données utilise SQL ?', options: [{ text: 'MongoDB', isCorrect: false }, { text: 'Redis', isCorrect: false }, { text: 'PostgreSQL', isCorrect: true }, { text: 'Firebase', isCorrect: false }], correctAnswer: 'PostgreSQL', explanation: 'PostgreSQL, MySQL, SQLite, Oracle sont des bases de données relationnelles qui utilisent SQL. MongoDB est NoSQL.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'SELECT de base',
      topic: sqlSelect._id, order: 1, xpReward: 25,
      description: 'Sélectionner des colonnes et toutes les données.',
      exercises: [
        { type: 'fill_code', question: 'Complétez pour sélectionner toutes les colonnes de la table users.', codeSnippet: '___ * FROM users;', options: [{ text: 'SELECT', isCorrect: true }, { text: 'GET', isCorrect: false }, { text: 'FETCH', isCorrect: false }, { text: 'READ', isCorrect: false }], correctAnswer: 'SELECT', explanation: 'SELECT * FROM table sélectionne toutes les colonnes. L\'astérisque * signifie "tout".', xpReward: 10 },
        { type: 'qcm', question: 'Comment sélectionner uniquement les colonnes "nom" et "age" ?', options: [{ text: 'SELECT * FROM users;', isCorrect: false }, { text: 'SELECT nom, age FROM users;', isCorrect: true }, { text: 'GET nom, age FROM users;', isCorrect: false }, { text: 'SELECT users.nom users.age;', isCorrect: false }], correctAnswer: 'SELECT nom, age FROM users;', explanation: 'On liste les colonnes séparées par des virgules après SELECT.', xpReward: 10 },
        { type: 'true_false', question: 'SELECT * est recommandé en production pour de meilleures performances.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'SELECT * récupère toutes les colonnes, ce qui est inefficace. Il vaut mieux spécifier uniquement les colonnes nécessaires.', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre cette requête SQL.', options: [{ text: 'SELECT nom, email', isCorrect: true }, { text: 'FROM utilisateurs', isCorrect: true }, { text: 'ORDER BY nom;', isCorrect: true }], correctAnswer: ['SELECT nom, email', 'FROM utilisateurs', 'ORDER BY nom;'], explanation: 'L\'ordre SQL : SELECT (quoi), FROM (d\'où), puis les clauses optionnelles.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Filtrer avec WHERE',
      topic: sqlFilter._id, order: 1, xpReward: 25,
      description: 'Filtrer les résultats avec la clause WHERE.',
      exercises: [
        { type: 'fill_code', question: 'Complétez pour récupérer les utilisateurs de plus de 18 ans.', codeSnippet: 'SELECT * FROM users\n___ age > 18;', options: [{ text: 'WHERE', isCorrect: true }, { text: 'FILTER', isCorrect: false }, { text: 'IF', isCorrect: false }, { text: 'HAVING', isCorrect: false }], correctAnswer: 'WHERE', explanation: 'WHERE filtre les lignes selon une condition. Seules les lignes où la condition est vraie sont retournées.', xpReward: 10 },
        { type: 'qcm', question: 'Quelle requête récupère les users avec le rôle "admin" ?', options: [{ text: 'SELECT * FROM users WHERE role IS "admin";', isCorrect: false }, { text: 'SELECT * FROM users WHERE role = "admin";', isCorrect: true }, { text: 'SELECT * FROM users IF role = "admin";', isCorrect: false }, { text: 'FILTER users WHERE role = "admin";', isCorrect: false }], correctAnswer: 'SELECT * FROM users WHERE role = "admin";', explanation: 'On utilise = (et non ==) pour l\'égalité dans SQL, et les strings sont entre guillemets simples ou doubles selon la base.', xpReward: 10 },
        { type: 'true_false', question: 'En SQL, LIKE "Alice%" trouve tous les noms commençant par "Alice".', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'LIKE avec % est un wildcard. "Alice%" = commence par Alice. "%alice%" = contient alice.', xpReward: 10 },
        { type: 'qcm', question: 'Comment combiner deux conditions avec "ET" en SQL ?', options: [{ text: '&&', isCorrect: false }, { text: 'AND', isCorrect: true }, { text: '+', isCorrect: false }, { text: 'BOTH', isCorrect: false }], correctAnswer: 'AND', explanation: 'SQL utilise AND et OR pour combiner des conditions. Ex: WHERE age > 18 AND ville = "Paris".', xpReward: 10 },
      ],
    });

    // ==========================================
    // === TOPICS TYPESCRIPT ===
    // ==========================================
    const tsIntro = await Topic.create({ name: 'Introduction', slug: 'ts-intro', icon: 'code-working-outline', language: typescript._id, order: 1, requiredXP: 0, description: 'TypeScript : JavaScript avec des types.' });
    const tsTypes = await Topic.create({ name: 'Types de base', slug: 'ts-types', icon: 'layers-outline', language: typescript._id, order: 2, requiredXP: 60, description: 'string, number, boolean, any.' });
    const tsInterfaces = await Topic.create({ name: 'Interfaces', slug: 'ts-interfaces', icon: 'git-network-outline', language: typescript._id, order: 3, requiredXP: 140, description: 'Définir la forme des objets.' });

    await Lesson.create({
      title: 'Pourquoi TypeScript ?',
      topic: tsIntro._id, order: 1, xpReward: 20,
      description: 'Comprendre les avantages de TypeScript.',
      exercises: [
        { type: 'qcm', question: 'TypeScript est un sur-ensemble de quel langage ?', options: [{ text: 'Java', isCorrect: false }, { text: 'Python', isCorrect: false }, { text: 'JavaScript', isCorrect: true }, { text: 'C#', isCorrect: false }], correctAnswer: 'JavaScript', explanation: 'TypeScript est un "superset" de JavaScript : tout code JS valide est aussi du TypeScript valide.', xpReward: 10 },
        { type: 'true_false', question: 'TypeScript est exécuté directement dans le navigateur.', options: [{ text: 'Vrai', isCorrect: false }, { text: 'Faux', isCorrect: true }], correctAnswer: 'Faux', explanation: 'TypeScript doit être "compilé" (transpilé) en JavaScript avant d\'être exécuté dans un navigateur ou Node.js.', xpReward: 10 },
        { type: 'qcm', question: 'Quel est le principal avantage de TypeScript ?', options: [{ text: 'Plus rapide que JavaScript', isCorrect: false }, { text: 'Détection d\'erreurs avant l\'exécution', isCorrect: true }, { text: 'Fonctionne sans navigateur', isCorrect: false }, { text: 'Remplace complètement JavaScript', isCorrect: false }], correctAnswer: 'Détection d\'erreurs avant l\'exécution', explanation: 'Le typage statique permet de détecter les erreurs à la compilation, avant même d\'exécuter le code.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez l\'extension d\'un fichier TypeScript.', codeSnippet: 'app.___', options: [{ text: 'ts', isCorrect: true }, { text: 'js', isCorrect: false }, { text: 'tsx', isCorrect: false }, { text: 'type', isCorrect: false }], correctAnswer: 'ts', explanation: 'Les fichiers TypeScript ont l\'extension .ts (ou .tsx pour les composants React).', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Types primitifs',
      topic: tsTypes._id, order: 1, xpReward: 25,
      description: 'Annoter les variables avec des types.',
      exercises: [
        { type: 'fill_code', question: 'Complétez pour déclarer une variable typée string.', codeSnippet: 'let nom: ___ = "Alice";', options: [{ text: 'string', isCorrect: true }, { text: 'String', isCorrect: false }, { text: 'text', isCorrect: false }, { text: 'str', isCorrect: false }], correctAnswer: 'string', explanation: 'En TypeScript, on annote le type après le nom de la variable avec : type. Les types primitifs sont en minuscule.', xpReward: 10 },
        { type: 'qcm', question: 'Que va provoquer ce code TypeScript ?', codeSnippet: 'let age: number = "vingt-cinq";', options: [{ text: 'Rien, ça marche', isCorrect: false }, { text: 'Une erreur de compilation', isCorrect: true }, { text: 'Une conversion automatique', isCorrect: false }, { text: 'age vaut NaN', isCorrect: false }], correctAnswer: 'Une erreur de compilation', explanation: 'TypeScript refuse d\'assigner une string à une variable déclarée number. C\'est exactement son rôle !', xpReward: 10 },
        { type: 'true_false', question: 'Le type "any" désactive la vérification de type en TypeScript.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'any accepte n\'importe quel type, ce qui désactive la protection TypeScript. À éviter sauf cas particuliers.', xpReward: 10 },
        { type: 'qcm', question: 'Quel type TypeScript représente une liste de nombres ?', options: [{ text: 'Array', isCorrect: false }, { text: 'list<number>', isCorrect: false }, { text: 'number[]', isCorrect: true }, { text: '[number]', isCorrect: false }], correctAnswer: 'number[]', explanation: 'Un tableau de nombres s\'écrit number[] ou Array<number> en TypeScript.', xpReward: 10 },
      ],
    });

    await Lesson.create({
      title: 'Interfaces',
      topic: tsInterfaces._id, order: 1, xpReward: 30,
      description: 'Définir la structure des objets avec les interfaces.',
      exercises: [
        { type: 'qcm', question: 'À quoi sert une interface TypeScript ?', options: [{ text: 'À créer des classes abstraites', isCorrect: false }, { text: 'À définir la forme attendue d\'un objet', isCorrect: true }, { text: 'À remplacer les fonctions', isCorrect: false }, { text: 'À déclarer des constantes', isCorrect: false }], correctAnswer: 'À définir la forme attendue d\'un objet', explanation: 'Une interface décrit les propriétés et types attendus d\'un objet, comme un contrat.', xpReward: 10 },
        { type: 'fill_code', question: 'Complétez le mot-clé pour déclarer une interface.', codeSnippet: '___ User {\n  nom: string;\n  age: number;\n}', options: [{ text: 'interface', isCorrect: true }, { text: 'type', isCorrect: false }, { text: 'class', isCorrect: false }, { text: 'struct', isCorrect: false }], correctAnswer: 'interface', explanation: 'Le mot-clé interface définit la forme d\'un objet TypeScript.', xpReward: 10 },
        { type: 'true_false', question: 'Une propriété marquée avec ? est optionnelle dans une interface TypeScript.', options: [{ text: 'Vrai', isCorrect: true }, { text: 'Faux', isCorrect: false }], correctAnswer: 'Vrai', explanation: 'interface User { surnom?: string } — le ? rend la propriété optionnelle.', xpReward: 10 },
        { type: 'order_code', question: 'Remettez dans l\'ordre cette interface TypeScript.', options: [{ text: 'interface Produit {', isCorrect: true }, { text: '  nom: string;', isCorrect: true }, { text: '  prix: number;', isCorrect: true }, { text: '  enStock: boolean;', isCorrect: true }, { text: '}', isCorrect: true }], correctAnswer: ['interface Produit {', '  nom: string;', '  prix: number;', '  enStock: boolean;', '}'], explanation: 'Une interface TypeScript liste ses propriétés avec leurs types entre accolades.', xpReward: 10 },
      ],
    });

    console.log('Base de données peuplée avec succès !');
    console.log('- 5 langages (JavaScript, Python, HTML/CSS, SQL, TypeScript)');
    console.log('- 18 topics');
    console.log('- 29 leçons avec 110+ exercices');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
