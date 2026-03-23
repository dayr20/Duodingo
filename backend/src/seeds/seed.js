const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const Language = require('../models/Language');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connecté pour le seeding...');

    // Clear existing data
    await Language.deleteMany({});
    await Topic.deleteMany({});
    await Lesson.deleteMany({});

    // === LANGUAGES ===
    const javascript = await Language.create({
      name: 'JavaScript',
      slug: 'javascript',
      icon: 'logo-javascript',
      color: '#F7DF1E',
      description: 'Le langage du web. Apprenez à créer des sites interactifs.',
      order: 1,
    });

    const python = await Language.create({
      name: 'Python',
      slug: 'python',
      icon: 'logo-python',
      color: '#3776AB',
      description: 'Simple et puissant. Idéal pour débuter la programmation.',
      order: 2,
    });

    const html = await Language.create({
      name: 'HTML/CSS',
      slug: 'html-css',
      icon: 'code-slash',
      color: '#E34F26',
      description: 'Les bases du web. Créez vos premières pages web.',
      order: 3,
    });

    // === TOPICS JAVASCRIPT ===
    const jsVariables = await Topic.create({
      name: 'Variables',
      slug: 'variables',
      icon: 'cube-outline',
      language: javascript._id,
      order: 1,
      requiredXP: 0,
      description: 'Apprenez à stocker des données avec let, const et var.',
    });

    const jsTypes = await Topic.create({
      name: 'Types de données',
      slug: 'types',
      icon: 'layers-outline',
      language: javascript._id,
      order: 2,
      requiredXP: 50,
      description: 'Strings, Numbers, Booleans et plus encore.',
    });

    const jsConditions = await Topic.create({
      name: 'Conditions',
      slug: 'conditions',
      icon: 'git-branch-outline',
      language: javascript._id,
      order: 3,
      requiredXP: 120,
      description: 'Prenez des décisions avec if, else et switch.',
    });

    const jsLoops = await Topic.create({
      name: 'Boucles',
      slug: 'boucles',
      icon: 'refresh-outline',
      language: javascript._id,
      order: 4,
      requiredXP: 200,
      description: 'Répétez des actions avec for, while et do...while.',
    });

    const jsFunctions = await Topic.create({
      name: 'Fonctions',
      slug: 'fonctions',
      icon: 'code-working-outline',
      language: javascript._id,
      order: 5,
      requiredXP: 300,
      description: 'Créez des blocs de code réutilisables.',
    });

    const jsArrays = await Topic.create({
      name: 'Tableaux',
      slug: 'tableaux',
      icon: 'list-outline',
      language: javascript._id,
      order: 6,
      requiredXP: 400,
      description: 'Manipulez des collections de données.',
    });

    // === TOPICS PYTHON ===
    const pyIntro = await Topic.create({
      name: 'Introduction',
      slug: 'introduction',
      icon: 'rocket-outline',
      language: python._id,
      order: 1,
      requiredXP: 0,
      description: 'Vos premiers pas en Python.',
    });

    const pyVariables = await Topic.create({
      name: 'Variables',
      slug: 'variables-py',
      icon: 'cube-outline',
      language: python._id,
      order: 2,
      requiredXP: 50,
      description: 'Stocker des données en Python.',
    });

    const pyConditions = await Topic.create({
      name: 'Conditions',
      slug: 'conditions-py',
      icon: 'git-branch-outline',
      language: python._id,
      order: 3,
      requiredXP: 120,
      description: 'if, elif, else en Python.',
    });

    // === TOPICS HTML/CSS ===
    const htmlBasics = await Topic.create({
      name: 'Bases HTML',
      slug: 'bases-html',
      icon: 'document-outline',
      language: html._id,
      order: 1,
      requiredXP: 0,
      description: 'Les balises essentielles du HTML.',
    });

    const cssBasics = await Topic.create({
      name: 'Bases CSS',
      slug: 'bases-css',
      icon: 'color-palette-outline',
      language: html._id,
      order: 2,
      requiredXP: 50,
      description: 'Stylisez vos pages web.',
    });

    // === LESSONS JAVASCRIPT - Variables ===
    await Lesson.create({
      title: 'Déclarer une variable',
      topic: jsVariables._id,
      order: 1,
      xpReward: 20,
      description: 'Apprenez à créer des variables avec let et const.',
      exercises: [
        {
          type: 'qcm',
          question: 'Quel mot-clé est recommandé pour déclarer une variable qui ne change pas ?',
          options: [
            { text: 'var', isCorrect: false },
            { text: 'let', isCorrect: false },
            { text: 'const', isCorrect: true },
            { text: 'variable', isCorrect: false },
          ],
          correctAnswer: 'const',
          explanation: 'const déclare une constante dont la valeur ne peut pas être réassignée.',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez le code pour déclarer une variable "age" avec la valeur 25.',
          codeSnippet: '___ age = 25;',
          options: [
            { text: 'let', isCorrect: true },
            { text: 'var', isCorrect: false },
            { text: 'int', isCorrect: false },
            { text: 'define', isCorrect: false },
          ],
          correctAnswer: 'let',
          explanation: 'let permet de déclarer une variable dont la valeur peut changer.',
          xpReward: 10,
        },
        {
          type: 'true_false',
          question: 'En JavaScript, on peut réassigner la valeur d\'une variable déclarée avec const.',
          options: [
            { text: 'Vrai', isCorrect: false },
            { text: 'Faux', isCorrect: true },
          ],
          correctAnswer: 'Faux',
          explanation: 'const crée une constante. Une fois assignée, sa valeur ne peut pas être changée.',
          xpReward: 10,
        },
        {
          type: 'qcm',
          question: 'Que va afficher ce code ?\n\nlet x = 10;\nx = 20;\nconsole.log(x);',
          codeSnippet: 'let x = 10;\nx = 20;\nconsole.log(x);',
          options: [
            { text: '10', isCorrect: false },
            { text: '20', isCorrect: true },
            { text: 'undefined', isCorrect: false },
            { text: 'Erreur', isCorrect: false },
          ],
          correctAnswer: '20',
          explanation: 'let permet la réassignation. x est d\'abord 10, puis réassigné à 20.',
          xpReward: 10,
        },
        {
          type: 'order_code',
          question: 'Mettez les lignes dans le bon ordre pour déclarer et afficher une variable.',
          options: [
            { text: 'let message = "Bonjour";', isCorrect: true },
            { text: 'console.log(message);', isCorrect: true },
          ],
          correctAnswer: ['let message = "Bonjour";', 'console.log(message);'],
          explanation: 'On doit d\'abord déclarer la variable avant de l\'utiliser.',
          xpReward: 10,
        },
      ],
    });

    await Lesson.create({
      title: 'Nommer ses variables',
      topic: jsVariables._id,
      order: 2,
      xpReward: 20,
      description: 'Les règles de nommage des variables en JavaScript.',
      exercises: [
        {
          type: 'qcm',
          question: 'Quel nom de variable est valide en JavaScript ?',
          options: [
            { text: '2nombre', isCorrect: false },
            { text: 'mon-nom', isCorrect: false },
            { text: 'monNom', isCorrect: true },
            { text: 'class', isCorrect: false },
          ],
          correctAnswer: 'monNom',
          explanation: 'monNom utilise le camelCase et ne commence pas par un chiffre.',
          xpReward: 10,
        },
        {
          type: 'true_false',
          question: 'Un nom de variable peut commencer par un chiffre en JavaScript.',
          options: [
            { text: 'Vrai', isCorrect: false },
            { text: 'Faux', isCorrect: true },
          ],
          correctAnswer: 'Faux',
          explanation: 'Les noms de variables ne peuvent pas commencer par un chiffre.',
          xpReward: 10,
        },
        {
          type: 'qcm',
          question: 'Quelle convention de nommage est la plus utilisée en JavaScript ?',
          options: [
            { text: 'snake_case', isCorrect: false },
            { text: 'camelCase', isCorrect: true },
            { text: 'PascalCase', isCorrect: false },
            { text: 'kebab-case', isCorrect: false },
          ],
          correctAnswer: 'camelCase',
          explanation: 'Le camelCase est la convention standard en JavaScript (ex: monAge, firstName).',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez pour déclarer une constante pour le nombre maximum d\'essais.',
          codeSnippet: 'const ___ = 3;',
          options: [
            { text: 'MAX_ESSAIS', isCorrect: true },
            { text: '3essais', isCorrect: false },
            { text: 'max-essais', isCorrect: false },
            { text: 'class', isCorrect: false },
          ],
          correctAnswer: 'MAX_ESSAIS',
          explanation: 'Les constantes sont souvent écrites en MAJUSCULES avec des underscores.',
          xpReward: 10,
        },
      ],
    });

    // === LESSONS JAVASCRIPT - Types ===
    await Lesson.create({
      title: 'Strings et Numbers',
      topic: jsTypes._id,
      order: 1,
      xpReward: 25,
      description: 'Les types de base : chaînes de caractères et nombres.',
      exercises: [
        {
          type: 'qcm',
          question: 'Quel est le type de "Hello" en JavaScript ?',
          options: [
            { text: 'number', isCorrect: false },
            { text: 'string', isCorrect: true },
            { text: 'text', isCorrect: false },
            { text: 'char', isCorrect: false },
          ],
          correctAnswer: 'string',
          explanation: 'Les textes entre guillemets sont des strings (chaînes de caractères).',
          xpReward: 10,
        },
        {
          type: 'qcm',
          question: 'Que retourne typeof 42 ?',
          codeSnippet: 'typeof 42',
          options: [
            { text: '"integer"', isCorrect: false },
            { text: '"number"', isCorrect: true },
            { text: '"float"', isCorrect: false },
            { text: '"num"', isCorrect: false },
          ],
          correctAnswer: '"number"',
          explanation: 'En JavaScript, tous les nombres (entiers et décimaux) sont de type "number".',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez pour créer une string avec des template literals.',
          codeSnippet: 'let nom = "Alice";\nlet message = ___Bonjour ${nom}!___;',
          options: [
            { text: '`', isCorrect: true },
            { text: '"', isCorrect: false },
            { text: "'", isCorrect: false },
            { text: '(', isCorrect: false },
          ],
          correctAnswer: '`',
          explanation: 'Les template literals utilisent les backticks (`) pour permettre l\'interpolation.',
          xpReward: 10,
        },
        {
          type: 'true_false',
          question: '"5" + 3 donne 8 en JavaScript.',
          codeSnippet: '"5" + 3',
          options: [
            { text: 'Vrai', isCorrect: false },
            { text: 'Faux', isCorrect: true },
          ],
          correctAnswer: 'Faux',
          explanation: 'L\'opérateur + avec une string fait une concaténation. "5" + 3 donne "53".',
          xpReward: 10,
        },
      ],
    });

    // === LESSONS JAVASCRIPT - Conditions ===
    await Lesson.create({
      title: 'If et Else',
      topic: jsConditions._id,
      order: 1,
      xpReward: 25,
      description: 'Apprenez à utiliser les conditions if/else.',
      exercises: [
        {
          type: 'qcm',
          question: 'Que va afficher ce code ?\n\nlet age = 20;\nif (age >= 18) {\n  console.log("Majeur");\n} else {\n  console.log("Mineur");\n}',
          codeSnippet: 'let age = 20;\nif (age >= 18) {\n  console.log("Majeur");\n} else {\n  console.log("Mineur");\n}',
          options: [
            { text: 'Majeur', isCorrect: true },
            { text: 'Mineur', isCorrect: false },
            { text: 'undefined', isCorrect: false },
            { text: 'Erreur', isCorrect: false },
          ],
          correctAnswer: 'Majeur',
          explanation: '20 >= 18 est vrai, donc le bloc if s\'exécute.',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez la condition pour vérifier si un nombre est positif.',
          codeSnippet: 'let n = 5;\n___ (n > 0) {\n  console.log("Positif");\n}',
          options: [
            { text: 'if', isCorrect: true },
            { text: 'when', isCorrect: false },
            { text: 'check', isCorrect: false },
            { text: 'while', isCorrect: false },
          ],
          correctAnswer: 'if',
          explanation: 'Le mot-clé if est utilisé pour les conditions en JavaScript.',
          xpReward: 10,
        },
        {
          type: 'qcm',
          question: 'Quel opérateur vérifie l\'égalité stricte (valeur ET type) ?',
          options: [
            { text: '=', isCorrect: false },
            { text: '==', isCorrect: false },
            { text: '===', isCorrect: true },
            { text: '!=', isCorrect: false },
          ],
          correctAnswer: '===',
          explanation: '=== compare la valeur ET le type. == ne compare que la valeur.',
          xpReward: 10,
        },
        {
          type: 'order_code',
          question: 'Remettez dans l\'ordre ce code qui vérifie si un nombre est pair.',
          options: [
            { text: 'let nombre = 4;', isCorrect: true },
            { text: 'if (nombre % 2 === 0) {', isCorrect: true },
            { text: '  console.log("Pair");', isCorrect: true },
            { text: '}', isCorrect: true },
          ],
          correctAnswer: ['let nombre = 4;', 'if (nombre % 2 === 0) {', '  console.log("Pair");', '}'],
          explanation: 'L\'opérateur % (modulo) donne le reste de la division. Si le reste est 0, le nombre est pair.',
          xpReward: 10,
        },
      ],
    });

    // === LESSONS JAVASCRIPT - Boucles ===
    await Lesson.create({
      title: 'La boucle for',
      topic: jsLoops._id,
      order: 1,
      xpReward: 25,
      description: 'Répétez des actions avec la boucle for.',
      exercises: [
        {
          type: 'qcm',
          question: 'Combien de fois "Hello" sera affiché ?\n\nfor (let i = 0; i < 3; i++) {\n  console.log("Hello");\n}',
          codeSnippet: 'for (let i = 0; i < 3; i++) {\n  console.log("Hello");\n}',
          options: [
            { text: '2', isCorrect: false },
            { text: '3', isCorrect: true },
            { text: '4', isCorrect: false },
            { text: 'Infini', isCorrect: false },
          ],
          correctAnswer: '3',
          explanation: 'i prend les valeurs 0, 1, 2 (3 itérations car i < 3).',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez pour créer une boucle qui compte de 1 à 5.',
          codeSnippet: 'for (let i = 1; i ___ 5; i++) {\n  console.log(i);\n}',
          options: [
            { text: '<=', isCorrect: true },
            { text: '<', isCorrect: false },
            { text: '>', isCorrect: false },
            { text: '!=', isCorrect: false },
          ],
          correctAnswer: '<=',
          explanation: 'Pour inclure 5, on utilise <= (inférieur ou égal).',
          xpReward: 10,
        },
        {
          type: 'true_false',
          question: 'Une boucle for doit toujours commencer à 0.',
          options: [
            { text: 'Vrai', isCorrect: false },
            { text: 'Faux', isCorrect: true },
          ],
          correctAnswer: 'Faux',
          explanation: 'On peut initialiser la variable de boucle à n\'importe quelle valeur.',
          xpReward: 10,
        },
      ],
    });

    // === LESSONS JAVASCRIPT - Fonctions ===
    await Lesson.create({
      title: 'Créer une fonction',
      topic: jsFunctions._id,
      order: 1,
      xpReward: 25,
      description: 'Apprenez à déclarer et appeler des fonctions.',
      exercises: [
        {
          type: 'qcm',
          question: 'Quel mot-clé est utilisé pour déclarer une fonction ?',
          options: [
            { text: 'func', isCorrect: false },
            { text: 'def', isCorrect: false },
            { text: 'function', isCorrect: true },
            { text: 'method', isCorrect: false },
          ],
          correctAnswer: 'function',
          explanation: 'En JavaScript, on utilise le mot-clé function pour déclarer une fonction.',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez pour que la fonction retourne la somme de a et b.',
          codeSnippet: 'function addition(a, b) {\n  ___ a + b;\n}',
          options: [
            { text: 'return', isCorrect: true },
            { text: 'give', isCorrect: false },
            { text: 'send', isCorrect: false },
            { text: 'output', isCorrect: false },
          ],
          correctAnswer: 'return',
          explanation: 'Le mot-clé return renvoie une valeur depuis la fonction.',
          xpReward: 10,
        },
        {
          type: 'qcm',
          question: 'Que va afficher ce code ?\n\nfunction saluer(nom) {\n  return "Bonjour " + nom;\n}\nconsole.log(saluer("Alice"));',
          codeSnippet: 'function saluer(nom) {\n  return "Bonjour " + nom;\n}\nconsole.log(saluer("Alice"));',
          options: [
            { text: 'Bonjour', isCorrect: false },
            { text: 'Bonjour Alice', isCorrect: true },
            { text: 'undefined', isCorrect: false },
            { text: 'Erreur', isCorrect: false },
          ],
          correctAnswer: 'Bonjour Alice',
          explanation: 'La fonction concatène "Bonjour " avec le paramètre nom ("Alice").',
          xpReward: 10,
        },
        {
          type: 'order_code',
          question: 'Remettez dans l\'ordre pour créer et appeler une fonction.',
          options: [
            { text: 'function doubler(n) {', isCorrect: true },
            { text: '  return n * 2;', isCorrect: true },
            { text: '}', isCorrect: true },
            { text: 'console.log(doubler(5));', isCorrect: true },
          ],
          correctAnswer: ['function doubler(n) {', '  return n * 2;', '}', 'console.log(doubler(5));'],
          explanation: 'On déclare d\'abord la fonction, puis on l\'appelle.',
          xpReward: 10,
        },
      ],
    });

    // === LESSONS PYTHON ===
    await Lesson.create({
      title: 'Premier programme',
      topic: pyIntro._id,
      order: 1,
      xpReward: 20,
      description: 'Écrivez votre premier programme Python.',
      exercises: [
        {
          type: 'qcm',
          question: 'Quelle fonction affiche du texte en Python ?',
          options: [
            { text: 'console.log()', isCorrect: false },
            { text: 'echo()', isCorrect: false },
            { text: 'print()', isCorrect: true },
            { text: 'write()', isCorrect: false },
          ],
          correctAnswer: 'print()',
          explanation: 'En Python, print() est la fonction pour afficher du texte.',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez pour afficher "Hello World".',
          codeSnippet: '___("Hello World")',
          options: [
            { text: 'print', isCorrect: true },
            { text: 'echo', isCorrect: false },
            { text: 'log', isCorrect: false },
            { text: 'display', isCorrect: false },
          ],
          correctAnswer: 'print',
          explanation: 'print() est la fonction d\'affichage en Python.',
          xpReward: 10,
        },
        {
          type: 'true_false',
          question: 'Python utilise des accolades {} pour délimiter les blocs de code.',
          options: [
            { text: 'Vrai', isCorrect: false },
            { text: 'Faux', isCorrect: true },
          ],
          correctAnswer: 'Faux',
          explanation: 'Python utilise l\'indentation (espaces/tabulations) pour délimiter les blocs.',
          xpReward: 10,
        },
      ],
    });

    await Lesson.create({
      title: 'Variables Python',
      topic: pyVariables._id,
      order: 1,
      xpReward: 20,
      description: 'Les variables en Python.',
      exercises: [
        {
          type: 'qcm',
          question: 'Comment déclarer une variable "age" valant 25 en Python ?',
          options: [
            { text: 'let age = 25', isCorrect: false },
            { text: 'int age = 25', isCorrect: false },
            { text: 'age = 25', isCorrect: true },
            { text: 'var age = 25', isCorrect: false },
          ],
          correctAnswer: 'age = 25',
          explanation: 'En Python, pas besoin de mot-clé pour déclarer une variable.',
          xpReward: 10,
        },
        {
          type: 'true_false',
          question: 'En Python, il faut déclarer le type d\'une variable.',
          options: [
            { text: 'Vrai', isCorrect: false },
            { text: 'Faux', isCorrect: true },
          ],
          correctAnswer: 'Faux',
          explanation: 'Python est un langage à typage dynamique. Le type est déduit automatiquement.',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez pour afficher le type de la variable x.',
          codeSnippet: 'x = 3.14\nprint(___(x))',
          options: [
            { text: 'type', isCorrect: true },
            { text: 'typeof', isCorrect: false },
            { text: 'class', isCorrect: false },
            { text: 'kind', isCorrect: false },
          ],
          correctAnswer: 'type',
          explanation: 'La fonction type() retourne le type d\'une variable en Python.',
          xpReward: 10,
        },
      ],
    });

    // === LESSONS HTML/CSS ===
    await Lesson.create({
      title: 'Structure HTML',
      topic: htmlBasics._id,
      order: 1,
      xpReward: 20,
      description: 'La structure de base d\'une page HTML.',
      exercises: [
        {
          type: 'qcm',
          question: 'Quelle balise contient le contenu visible d\'une page HTML ?',
          options: [
            { text: '<head>', isCorrect: false },
            { text: '<body>', isCorrect: true },
            { text: '<html>', isCorrect: false },
            { text: '<div>', isCorrect: false },
          ],
          correctAnswer: '<body>',
          explanation: 'La balise <body> contient tout le contenu visible de la page.',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez la balise pour créer un titre principal.',
          codeSnippet: '<___>Mon premier titre</___>',
          options: [
            { text: 'h1', isCorrect: true },
            { text: 'title', isCorrect: false },
            { text: 'header', isCorrect: false },
            { text: 'heading', isCorrect: false },
          ],
          correctAnswer: 'h1',
          explanation: '<h1> est la balise pour le titre principal (heading 1).',
          xpReward: 10,
        },
        {
          type: 'true_false',
          question: 'Les balises HTML doivent toujours être fermées.',
          options: [
            { text: 'Vrai', isCorrect: false },
            { text: 'Faux', isCorrect: true },
          ],
          correctAnswer: 'Faux',
          explanation: 'Certaines balises comme <img>, <br>, <input> sont auto-fermantes.',
          xpReward: 10,
        },
        {
          type: 'order_code',
          question: 'Remettez dans l\'ordre la structure HTML de base.',
          options: [
            { text: '<!DOCTYPE html>', isCorrect: true },
            { text: '<html>', isCorrect: true },
            { text: '<body>', isCorrect: true },
            { text: '</body>', isCorrect: true },
            { text: '</html>', isCorrect: true },
          ],
          correctAnswer: ['<!DOCTYPE html>', '<html>', '<body>', '</body>', '</html>'],
          explanation: 'DOCTYPE en premier, puis html, body, et les fermetures dans l\'ordre inverse.',
          xpReward: 10,
        },
      ],
    });

    await Lesson.create({
      title: 'Premiers styles CSS',
      topic: cssBasics._id,
      order: 1,
      xpReward: 20,
      description: 'Appliquer du style à vos éléments HTML.',
      exercises: [
        {
          type: 'qcm',
          question: 'Quelle propriété CSS change la couleur du texte ?',
          options: [
            { text: 'text-color', isCorrect: false },
            { text: 'font-color', isCorrect: false },
            { text: 'color', isCorrect: true },
            { text: 'text-style', isCorrect: false },
          ],
          correctAnswer: 'color',
          explanation: 'La propriété color définit la couleur du texte.',
          xpReward: 10,
        },
        {
          type: 'fill_code',
          question: 'Complétez pour mettre le texte en rouge.',
          codeSnippet: 'h1 {\n  ___: red;\n}',
          options: [
            { text: 'color', isCorrect: true },
            { text: 'text-color', isCorrect: false },
            { text: 'font-color', isCorrect: false },
            { text: 'background', isCorrect: false },
          ],
          correctAnswer: 'color',
          explanation: 'La propriété color change la couleur du texte.',
          xpReward: 10,
        },
        {
          type: 'true_false',
          question: 'En CSS, le sélecteur .maClasse cible un élément avec l\'attribut id="maClasse".',
          options: [
            { text: 'Vrai', isCorrect: false },
            { text: 'Faux', isCorrect: true },
          ],
          correctAnswer: 'Faux',
          explanation: 'Le point (.) cible une classe. Le dièse (#) cible un id.',
          xpReward: 10,
        },
      ],
    });

    console.log('Base de données peuplée avec succès!');
    console.log('- 3 langages (JavaScript, Python, HTML/CSS)');
    console.log('- 11 topics');
    console.log('- 10 leçons avec exercices');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
