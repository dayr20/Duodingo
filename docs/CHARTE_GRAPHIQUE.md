# Charte Graphique - Duodingo

---

## 1. Identite visuelle

### 1.1 Nom de l'application

**Duodingo** - Contraction de "Duo" (apprentissage a deux : l'app et toi) et "Dingo" (fun, energique). Un clin d'oeil direct a Duolingo dont le concept gamifie est repris pour l'apprentissage du code.

### 1.2 Logo

Le logo Duodingo est compose de :
- Une icone representant des chevrons de code `</>` entoures d'un cercle
- Le texte "Duodingo" en typographie bold

```
    ┌──────────────┐
    │              │
    │   ┌──────┐   │
    │   │ </> │   │
    │   └──────┘   │
    │              │
    └──────────────┘
       DUODINGO
```

**Regles d'utilisation du logo :**
- Espace de protection : marge minimum egale a la hauteur du "D" autour du logo
- Taille minimum : 32px de hauteur pour le digital
- Ne pas deformer, incliner ou changer les couleurs du logo
- Versions : logo complet (icone + texte), icone seule (pour app icon)

### 1.3 Icone de l'application

- Fond : couleur primaire (#58CC02)
- Icone : chevrons de code en blanc
- Coins arrondis selon les standards iOS/Android

---

## 2. Palette de couleurs

### 2.1 Couleurs principales

| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Primary Green** | `#58CC02` | 88, 204, 2 | Boutons principaux, succes, elements actifs, logo |
| **Primary Dark** | `#46A302` | 70, 163, 2 | Ombres des boutons principaux, hover |
| **Secondary Blue** | `#1CB0F6` | 28, 176, 246 | Liens, code, elements secondaires |

### 2.2 Couleurs de fond (Theme sombre)

| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Background** | `#131F24` | 19, 31, 36 | Fond principal de l'application |
| **Surface** | `#1A2C34` | 26, 44, 52 | Cards, headers, barres de navigation |
| **Surface Light** | `#233A44` | 35, 58, 68 | Elements survoles, cards secondaires |
| **Border** | `#37464F` | 55, 70, 79 | Bordures, separateurs |

### 2.3 Couleurs de texte

| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **White** | `#FFFFFF` | 255, 255, 255 | Texte principal, titres |
| **Text Secondary** | `#AFAFAF` | 175, 175, 175 | Sous-titres, descriptions |
| **Text Muted** | `#777777` | 119, 119, 119 | Texte desactive, placeholders |

### 2.4 Couleurs fonctionnelles

| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Success** | `#58CC02` | 88, 204, 2 | Bonne reponse, validation |
| **Error / Heart** | `#FF4B4B` | 255, 75, 75 | Mauvaise reponse, coeurs, erreurs |
| **Warning / XP** | `#FFC800` | 255, 200, 0 | Points XP, etoiles, alertes |
| **Streak** | `#FF9600` | 255, 150, 0 | Flamme de serie quotidienne |

### 2.5 Couleurs des langages

| Langage | Hex | RGB | Usage |
|---------|-----|-----|-------|
| **JavaScript** | `#F7DF1E` | 247, 223, 30 | Icone JS, bordures topics JS |
| **Python** | `#3776AB` | 55, 118, 171 | Icone Python, bordures topics Python |
| **HTML/CSS** | `#E34F26` | 227, 79, 38 | Icone HTML, bordures topics HTML |

### 2.6 Representation visuelle de la palette

```
COULEURS PRINCIPALES
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │
│  #58CC02    │  │  #46A302    │  │  #1CB0F6    │
│  Primary    │  │  Primary    │  │  Secondary  │
│  Green      │  │  Dark       │  │  Blue       │
│             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘

FONDS (THEME SOMBRE)
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │  │             │
│  #131F24    │  │  #1A2C34    │  │  #233A44    │  │  #37464F    │
│  Background │  │  Surface    │  │  Surface    │  │  Border     │
│             │  │             │  │  Light      │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

COULEURS FONCTIONNELLES
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │  │             │
│  #58CC02    │  │  #FF4B4B    │  │  #FFC800    │  │  #FF9600    │
│  Succes     │  │  Erreur     │  │  XP / Or    │  │  Streak     │
│             │  │             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 3. Typographie

### 3.1 Police systeme

L'application utilise la **police systeme native** de chaque plateforme pour des performances optimales et une integration naturelle :

| Plateforme | Police | Raison |
|------------|--------|--------|
| iOS | **SF Pro** (San Francisco) | Police native Apple, optimisee pour les ecrans Retina |
| Android | **Roboto** | Police native Google, lisible et moderne |

### 3.2 Hierarchie typographique

| Element | Taille | Poids | Couleur | Usage |
|---------|--------|-------|---------|-------|
| **Title** | 40px | 800 (Extra Bold) | #FFFFFF | Titre principal ("Duodingo" sur Welcome) |
| **H1** | 32px | 800 (Extra Bold) | #FFFFFF | Titres d'ecrans |
| **H2** | 24px | 700 (Bold) | #FFFFFF | Sous-titres, sections |
| **H3** | 20px | 700 (Bold) | #FFFFFF | Questions d'exercices, elements importants |
| **Body Large** | 16px | 600 (Semi Bold) | #FFFFFF | Texte principal, options QCM |
| **Body** | 14px | 400 (Regular) | #AFAFAF | Descriptions, explications |
| **Caption** | 12px | 600 (Semi Bold) | #777777 | Labels, meta-info |
| **Small** | 10px | 400 (Regular) | #777777 | XP requis, notes |

### 3.3 Police code (Code Snippets)

| Plateforme | Police | Taille |
|------------|--------|--------|
| iOS | **Menlo** | 14px |
| Android | **monospace** | 14px |

Les extraits de code sont affiches dans des blocs avec :
- Fond : Surface (#1A2C34)
- Couleur du code : Secondary Blue (#1CB0F6)
- Bordure gauche coloree (3px) selon le contexte :
  - Bleu (#1CB0F6) pour QCM
  - Jaune (#FFC800) pour completion de code

### 3.4 Regles typographiques

- **Boutons** : texte en MAJUSCULES, letter-spacing 1px, poids 800
- **Labels de navigation** : 11px, poids 600
- **Nombres/stats** : poids 800 pour une lisibilite maximale
- **Interligne** : 1.4x la taille de police pour le texte courant (lineHeight = fontSize * 1.4)

---

## 4. Composants UI

### 4.1 Boutons

#### Bouton principal (CTA)
```
┌────────────────────────────────┐
│                                │
│        C'EST PARTI             │  Fond : #58CC02
│                                │  Texte : #FFFFFF, 16px, bold
└────────────────────────────────┘  Rayon : 16px
                                    Padding : 16px vertical
                                    Ombre : #46A302, offset 0/4, blur 5
```

#### Bouton secondaire (Outline)
```
┌────────────────────────────────┐
│                                │
│    J'AI DEJA UN COMPTE         │  Fond : transparent
│                                │  Bordure : 2px #233A44
└────────────────────────────────┘  Texte : #1CB0F6, 16px, bold
                                    Rayon : 16px
```

#### Bouton d'erreur
```
┌────────────────────────────────┐
│                                │
│          CONTINUER             │  Fond : #FF4B4B
│                                │  Texte : #FFFFFF, 16px, bold
└────────────────────────────────┘  Rayon : 16px
```

#### Etats des boutons
| Etat | Modification |
|------|-------------|
| Normal | Style par defaut |
| Presse | Opacite 0.8 |
| Desactive | Opacite 0.7 |
| Chargement | ActivityIndicator blanc centre |

### 4.2 Cards

#### Card de topic (Parcours)
```
┌──────────────────────────────┐
│                              │
│       ┌────────┐             │  Fond : #1A2C34
│       │  icon  │             │  Bordure : 2px couleur langage
│       └────────┘             │  Rayon : 16px
│                              │  Padding : 16px
│      Nom du Topic            │
│                              │
└──────────────────────────────┘
```

#### Card de lecon
```
┌──────────────────────────────────────────┐
│ (1)  Titre de la lecon              +20  │  Fond : #1A2C34
│      Description courte              XP  │  Bordure : 1px #37464F
│                                      >   │  Rayon : 16px
└──────────────────────────────────────────┘  Padding : 16px
```

#### Card de statistique
```
┌──────────────┐
│     icon     │  Fond : #1A2C34
│              │  Bordure : 1px couleur thematique
│     42       │  Rayon : 16px
│   LABEL      │  Padding : 16px
└──────────────┘  Alignement : centre
```

### 4.3 Champs de formulaire (Inputs)

```
┌──────────────────────────────────────────┐
│  [icon]   Placeholder text               │  Fond : #1A2C34
│                                          │  Bordure : 1px #37464F
└──────────────────────────────────────────┘  Rayon : 16px
                                              Hauteur : 56px
                                              Padding horizontal : 16px
                                              Icone : 20px, #777777
                                              Texte saisi : #FFFFFF, 16px
                                              Placeholder : #777777, 16px
```

### 4.4 Options d'exercices (QCM)

#### Etat normal
```
┌──────────────────────────────────────────┐
│  Texte de l'option                       │  Fond : #1A2C34
│                                          │  Bordure : 2px #37464F
└──────────────────────────────────────────┘  Texte : #FFFFFF
```

#### Etat selectionne
```
┌──────────────────────────────────────────┐
│  Texte de l'option                       │  Fond : #233A44
│                                          │  Bordure : 2px #1CB0F6
└──────────────────────────────────────────┘  Texte : #FFFFFF
```

#### Bonne reponse
```
┌──────────────────────────────────────────┐
│  Texte de l'option              check    │  Fond : #58CC0220
│                                          │  Bordure : 2px #58CC02
└──────────────────────────────────────────┘  Texte : #58CC02
                                              Icone check : #58CC02
```

#### Mauvaise reponse
```
┌──────────────────────────────────────────┐
│  Texte de l'option              cross    │  Fond : #FF4B4B20
│                                          │  Bordure : 2px #FF4B4B
└──────────────────────────────────────────┘  Texte : #FF4B4B
                                              Icone cross : #FF4B4B
```

### 4.5 Chips (Selecteur de langage)

```
┌───────────────────┐
│  [icon]  Langage  │  Fond : transparent (inactif) / #233A44 (actif)
│                   │  Bordure : 2px couleur langage
└───────────────────┘  Rayon : 20px (pill shape)
                       Padding : 8px vertical, 16px horizontal
                       Gap icone-texte : 6px
```

### 4.6 Barre de progression

```
┌──────────────────────────────────────────┐
│██████████████████░░░░░░░░░░░░░░░░░░░░░░░│  Track : #1A2C34
└──────────────────────────────────────────┘  Fill : #58CC02
                                              Hauteur : 12px
                                              Rayon : 6px
                                              Animation : 300ms ease
```

### 4.7 Barre de feedback

#### Feedback correct
```
┌──────────────────────────────────────────┐
│  check  Correct !                        │  Fond : #58CC0215
│                                          │  Rayon haut : 20px
│  ┌────────────────────────────────────┐  │
│  │          CONTINUER                 │  │  Bouton : #58CC02
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

#### Feedback incorrect
```
┌──────────────────────────────────────────┐
│  cross  Incorrect                        │  Fond : #FF4B4B15
│  Explication de la bonne reponse...      │  Rayon haut : 20px
│                                          │
│  ┌────────────────────────────────────┐  │
│  │          CONTINUER                 │  │  Bouton : #FF4B4B
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 5. Iconographie

### 5.1 Bibliotheque d'icones

L'application utilise **Ionicons** (via Expo Vector Icons), un jeu d'icones modern et coherent.

### 5.2 Icones utilisees

| Contexte | Icone | Nom Ionicons |
|----------|-------|-------------|
| Code / Logo | `</>` | `code-slash` |
| Accueil | maison | `home` / `home-outline` |
| Profil | personne | `person` / `person-outline` |
| Classement | trophee | `trophy` / `trophy-outline` |
| Streak | flamme | `flame` |
| Coeurs | coeur | `heart` |
| XP | etoile | `star` |
| Retour | fleche | `arrow-back` |
| Fermer | croix | `close` |
| Correct | check cercle | `checkmark-circle` |
| Incorrect | croix cercle | `close-circle` |
| Verrouille | cadenas | `lock-closed` |
| JavaScript | logo JS | `logo-javascript` |
| Python | logo Python | `logo-python` |
| Email | mail | `mail-outline` |
| Mot de passe | cadenas | `lock-closed-outline` |
| Visibilite | oeil | `eye-outline` / `eye-off-outline` |
| Variables | cube | `cube-outline` |
| Conditions | branche | `git-branch-outline` |
| Boucles | refresh | `refresh-outline` |
| Fonctions | code | `code-working-outline` |
| Tableaux | liste | `list-outline` |
| Deconnexion | sortie | `log-out-outline` |

### 5.3 Regles d'utilisation des icones

| Parametre | Valeur |
|-----------|--------|
| Taille navigation | 24px |
| Taille header stats | 20px |
| Taille dans les cards | 28-32px |
| Taille logo/trophee | 60-80px |
| Style | Outline pour inactif, Filled pour actif |
| Couleur active | Couleur thematique (vert, rouge, or...) |
| Couleur inactive | #777777 (Text Muted) |

---

## 6. Espacement et grille

### 6.1 Unites d'espacement

| Token | Valeur | Usage |
|-------|--------|-------|
| `xs` | 4px | Micro-espacements |
| `sm` | 8px | Espacement entre elements proches |
| `md` | 12px | Gap entre cards, elements de liste |
| `lg` | 16px | Padding standard, gap entre sections |
| `xl` | 20px | Espacement entre blocs |
| `xxl` | 24px | Marges de section |
| `xxxl` | 32px | Separation majeure |
| `padding` | 16px | Padding horizontal des ecrans |

### 6.2 Padding des ecrans

| Element | Valeur |
|---------|--------|
| Padding horizontal | 24px (1.5 * padding) |
| Padding top (safe area) | 60px |
| Padding bottom | 40px |
| Padding bottom avec tabs | 100px (pour ne pas cacher sous la tab bar) |

### 6.3 Rayons de bordure

| Token | Valeur | Usage |
|-------|--------|-------|
| `radiusSmall` | 8px | Blocs de code, petits elements |
| `radius` | 16px | Cards, boutons, inputs |
| `pill` | 20px+ | Chips, badges |
| `circle` | 50% | Avatars, icones rondes |

---

## 7. Animations et transitions

### 7.1 Animations definies

| Animation | Type | Duree | Usage |
|-----------|------|-------|-------|
| Barre de progression | `Animated.timing` | 300ms | Progression dans une lecon |
| Score trophee | `Animated.spring` | tension 50, friction 7 | Apparition du trophee sur l'ecran resultat |
| Fade in stats | `Animated.timing` | 400ms | Apparition des stats apres le trophee |

### 7.2 Principes d'animation

- **Feedback immediat** : toute interaction doit avoir un retour visuel instantane
- **Naturel** : utiliser spring pour les animations de rebond
- **Performant** : toujours utiliser `useNativeDriver: true` quand possible
- **Subtil** : les animations doivent guider, pas distraire

---

## 8. Ton et voix

### 8.1 Personnalite de la marque

| Trait | Description |
|-------|------------|
| **Encourageant** | Toujours positif, meme en cas d'erreur ("Continue a pratiquer !") |
| **Ludique** | Utilisation d'un vocabulaire fun et accessible |
| **Direct** | Messages courts et clairs, pas de jargon inutile |
| **Inclusif** | Tutoiement, ton amical et bienveillant |

### 8.2 Messages types

| Contexte | Message |
|----------|---------|
| Welcome | "Apprends a coder. Gratuitement. Fun." |
| Inscription | "Commence ton aventure de codeur !" |
| Connexion | "Content de te revoir !" |
| Score 100% | "Parfait !" |
| Score 80%+ | "Excellent !" |
| Score 60%+ | "Bien joue !" |
| Score < 60% | "Continue a pratiquer !" |
| Bonne reponse | "Correct !" |
| Mauvaise reponse | "Incorrect" + explication |
| Plus de vies | "Tu as perdu toutes tes vies. Reessaie plus tard !" |
| Badges vides | "Complete des lecons pour debloquer des badges !" |
| Deconnexion | "Es-tu sur de vouloir te deconnecter ?" |

### 8.3 Boutons (CTA)

Les boutons utilisent un style **imperatif en majuscules** :
- C'EST PARTI
- SE CONNECTER
- CREER MON COMPTE
- CONTINUER
- TERMINER
- VERIFIER

---

## 9. Accessibilite

### 9.1 Contraste

Tous les couples texte/fond respectent un ratio de contraste minimum :

| Couple | Ratio | Norme |
|--------|-------|-------|
| Blanc (#FFF) sur Background (#131F24) | 15.3:1 | AAA |
| Blanc (#FFF) sur Surface (#1A2C34) | 12.8:1 | AAA |
| Text Secondary (#AFAFAF) sur Background | 7.2:1 | AAA |
| Primary Green (#58CC02) sur Background | 8.1:1 | AAA |
| Text Muted (#777) sur Background | 3.9:1 | AA |

### 9.2 Zones tactiles

- Taille minimum des boutons : 44 x 44 points
- Espacement minimum entre elements cliquables : 8px
- Les icones de navigation ont un padding de toucher etendu

### 9.3 Lisibilite

- Taille minimum de texte : 10px (pour les notes uniquement)
- Taille recommandee pour le texte courant : 14-16px
- Les blocs de code utilisent une police monospace pour la distinction visuelle
