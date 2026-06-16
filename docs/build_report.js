const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
  TableOfContents, ExternalHyperlink,
} = require("docx");

const SCREENS = path.join(__dirname, "screens", "small");
const img = (f) => fs.readFileSync(path.join(SCREENS, f));

// Couleurs Duodingo
const GREEN = "58CC02", DARKGREEN = "3C7A00", BLUE = "1CB0F6", WOLF = "4B4B4B", HARE = "AFAFAF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const borders = { top: border, bottom: border, left: border, right: border };

// --- Helpers ---
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, ...opts })] });
}
function bullet(text) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
    children: [new TextRun(text)] });
}
function bulletBold(label, rest) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
    children: [new TextRun({ text: label, bold: true }), new TextRun(rest)] });
}

// Image avec légende (cellule)
function shotCell(file, caption, w = 190) {
  const h = Math.round(w * 900 / 405);
  return new TableCell({
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    width: { size: 4680, type: WidthType.DXA },
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 80, bottom: 160, left: 120, right: 120 },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new ImageRun({ type: "png", data: img(file), transformation: { width: w, height: h },
          altText: { title: caption, description: caption, name: file } }),
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 },
        children: [new TextRun({ text: caption, italics: true, size: 18, color: HARE })] }),
    ],
  });
}
function shotRow(a, b) {
  return new TableRow({ children: [a, b || new TableCell({ borders: { top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE} }, width:{size:4680,type:WidthType.DXA}, children:[new Paragraph("")] })] });
}
function shotGrid(rows) {
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680], rows });
}

// Tableau clé/valeur
function infoTable(rowsData, col0 = 3000) {
  const col1 = 9360 - col0;
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [col0, col1],
    rows: rowsData.map(([k, v], i) => new TableRow({ children: [
      new TableCell({ borders, width: { size: col0, type: WidthType.DXA },
        shading: { fill: "EAF7DD", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, color: DARKGREEN })] })] }),
      new TableCell({ borders, width: { size: col1, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun(v)] })] }),
    ]})),
  });
}

// Tableau header (API)
function apiTable(rows) {
  const cols = [2400, 3400, 3560];
  const head = new TableRow({ tableHeader: true, children: ["Méthode", "Endpoint", "Rôle"].map((t, i) =>
    new TableCell({ borders, width: { size: cols[i], type: WidthType.DXA },
      shading: { fill: GREEN, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: "FFFFFF" })] })] })) });
  const body = rows.map((r) => new TableRow({ children: r.map((c, i) =>
    new TableCell({ borders, width: { size: cols[i], type: WidthType.DXA },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: c, font: i === 1 ? "Consolas" : "Arial", size: i === 1 ? 18 : 22 })] })] }))}));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: cols, rows: [head, ...body] });
}

// ============ CONTENU ============
const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 2400, after: 0 },
    children: [new TextRun({ text: "🦉", size: 160 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 0 },
    children: [new TextRun({ text: "Duodingo", bold: true, size: 72, color: GREEN })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 600 },
    children: [new TextRun({ text: "Apprends à coder, une leçon à la fois.", italics: true, size: 28, color: HARE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "COMPTE RENDU", bold: true, size: 44, color: WOLF })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 800 },
    children: [new TextRun({ text: "Application mobile .NET MAUI", size: 32, color: WOLF })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 6, color: GREEN, space: 6 } }, children: [new TextRun("")] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 60 },
    children: [new TextRun({ text: "Ryad Senhadji", bold: true, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text: "16 juin 2026", size: 24, color: HARE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new ExternalHyperlink({ link: "https://github.com/dayr20/Duodingo",
      children: [new TextRun({ text: "github.com/dayr20/Duodingo", style: "Hyperlink", size: 22 })] })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

const toc = [
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Sommaire")] }),
  new TableOfContents("Sommaire", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
];

const body = [
  // 1
  h1("1. Présentation du projet"),
  p("Duodingo est une application mobile d’apprentissage de la programmation qui reprend les codes et la gamification de Duolingo. L’objectif : rendre l’apprentissage du code accessible, motivant et « addictif » grâce à des leçons courtes, interactives et récompensées."),
  p("Là où Duolingo enseigne les langues, Duodingo enseigne les langages de programmation : JavaScript, Python, HTML/CSS, SQL et TypeScript. L’utilisateur progresse sur un parcours structuré, gagne de l’expérience (XP), entretient une série quotidienne (streak) et conserve un capital de cœurs qu’il perd en cas d’erreur."),
  h2("1.1 Objectifs"),
  bullet("Rendre l’apprentissage du code accessible aux débutants complets."),
  bullet("Proposer une expérience gamifiée qui motive la pratique quotidienne."),
  bullet("Couvrir les langages les plus demandés."),
  bullet("Offrir une progression structurée du niveau débutant à intermédiaire."),
  bullet("Fonctionner sur Android et iOS à partir d’une seule base de code."),

  // 2
  h1("2. Architecture technique"),
  p("L’application suit une architecture client / serveur classique en trois couches :"),
  bulletBold("Application mobile (.NET MAUI)", " — l’interface utilisateur multiplateforme, écrite en C#. Elle consomme l’API REST via HTTP."),
  bulletBold("API REST (Node.js / Express)", " — la logique métier : authentification JWT, gestion des leçons, de la progression, du classement et des défis."),
  bulletBold("Base de données (MongoDB)", " — le stockage des utilisateurs, langages, chapitres, leçons, exercices et progression."),
  p("Le client MAUI ne contient aucune logique métier sensible : il s’appuie entièrement sur l’API. Le jeton JWT renvoyé à la connexion est stocké de façon sécurisée sur l’appareil (SecureStorage) et envoyé dans l’en-tête Authorization de chaque requête authentifiée.", { size: 22 }),
  h2("2.1 Organisation du code MAUI"),
  infoTable([
    ["Services/", "Client HTTP (ApiService), configuration de l’URL d’API selon la plateforme."],
    ["Models/", "DTOs C# mappés sur le JSON du backend (User, Language, Lesson, Exercise…)."],
    ["Pages/", "Les écrans construits en C# + un kit d’UI réutilisable (UiKit) au style Duolingo."],
    ["App.xaml.cs", "Choix de la page racine : connexion ou application principale selon le jeton."],
    ["AppShell.xaml.cs", "Barre d’onglets (Apprendre, Défi, Classement, Profil) et routes de navigation."],
  ], 2200),

  // 3
  h1("3. Technologies utilisées"),
  infoTable([
    ["Framework mobile", ".NET MAUI 9 (C#) — interface multiplateforme Android / iOS"],
    ["Langage", "C# 13 / .NET 9"],
    ["Backend", "Node.js + Express (API REST)"],
    ["Base de données", "MongoDB (via Mongoose)"],
    ["Authentification", "JWT (JSON Web Token), mots de passe hachés (bcrypt)"],
    ["Stockage local", "SecureStorage (jeton), HttpClient pour les appels réseau"],
    ["Outils", "Android SDK / émulateur Pixel 7, Visual Studio / dotnet CLI"],
  ], 2800),

  // 4
  h1("4. Fonctionnalités"),
  h2("4.1 Authentification"),
  p("Inscription et connexion par email / mot de passe. Le jeton JWT est conservé pour reconnecter automatiquement l’utilisateur au lancement."),
  h2("4.2 Parcours d’apprentissage"),
  p("L’utilisateur choisit un langage, puis progresse sur un parcours en zig-zag (à la Duolingo) composé de chapitres et de leçons."),
  h2("4.3 Leçons interactives — 4 types d’exercices"),
  bulletBold("QCM", " — choix multiple avec une seule bonne réponse."),
  bulletBold("Vrai / Faux", " — affirmation à valider ou invalider."),
  bulletBold("Compléter le code (fill_code)", " — un extrait de code à trous à compléter."),
  bulletBold("Remettre dans l’ordre (order_code)", " — réorganiser des lignes de code dans le bon ordre."),
  h2("4.4 Gamification"),
  bulletBold("XP & niveaux", " — chaque leçon réussie rapporte de l’expérience ; le niveau augmente tous les 100 XP."),
  bulletBold("Série (streak)", " — nombre de jours consécutifs de pratique."),
  bulletBold("Cœurs", " — 5 cœurs maximum ; une erreur en coûte un ; régénération progressive."),
  bulletBold("Barre de progression & feedback", " — retour immédiat (correct/incorrect) avec explication pédagogique."),
  bulletBold("Écran de résultat festif", " — récapitulatif des XP gagnés et de la précision."),
  h2("4.5 Défi du jour"),
  p("Un défi quotidien rotatif (piège classique d’un langage) rapportant un bonus d’XP."),
  h2("4.6 Classement & profil"),
  p("Un classement XP entre utilisateurs (avec médailles pour le podium) et une page profil affichant statistiques et succès débloqués."),

  // 5
  h1("5. Modèle de données & API"),
  p("Le backend expose une API REST sous /api. Principaux points d’entrée consommés par l’application :"),
  apiTable([
    ["POST", "/auth/register", "Inscription"],
    ["POST", "/auth/login", "Connexion (renvoie le jeton JWT)"],
    ["GET", "/auth/me", "Profil de l’utilisateur connecté"],
    ["GET", "/languages", "Liste des langages"],
    ["GET", "/languages/:id/topics", "Chapitres d’un langage"],
    ["GET", "/.../topics/:id/lessons", "Leçons d’un chapitre"],
    ["GET", "/lessons/:id", "Détail d’une leçon (avec exercices)"],
    ["POST", "/lessons/:id/complete", "Validation d’une leçon (XP, série)"],
    ["GET", "/progress/stats", "Statistiques de l’utilisateur"],
    ["GET", "/progress/leaderboard", "Classement XP"],
    ["GET/POST", "/progress/hearts", "Consultation / mise à jour des cœurs"],
    ["GET", "/challenges/today", "Défi du jour"],
    ["POST", "/challenges/today/complete", "Validation du défi du jour"],
  ]),

  // 6 — Déroulé (démo)
  new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Déroulé de l’application (démo)")] }),
  p("Captures réelles prises sur l’émulateur Android (Pixel 7), application connectée au backend avec des données réelles."),
  shotGrid([
    shotRow(shotCell("00_login.png", "1. Écran de connexion"), shotCell("03_home.png", "2. Accueil — choix du langage")),
    shotRow(shotCell("04_path_js.png", "3. Parcours JavaScript (chapitres & leçons)"), shotCell("06_lesson_q1.png", "4. Leçon — exercice QCM")),
    shotRow(shotCell("08_lesson_correct.png", "5. Bonne réponse + explication"), shotCell("09_lesson_fillcode.png", "6. Exercice « compléter le code »")),
    shotRow(shotCell("12_ordercode_assembled.png", "7. Exercice « remettre dans l’ordre »"), shotCell("13_result.png", "8. Résultat de fin de leçon")),
    shotRow(shotCell("14_challenge.png", "9. Défi du jour"), shotCell("16_leaderboard.png", "10. Classement XP")),
    shotRow(shotCell("17_profile.png", "11. Profil & succès"), null),
  ]),

  // 7
  new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Difficultés rencontrées & solutions")] }),
  bulletBold("Trafic HTTP en clair bloqué sur Android", " — Android interdit par défaut les requêtes HTTP non chiffrées. Résolu en autorisant le cleartext (android:usesCleartextTraffic) pour le développement local."),
  bulletBold("Accès au backend depuis l’émulateur", " — l’émulateur Android joint la machine hôte via l’adresse 10.0.2.2 (et non localhost). L’URL d’API est sélectionnée automatiquement selon la plateforme."),
  bulletBold("Icônes Ionicons en base", " — les icônes étaient stockées sous forme de noms Ionicons (logo-javascript, cube-outline…). Une table de correspondance les convertit en emojis affichables dans MAUI."),
  bulletBold("Réponses à format variable", " — le champ correctAnswer peut être une chaîne (QCM) ou un tableau (remise en ordre). Géré via un JsonElement et deux accesseurs typés."),

  // 8
  h1("8. Installation & lancement"),
  h2("8.1 Backend"),
  p("cd backend → npm install → npm run seed → npm start (port 5001, MongoDB requis).", { font: "Consolas", size: 20 }),
  h2("8.2 Application Android"),
  p("cd mobile-maui/Duodingo → dotnet build -t:Run -f net9.0-android", { font: "Consolas", size: 20 }),
  p("L’URL d’API (http://10.0.2.2:5001/api pour l’émulateur) est préconfigurée dans Services/AppConfig.cs.", { size: 22 }),

  // 9
  h1("9. Conclusion & perspectives"),
  p("Duodingo démontre qu’il est possible de transposer avec succès la mécanique gamifiée de Duolingo à l’apprentissage du code. L’application mobile .NET MAUI offre une expérience fluide, fidèle au design de référence, et entièrement connectée à un backend réel."),
  p("Perspectives d’évolution :"),
  bullet("Notifications de rappel quotidien pour entretenir la série."),
  bullet("Mode hors-ligne avec synchronisation différée."),
  bullet("Nouveaux types d’exercices (association de paires, saisie libre de code)."),
  bullet("Ligues et défis entre amis pour renforcer l’aspect social."),
];

// ============ DOCUMENT ============
const doc = new Document({
  creator: "Ryad Senhadji",
  title: "Duodingo — Compte rendu",
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: "333333" } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: DARKGREEN },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: WOLF },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 280 } } } }] },
    ],
  },
  sections: [
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: cover },
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Duodingo — Compte rendu   ·   ", size: 18, color: HARE }),
          new TextRun({ text: "Page ", size: 18, color: HARE }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: HARE })] })] }) },
      children: [...toc, ...body] },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(__dirname, "Duodingo_Compte_Rendu.docx"), buf);
  console.log("OK -> Duodingo_Compte_Rendu.docx");
});
