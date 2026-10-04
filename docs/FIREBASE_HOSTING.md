# Firebase Hosting

**Status:** Optional secondary static-host compatibility  
**Canonical deployment:** GitHub Pages

Firebase Hosting support is retained as an optional alternate static deployment path. It is not required for Firebase Authentication, Cloud Firestore, account saves, or ordinary InMo Games development.

The shared account/save architecture is defined in `docs/FIREBASE_ARCHITECTURE.md` and works from the canonical GitHub Pages build. Configure Auth/Firestore using `docs/FIREBASE_SETUP.md`. The `firestore` section in `firebase.json` declares rules independently of the retained `hosting` section.

## Build and preview

Use the repository's pnpm version (10.0.0), then run:

```sh
pnpm install --frozen-lockfile
pnpm validate
pnpm build:firebase
npx --yes firebase-tools@15.32.1 emulators:start --only hosting --project demo-inmogames
```

Open `http://127.0.0.1:5000`. Check the catalog and game routes, including a reload on `/#/games/royal-palace-blackjack`.

`build:firebase` sets the asset base to `/`, matching a root Firebase Hosting URL. The regular `build` retains `/inmogames/` for GitHub Pages. Both write to `dist`, so rebuild for the intended host immediately before deployment.

## Deploy

A live Firebase Hosting deployment is optional. If it is intentionally used, select a real Firebase project and authenticate an identity with Hosting deployment access:

```sh
npx --yes firebase-tools@15.32.1 login
npx --yes firebase-tools@15.32.1 projects:list
pnpm validate
pnpm build:firebase
npx --yes firebase-tools@15.32.1 deploy --only hosting --project YOUR_PROJECT_ID
```

Do not invent or commit a project ID or credentials. CLI credentials stay outside the repository.

## Routing and caching

The existing hash routes work with static hosting, so no SPA catch-all rewrite is required. Missing static files return 404. Vite hashed `/assets/` files use immutable caching; `index.html` revalidates so new releases load current asset names.

## Separation from Auth and Firestore

Firebase Hosting itself does not provide the account/save behavior. The account/save implementation uses the modular Firebase Web SDK for Authentication and Cloud Firestore and must function when the app is served from GitHub Pages.

Configuring optional Firebase Hosting does not satisfy `PLATFORM-001` or `TASK-003`.
