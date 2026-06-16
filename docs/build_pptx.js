const pptxgen = require("pptxgenjs");
const path = require("path");
const S = (f) => path.join(__dirname, "screens", "small", f);

const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
p.author = "Ryad Senhadji";
p.title = "Duodingo";

// Palette Duodingo
const GREEN = "58CC02", DARKGREEN = "3C7A00", INK = "131F0E", BLUE = "1CB0F6",
      GOLD = "FFC800", CORAL = "FF4B4B", FOX = "FF9600", WOLF = "4B4B4B",
      HARE = "AFAFAF", POLAR = "F4F8EE", WHITE = "FFFFFF";
const HF = "Trebuchet MS", BF = "Calibri";

// Fond sombre réutilisable
function darkBg(s) { s.background = { color: INK }; }
function lightBg(s) { s.background = { color: WHITE }; }

// Titre de section (slides claires)
function title(s, t, kicker) {
  if (kicker) s.addText(kicker.toUpperCase(), { x: 0.6, y: 0.45, w: 9, h: 0.3, fontFace: HF, fontSize: 12, bold: true, color: GREEN, charSpacing: 2 });
  s.addText(t, { x: 0.6, y: 0.7, w: 12, h: 0.8, fontFace: HF, fontSize: 32, bold: true, color: INK });
}

// Carte arrondie
function card(s, x, y, w, h, fill) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: "E8EDE0", width: 1 }, rectRadius: 0.12, shadow: { type: "outer", color: "C9D2BC", blur: 6, offset: 2, angle: 90, opacity: 0.5 } });
}

// Mockup téléphone (cadre + capture)
function phone(s, file, x, y, h) {
  const w = h * 405 / 900;
  s.addShape(p.ShapeType.roundRect, { x: x - 0.05, y: y - 0.05, w: w + 0.1, h: h + 0.1, fill: { color: INK }, rectRadius: 0.12, shadow: { type: "outer", color: "9AA791", blur: 8, offset: 3, angle: 90, opacity: 0.5 } });
  s.addImage({ path: S(file), x, y, w, h });
  return w;
}

// ---------- Slide 1 : Titre ----------
let s = p.addSlide(); darkBg(s);
s.addShape(p.ShapeType.ellipse, { x: -2, y: -2.5, w: 6, h: 6, fill: { color: "1C2E14" } });
s.addShape(p.ShapeType.ellipse, { x: 9.5, y: 4.2, w: 6.5, h: 6.5, fill: { color: "1C2E14" } });
s.addText("🦉", { x: 0, y: 1.5, w: 13.333, h: 1.6, align: "center", fontSize: 96 });
s.addText("Duodingo", { x: 0, y: 3.0, w: 13.333, h: 1.1, align: "center", fontFace: HF, fontSize: 64, bold: true, color: GREEN });
s.addText("Apprends à coder, une leçon à la fois.", { x: 0, y: 4.1, w: 13.333, h: 0.5, align: "center", fontFace: BF, fontSize: 20, italic: true, color: "CDE3B6" });
s.addText("Application mobile .NET MAUI  ·  inspirée de Duolingo", { x: 0, y: 4.9, w: 13.333, h: 0.4, align: "center", fontFace: BF, fontSize: 16, color: HARE });
s.addText("Ryad Senhadji   ·   16 juin 2026", { x: 0, y: 6.4, w: 13.333, h: 0.4, align: "center", fontFace: BF, fontSize: 14, color: HARE });

// ---------- Slide 2 : Le concept ----------
s = p.addSlide(); lightBg(s);
title(s, "Le concept", "Présentation");
s.addText([
  { text: "Duolingo a rendu l’apprentissage des langues ", options: {} },
  { text: "addictif", options: { bold: true, color: DARKGREEN } },
  { text: " grâce à la gamification.", options: {} },
], { x: 0.6, y: 1.8, w: 6.5, h: 1, fontFace: BF, fontSize: 20, color: WOLF });
s.addText("Duodingo applique la même recette à l’apprentissage du code : des leçons courtes, interactives et récompensées, qui transforment la programmation en jeu quotidien.",
  { x: 0.6, y: 2.7, w: 6.5, h: 1.6, fontFace: BF, fontSize: 18, color: WOLF });
const langs = [["🟨", "JavaScript"], ["🐍", "Python"], ["🌐", "HTML/CSS"], ["🗄️", "SQL"], ["🔷", "TypeScript"]];
langs.forEach((l, i) => {
  const y = 4.5 + i * 0.0; const x = 0.6 + i * 1.32;
  s.addShape(p.ShapeType.roundRect, { x, y: 4.6, w: 1.15, h: 1.3, fill: { color: POLAR }, line: { color: "E8EDE0", width: 1 }, rectRadius: 0.1 });
  s.addText(l[0], { x, y: 4.75, w: 1.15, h: 0.7, align: "center", fontSize: 30 });
  s.addText(l[1], { x, y: 5.45, w: 1.15, h: 0.35, align: "center", fontFace: BF, fontSize: 11, bold: true, color: WOLF });
});
phone(s, "03_home.png", 8.6, 1.2, 5.6);

// ---------- Slide 3 : Objectifs ----------
s = p.addSlide(); lightBg(s);
title(s, "Objectifs du projet", "Vision");
const objs = [
  ["🎯", "Accessible aux débutants", "Aucun prérequis : on apprend en jouant."],
  ["🔥", "Motiver la pratique", "Séries, XP et défis quotidiens pour revenir chaque jour."],
  ["📚", "Progression structurée", "Du niveau débutant à intermédiaire, langage par langage."],
  ["📱", "Une seule base de code", "Android et iOS avec .NET MAUI."],
];
objs.forEach((o, i) => {
  const x = 0.6 + (i % 2) * 6.2, y = 1.9 + Math.floor(i / 2) * 2.4;
  card(s, x, y, 5.9, 2.1, POLAR);
  s.addShape(p.ShapeType.ellipse, { x: x + 0.35, y: y + 0.35, w: 1.0, h: 1.0, fill: { color: GREEN } });
  s.addText(o[0], { x: x + 0.35, y: y + 0.42, w: 1.0, h: 0.85, align: "center", fontSize: 28 });
  s.addText(o[1], { x: x + 1.6, y: y + 0.35, w: 4.0, h: 0.5, fontFace: HF, fontSize: 18, bold: true, color: INK });
  s.addText(o[2], { x: x + 1.6, y: y + 0.9, w: 4.1, h: 1, fontFace: BF, fontSize: 14, color: WOLF });
});

// ---------- Slide 4 : Architecture ----------
s = p.addSlide(); lightBg(s);
title(s, "Architecture technique", "Sous le capot");
const layers = [
  ["📱", "Application .NET MAUI", "Interface C# multiplateforme. Consomme l’API, stocke le jeton JWT en SecureStorage.", GREEN],
  ["🔌", "API REST — Node.js / Express", "Authentification JWT, leçons, progression, classement, défis.", BLUE],
  ["🗄️", "Base de données — MongoDB", "Utilisateurs, langages, chapitres, leçons, exercices, progression.", FOX],
];
layers.forEach((l, i) => {
  const y = 1.9 + i * 1.65;
  card(s, 0.6, y, 12.1, 1.45, WHITE);
  s.addShape(p.ShapeType.ellipse, { x: 0.95, y: y + 0.3, w: 0.85, h: 0.85, fill: { color: l[3] } });
  s.addText(l[0], { x: 0.95, y: y + 0.36, w: 0.85, h: 0.7, align: "center", fontSize: 26 });
  s.addText(l[1], { x: 2.1, y: y + 0.25, w: 10.3, h: 0.5, fontFace: HF, fontSize: 19, bold: true, color: INK });
  s.addText(l[2], { x: 2.1, y: y + 0.75, w: 10.3, h: 0.55, fontFace: BF, fontSize: 14, color: WOLF });
  if (i < 2) s.addText("▼", { x: 1.2, y: y + 1.42, w: 0.4, h: 0.25, align: "center", fontSize: 14, color: HARE });
});

// ---------- Slide 5 : Technologies ----------
s = p.addSlide(); lightBg(s);
title(s, "Technologies", "Stack");
const tech = [
  [".NET MAUI 9", "Framework mobile"], ["C# / .NET 9", "Langage"],
  ["Node.js + Express", "API REST"], ["MongoDB", "Base de données"],
  ["JWT + bcrypt", "Authentification"], ["Android / iOS", "Cibles"],
];
tech.forEach((t, i) => {
  const x = 0.6 + (i % 3) * 4.13, y = 2.1 + Math.floor(i / 3) * 2.3;
  card(s, x, y, 3.85, 1.95, POLAR);
  s.addText(t[0], { x: x + 0.2, y: y + 0.45, w: 3.45, h: 0.7, align: "center", fontFace: HF, fontSize: 20, bold: true, color: DARKGREEN });
  s.addText(t[1], { x: x + 0.2, y: y + 1.15, w: 3.45, h: 0.5, align: "center", fontFace: BF, fontSize: 14, color: WOLF });
});

// ---------- Slide 6 : Fonctionnalités ----------
s = p.addSlide(); lightBg(s);
title(s, "Fonctionnalités", "Ce que fait l’app");
const feats = [
  ["🔐", "Authentification", "Inscription / connexion JWT"],
  ["🗺️", "Parcours", "Chapitres & leçons en zig-zag"],
  ["✏️", "4 types d’exercices", "QCM, vrai/faux, code à trous, remise en ordre"],
  ["🏆", "Gamification", "XP, niveaux, séries, cœurs"],
  ["⚡", "Défi du jour", "Un défi quotidien bonus"],
  ["📊", "Classement & profil", "Compétition et suivi des succès"],
];
feats.forEach((f, i) => {
  const x = 0.6 + (i % 3) * 4.13, y = 1.95 + Math.floor(i / 3) * 2.45;
  card(s, x, y, 3.85, 2.15, WHITE);
  s.addShape(p.ShapeType.ellipse, { x: x + 0.3, y: y + 0.3, w: 0.85, h: 0.85, fill: { color: POLAR } });
  s.addText(f[0], { x: x + 0.3, y: y + 0.37, w: 0.85, h: 0.7, align: "center", fontSize: 24 });
  s.addText(f[1], { x: x + 0.25, y: y + 1.2, w: 3.4, h: 0.4, fontFace: HF, fontSize: 16, bold: true, color: INK });
  s.addText(f[2], { x: x + 0.25, y: y + 1.6, w: 3.4, h: 0.5, fontFace: BF, fontSize: 12, color: WOLF });
});

// ---------- Slide 7 : Les 4 types d'exercices ----------
s = p.addSlide(); lightBg(s);
title(s, "Quatre types d’exercices", "Au cœur des leçons");
[["06_lesson_q1.png", "QCM"], ["10_truefalse.png", "Vrai / Faux"], ["09_lesson_fillcode.png", "Compléter le code"], ["12_ordercode_assembled.png", "Remettre dans l’ordre"]].forEach((it, i) => {
  const x = 0.85 + i * 3.18;
  phone(s, it[0], x, 1.75, 4.3);
  s.addText(it[1], { x: x - 0.2, y: 6.2, w: 2.3, h: 0.4, align: "center", fontFace: HF, fontSize: 14, bold: true, color: DARKGREEN });
});

// ---------- Slide 8 : Gamification ----------
s = p.addSlide(); darkBg(s);
s.addText("GAMIFICATION", { x: 0.6, y: 0.45, w: 9, h: 0.3, fontFace: HF, fontSize: 12, bold: true, color: GREEN, charSpacing: 2 });
s.addText("La mécanique qui rend addictif", { x: 0.6, y: 0.7, w: 12, h: 0.8, fontFace: HF, fontSize: 32, bold: true, color: WHITE });
const stats = [["⭐", "XP", "Gagnés à chaque leçon réussie", GOLD], ["🏆", "Niveaux", "Un nouveau niveau tous les 100 XP", GREEN], ["🔥", "Séries", "Jours consécutifs de pratique", FOX], ["❤️", "Cœurs", "5 max — une erreur en coûte un", CORAL]];
stats.forEach((st, i) => {
  const x = 0.6 + (i % 2) * 6.2, y = 2.0 + Math.floor(i / 2) * 2.4;
  s.addShape(p.ShapeType.roundRect, { x, y, w: 5.9, h: 2.1, fill: { color: "1C2E14" }, line: { color: "32481F", width: 1 }, rectRadius: 0.12 });
  s.addText(st[0], { x: x + 0.4, y: y + 0.55, w: 1.2, h: 1, align: "center", fontSize: 44 });
  s.addText(st[1], { x: x + 1.8, y: y + 0.4, w: 3.8, h: 0.6, fontFace: HF, fontSize: 24, bold: true, color: st[3] });
  s.addText(st[2], { x: x + 1.8, y: y + 1.05, w: 3.9, h: 0.8, fontFace: BF, fontSize: 14, color: "CDE3B6" });
});

// ---------- Slide 9 : Démo 1 ----------
s = p.addSlide(); lightBg(s);
title(s, "Démo — Connexion & parcours", "Captures réelles · émulateur Android");
[["00_login.png", "Connexion"], ["03_home.png", "Choix du langage"], ["04_path_js.png", "Parcours JavaScript"]].forEach((it, i) => {
  const x = 1.4 + i * 4.0;
  phone(s, it[0], x, 1.75, 4.5);
  s.addText(it[1], { x: x - 0.4, y: 6.35, w: 2.85, h: 0.4, align: "center", fontFace: HF, fontSize: 14, bold: true, color: DARKGREEN });
});

// ---------- Slide 10 : Démo 2 ----------
s = p.addSlide(); lightBg(s);
title(s, "Démo — Une leçon de A à Z", "Captures réelles");
[["06_lesson_q1.png", "Question"], ["08_lesson_correct.png", "Bonne réponse + explication"], ["13_result.png", "Résultat festif"]].forEach((it, i) => {
  const x = 1.4 + i * 4.0;
  phone(s, it[0], x, 1.75, 4.5);
  s.addText(it[1], { x: x - 0.4, y: 6.35, w: 2.85, h: 0.4, align: "center", fontFace: HF, fontSize: 14, bold: true, color: DARKGREEN });
});

// ---------- Slide 11 : Démo 3 ----------
s = p.addSlide(); lightBg(s);
title(s, "Démo — Défi, classement & profil", "Captures réelles");
[["15_challenge_done.png", "Défi du jour"], ["16_leaderboard.png", "Classement XP"], ["17_profile.png", "Profil & succès"]].forEach((it, i) => {
  const x = 1.4 + i * 4.0;
  phone(s, it[0], x, 1.75, 4.5);
  s.addText(it[1], { x: x - 0.4, y: 6.35, w: 2.85, h: 0.4, align: "center", fontFace: HF, fontSize: 14, bold: true, color: DARKGREEN });
});

// ---------- Slide 12 : Difficultés ----------
s = p.addSlide(); lightBg(s);
title(s, "Difficultés & solutions", "Retour technique");
const diffs = [
  ["Trafic HTTP bloqué sur Android", "Autorisation du cleartext (usesCleartextTraffic) pour le développement local."],
  ["Accès au backend depuis l’émulateur", "L’émulateur joint l’hôte via 10.0.2.2 — URL d’API choisie selon la plateforme."],
  ["Icônes Ionicons en base", "Table de correspondance Ionicons → emojis pour l’affichage MAUI."],
  ["Réponses à format variable", "correctAnswer en chaîne ou tableau — géré via JsonElement."],
];
diffs.forEach((d, i) => {
  const y = 1.9 + i * 1.25;
  card(s, 0.6, y, 12.1, 1.05, POLAR);
  s.addShape(p.ShapeType.roundRect, { x: 0.85, y: y + 0.3, w: 0.45, h: 0.45, fill: { color: CORAL }, rectRadius: 0.06 });
  s.addText("!", { x: 0.85, y: y + 0.28, w: 0.45, h: 0.45, align: "center", fontFace: HF, fontSize: 18, bold: true, color: WHITE });
  s.addText([{ text: d[0] + "  —  ", options: { bold: true, color: INK } }, { text: d[1], options: { color: WOLF } }],
    { x: 1.5, y: y + 0.18, w: 11.0, h: 0.7, fontFace: BF, fontSize: 15, valign: "middle" });
});

// ---------- Slide 13 : Conclusion ----------
s = p.addSlide(); darkBg(s);
s.addShape(p.ShapeType.ellipse, { x: 9.8, y: -2.2, w: 6, h: 6, fill: { color: "1C2E14" } });
s.addText("🦉", { x: 0.6, y: 1.4, w: 2, h: 1.2, fontSize: 64 });
s.addText("Conclusion", { x: 0.6, y: 2.7, w: 11, h: 0.9, fontFace: HF, fontSize: 40, bold: true, color: GREEN });
s.addText("Duodingo prouve qu’on peut transposer la gamification de Duolingo à l’apprentissage du code : une app .NET MAUI fluide, fidèle au design de référence et connectée à un vrai backend.",
  { x: 0.6, y: 3.7, w: 8.2, h: 1.6, fontFace: BF, fontSize: 18, color: "E7F3DA" });
s.addText("Perspectives", { x: 0.6, y: 5.2, w: 11, h: 0.4, fontFace: HF, fontSize: 16, bold: true, color: WHITE });
["Notifications de rappel quotidien", "Mode hors-ligne", "Nouveaux types d’exercices", "Ligues & défis entre amis"].forEach((t, i) => {
  s.addText("• " + t, { x: 0.6 + (i % 2) * 5.6, y: 5.6 + Math.floor(i / 2) * 0.45, w: 5.5, h: 0.4, fontFace: BF, fontSize: 14, color: "CDE3B6" });
});
s.addText("github.com/dayr20/Duodingo", { x: 0.6, y: 6.9, w: 8, h: 0.35, fontFace: BF, fontSize: 13, color: HARE });

p.writeFile({ fileName: path.join(__dirname, "Duodingo_Presentation.pptx") }).then((f) => console.log("OK ->", f));
