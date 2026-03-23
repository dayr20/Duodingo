# Plan d'implémentation - Duodingo

## Stack Technique
- **Frontend**: React Native (Expo)
- **Backend**: Node.js + Express
- **Base de données**: MongoDB + Mongoose
- **Auth**: JWT

## Étapes d'implémentation

### Phase 1 : Setup projet
1. Initialiser le projet Expo (React Native)
2. Initialiser le backend Node.js + Express
3. Configurer MongoDB avec Mongoose
4. Structure de dossiers propre

### Phase 2 : Backend
1. Modèles MongoDB (User, Language, Topic, Lesson, Exercise, UserProgress)
2. Routes API REST (auth, languages, topics, lessons, progress)
3. Middleware d'authentification JWT
4. Données seed (leçons JavaScript, Python, HTML/CSS)

### Phase 3 : Frontend - Auth
1. Écran Welcome/Onboarding
2. Écrans Login / Register
3. Gestion du token JWT (AsyncStorage)

### Phase 4 : Frontend - Leçons & Exercices
1. Écran Home (parcours de leçons style Duolingo)
2. Écran de leçon (flow d'exercices)
3. Types d'exercices : QCM, Complétion de code, Vrai/Faux, Ordre de code
4. Écran de résultats

### Phase 5 : Frontend - Gamification
1. Système XP + niveaux
2. Streak (série quotidienne)
3. Système de vies/cœurs
4. Barres de progression

### Phase 6 : Frontend - Profil
1. Écran profil avec stats
2. Badges/achievements

## Fonctionnalités critiques pour le 23 mars
- Auth complète
- Parcours de leçons fonctionnel
- Au moins 3 types d'exercices interactifs
- Système de progression (XP, streak)
- Profil utilisateur
