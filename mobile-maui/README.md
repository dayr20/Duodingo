# Duodingo — App mobile .NET MAUI

Application mobile (style **Duolingo**, mais pour apprendre à coder) construite en **.NET MAUI 9**.
Elle se connecte au **backend Node.js existant** du projet (`../backend`).

## Fonctionnalités

- **Authentification** : inscription / connexion (JWT stocké via `SecureStorage`).
- **Apprentissage** : liste des langages → chapitres → leçons sur un parcours en zig-zag.
- **Leçons jouables** avec 4 types d'exercices :
  - `qcm` (choix multiple)
  - `true_false` (vrai / faux)
  - `fill_code` (compléter le code)
  - `order_code` (remettre les lignes dans l'ordre)
- **Gamification Duolingo** : XP, niveaux, série (streak), cœurs (perdus sur erreur), barre de progression, écran de résultat festif.
- **Défi du jour** : un défi quotidien rapportant des XP bonus.
- **Classement** XP entre utilisateurs.
- **Profil** : statistiques et succès débloqués.

## Architecture

```
Duodingo/
  Services/
    AppConfig.cs        # URL de l'API selon la plateforme
    ApiService.cs       # client HTTP + gestion du token JWT
  Models/Models.cs      # DTOs (mapping JSON du backend)
  Pages/
    UiKit.cs            # thème + composants UI réutilisables (style Duolingo)
    LoginPage / RegisterPage
    HomePage            # langages
    PathPage            # chapitres + leçons
    LessonPlayPage      # déroulé d'une leçon
    ResultPage          # écran de fin de leçon
    DailyChallengePage
    LeaderboardPage
    ProfilePage
  App.xaml.cs           # choix de la page racine (login vs onglets)
  AppShell.xaml.cs      # barre d'onglets + routes
```

L'UI est entièrement construite en C# (pas de XAML par page) pour rester lisible et fiable.

## Prérequis

- .NET 9 SDK + workload MAUI (`dotnet workload install maui`)
- Android SDK + un émulateur (ex. `Pixel_7`)
- Le backend Node.js qui tourne sur le port **5001** avec MongoDB et des données seedées

## Lancer

### 1. Démarrer le backend

```bash
cd ../backend
npm install
npm run seed   # remplit la base (langages, chapitres, leçons)
npm start      # écoute sur http://localhost:5001
```

### 2. Démarrer l'app sur l'émulateur Android

```bash
cd mobile-maui/Duodingo
dotnet build -t:Run -f net9.0-android
```

> L'émulateur Android joint l'hôte via `10.0.2.2`. L'URL de l'API
> (`http://10.0.2.2:5001/api`) est déjà configurée dans `Services/AppConfig.cs`.
> Pour un **appareil physique**, remplace cette adresse par l'IP locale de ta machine.

### iOS (optionnel)

Le code reste compatible iOS. Avec Xcode installé :

```bash
dotnet build -t:Run -f net9.0-ios
```

(`AppConfig.cs` utilise `localhost` hors Android.)
