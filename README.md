# Treasurely

Application web Progressive (PWA) pour créer et participer à des chasses au trésor.

## 👨‍💻 Auteurs
- Maxence POIZAT
- Ylan NICOLAS
- Jules DESCOUTURES
- Clément DAVID

## 🚀 Technologies utilisées

### Frontend
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **React Router 7** - Navigation et routing
- **Redux Toolkit** - Gestion d'état
- **Tailwind CSS 4** - Framework CSS utilitaire

### PWA & Performance
- **Vite PWA** - Plugin PWA avec Service Worker
- **Workbox** - Stratégies de cache et gestion hors ligne
- **Service Worker personnalisé** - Cache intelligent et fallback offline

### UI & Icons
- **FontAwesome** - Bibliothèque d'icônes
- **Police Inter** - Typographie personnalisée

### Qualité de code
- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Formateur de code
- **TypeScript ESLint** - Règles ESLint spécifiques TypeScript

## 📦 Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x

## 🛠️ Installation

1. Cloner le dépôt :
```bash
git clone https://iut-info.univ-reims.fr/gitlab/treasurely/sae5-01-front.git
cd sae5-01-front
```

2. Installer les dépendances :
```bash
npm install
```

## 🎮 Scripts disponibles

### Développement
```bash
npm run dev
```
Lance le serveur de développement Vite avec hot-reload sur `http://localhost:5173`.

### Build de production
```bash
npm run build
```
Compile l'application pour la production dans le dossier `dist/`.
Ce script :
1. Génère le CSS pour la page hors ligne
2. Compile TypeScript
3. Build l'application avec Vite

### Génération du CSS offline
```bash
npm run build:offline
```
Génère le fichier CSS optimisé pour la page hors ligne (`public/offline-built.css`).

### Prévisualisation de production
```bash
npm run preview
```
Prévisualise le build de production localement.

### Servir le build
```bash
npm run serve
```
Sert le dossier `dist/` avec un serveur HTTP statique.

### Linting
```bash
npm run lint        # Vérifie le code
npm run lint:fix    # Corrige automatiquement les erreurs
```

### Serveur de développement API (mock)
```bash
npm run json-server
```
Lance un serveur JSON mock sur le port 3000 pour le développement.

## 🌐 Fonctionnalités PWA

L'application est entièrement fonctionnelle en tant que Progressive Web App :

### Service Worker
Le Service Worker personnalisé (`public/sw.js`) gère :
- Pré-cache des assets essentiels
- Fallback vers `offline.html` en cas de déconnexion

## 🔧 Configuration Docker

### Build de l'image
```bash
docker build -t treasurely-front .
```

### Lancement avec Docker Compose
```bash
docker-compose up
```

## 🎨 Personnalisation

### Styles
Les styles sont gérés avec Tailwind CSS v4. Le fichier de configuration principal est `src/tailwind-config.css`.

## 🐛 Débogage

### Service Worker
Pour déboguer le Service Worker :
1. Ouvrir Chrome DevTools
2. Aller dans l'onglet "Application"
3. Section "Service Workers"

### Cache
Pour vider les caches :
1. DevTools > Application > Storage
2. "Clear site data"

Projet réalisé dans le cadre de la SAE 5.01

---

**Note** : Cette application nécessite un backend compatible pour fonctionner pleinement. Consultez le dépôt backend pour plus d'informations : https://iut-info.univ-reims.fr/gitlab/treasurely/sae5-01-back.git.

