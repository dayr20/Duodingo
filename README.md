# Duodingo - Apprends a coder en s'amusant

Application mobile gamifiee pour apprendre la programmation, inspiree du concept de Duolingo.

## Concept

Duodingo transforme l'apprentissage du code en une experience ludique et addictive :
- **Lecons interactives** structurees par langage et par theme
- **Exercices varies** : QCM, completion de code, vrai/faux, remise en ordre
- **Gamification** : XP, niveaux, series quotidiennes, vies, badges
- **Parcours progressif** : debloquez de nouveaux sujets en gagnant de l'XP

## Langages disponibles

- JavaScript (Variables, Types, Conditions, Boucles, Fonctions, Tableaux)
- Python (Introduction, Variables, Conditions)
- HTML/CSS (Bases HTML, Bases CSS)

## Stack technique

| Composant | Technologie |
|-----------|------------|
| Frontend | React Native (Expo) |
| Backend | Node.js + Express |
| Base de donnees | MongoDB + Mongoose |
| Authentification | JWT (JSON Web Tokens) |
| Navigation | React Navigation |
| State Management | React Context API |

## Structure du projet

```
Duodingo/
├── frontend/          # Application React Native (Expo)
│   ├── App.js
│   └── src/
│       ├── components/    # Composants reutilisables (exercices)
│       ├── constants/     # Theme, couleurs, config API
│       ├── context/       # AuthContext (gestion auth)
│       ├── navigation/    # Stack + Tab navigation
│       ├── screens/       # Ecrans de l'app
│       └── services/      # Appels API
├── backend/           # API REST Node.js
│   └── src/
│       ├── config/        # Configuration DB
│       ├── middleware/    # Auth middleware JWT
│       ├── models/        # Schemas Mongoose
│       ├── routes/        # Routes API
│       └── seeds/         # Donnees initiales
└── README.md
```

## Installation

### Prerequisites
- Node.js >= 18
- MongoDB (local ou Atlas)
- Expo CLI (`npm install -g expo-cli`)

### Backend

```bash
cd backend
npm install
# Configurer .env (MONGODB_URI, JWT_SECRET, PORT)
npm run seed    # Peupler la base de donnees
npm run dev     # Demarrer le serveur
```

### Frontend

```bash
cd frontend
npm install
npx expo start  # Demarrer l'app
```

## API Endpoints

| Methode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/auth/me | Profil utilisateur |
| GET | /api/languages | Liste des langages |
| GET | /api/languages/:id/topics | Topics d'un langage |
| GET | /api/lessons/:id | Detail d'une lecon |
| POST | /api/lessons/:id/complete | Completer une lecon |
| GET | /api/progress/stats | Statistiques utilisateur |

## Fonctionnalites

### Implementees
- [x] Authentification (inscription/connexion) avec JWT
- [x] Parcours de lecons par langage
- [x] 4 types d'exercices interactifs (QCM, fill code, vrai/faux, ordre)
- [x] Systeme XP et niveaux
- [x] Series quotidiennes (streak)
- [x] Systeme de vies (coeurs)
- [x] Ecran de resultats anime
- [x] Profil avec statistiques
- [x] Classement (leaderboard)
- [x] 10 lecons avec exercices pour 3 langages
- [x] Badges/achievements

### A venir
- [ ] Notifications push pour rappels quotidiens
- [ ] Mode hors-ligne
- [ ] Editeur de code integre
- [ ] Lecons supplementaires
- [ ] Systeme de duels entre joueurs
- [ ] Dark/Light mode toggle

## Auteur

Projet mobile - Livrable intermediaire
