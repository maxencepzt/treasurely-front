# Treasurely

L'application des joueurs de Treasurely : une Progressive Web App pour rejoindre une équipe,
trouver une chasse au trésor et résoudre ses énigmes sur le terrain, contre la montre. Elle
consomme l'API du dépôt [treasurely-back](https://github.com/maxencepzt/treasurely-back), qui
porte les règles du jeu, la façade des concepteurs et le back office.

- Application en ligne : https://treasurely.maxencepzt.fr

## Ce que l'application fait

- **Accueil visiteur** : la promesse du jeu, le déroulé d'une partie, les quatre formes
  d'énigme, l'inscription et la connexion.
- **Tableau de bord** : la chasse en cours et sa progression, les chasses jouées et leurs
  scores, les totaux du joueur.
- **Chasses** : la liste des chasses ouvertes, filtrable par recherche, catégorie et difficulté ;
  la page d'une chasse avec son classement, la participation seul ou pour une équipe, la
  reprise, le rejeu d'une chasse terminée, l'abandon d'une chasse commencée.
- **Énigmes** : une page par énigme, ouverte dans l'ordre. Le chronomètre démarre à
  l'affichage. Texte, QCM, QR code (caméra ou saisie des chiffres) et GPS ; le serveur juge la
  réponse et renvoie le score, jamais la solution.
- **Équipes** : ses équipes, la création d'une équipe de joueurs et son code d'invitation,
  l'annuaire avec demandes d'adhésion que le créateur accepte ou refuse, le départ d'une équipe.
  Les équipes conceptrices se gèrent dans la façade du back, ouverte d'un bouton.
- **Profil et paramètres** : profil public ou privé, photo, informations du compte, mot de
  passe, suppression du compte.

Sur téléphone, une barre d'onglets en bas ; à partir de 768 px, un en-tête. L'application
s'installe comme une PWA et affiche une page hors ligne quand le réseau manque.

## Pile technique

React 19, TypeScript, Vite, React Router 7, Redux Toolkit avec RTK Query (un seul point d'accès
aux données, `src/store/slices/api.ts`), Tailwind CSS 4, FontAwesome, `vite-plugin-pwa` avec un
service worker écrit à la main (`public/sw.js`), ESLint.

## Démarrer en local

Prérequis : Node.js 22, npm, et le back lancé sur http://localhost:8000 (voir son README).

```bash
git clone git@github.com:maxencepzt/treasurely-front.git
cd treasurely-front
npm install
cp .env.dist .env        # VITE_API_BASE_URL, http://localhost:8000 par défaut
npm run dev              # http://localhost:5173
```

Avec le jeu de démonstration du back chargé, connectez-vous en `camille` (mot de passe dans
`DemoFixtures::PASSWORD` côté back) ou créez un compte depuis l'accueil.

## Scripts

| Script | Effet |
|---|---|
| `npm run dev` | serveur Vite avec rechargement à chaud |
| `npm run build` | CSS de la page hors ligne, puis `tsc -b`, puis `vite build` dans `dist/` |
| `npm run preview` | sert le build de production |
| `npm run lint`, `npm run lint:fix` | ESLint |
| `npm run build:offline` | régénère `public/offline-built.css` pour la page hors ligne |
| `npm run json-server` | une API factice sur :3000 depuis `src/data/db.json` |

Avant chaque commit : `npx tsc -b`, `npm run lint`, `npx vite build`. Il n'y a pas encore de
lanceur de tests côté front ; les parcours sont vérifiés dans un navigateur.

## Organisation du code

- `src/views` : les pages, une par route (`src/components/Router.tsx`).
- `src/components` : les briques réutilisables ; `AppShell` porte la navigation,
  `components/settings` le kit de formulaires (champs de 44 px, styles de boutons, retours
  d'erreur), `components/teams` et `components/dashboard` leurs cartes.
- `src/store` : le store Redux, le jeton d'accès en mémoire, le jeton de rafraîchissement dans
  `localStorage`, et la définition de chaque appel à l'API avec ses étiquettes de cache
  (`Participations`, `Me`, `User`, `Teams`, `Team`, `TeamRequests`), qui rafraîchissent les
  pages après chaque mutation.
- `src/hooks` : les hooks qui composent ces appels pour une page.
- `src/types/api.ts` : les réponses de l'API, écrites à la main.
- `public/sw.js` : le service worker. Les routes de connexion et de jetons ne sont jamais mises
  en cache ; la page hors ligne est pré-cachée avec un numéro de révision à incrémenter quand
  elle change.

## Déploiement

Le site est servi par Vercel : préréglage Vite, `npm run build`, dossier `dist`, variable
`VITE_API_BASE_URL` lue à la construction. `vercel.json` réécrit toutes les routes vers
`index.html` pour `BrowserRouter`. Chaque mise à jour de `main` est déployée. La caméra du
lecteur de QR code exige un contexte sécurisé (https ou localhost) ; la saisie manuelle reste
disponible.

## Conventions

Branches `<type>/<description-courte>`, commits Conventional Commits en anglais, une pull request
documentée par branche, fusionnée avec un commit de fusion. Les conventions partagées sont dans
le [CONTRIBUTING.md](https://github.com/maxencepzt/treasurely-back/blob/main/CONTRIBUTING.md) du
back.

## Auteurs

Maxence Poizat, Ylan Nicolas, Clément David, Jules Descoutures. Projet né à l'IUT de Reims
(SAE 5.01), poursuivi et mis en ligne par Maxence Poizat.
