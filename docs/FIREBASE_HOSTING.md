# Firebase Hosting

Firebase Hosting serves the static InMo Games build. Games continue to run in the browser with local saves. The app needs no Firebase SDK or web API key.

## Build and preview

Use the repository's pnpm version (10.0.0), then run:

```sh
pnpm install --frozen-lockfile
pnpm validate
pnpm build:firebase
npx --yes firebase-tools@15.32.1 emulators:start --only hosting --project demo-inmogames
```

Open `http://127.0.0.1:5000`. Check the catalog and game routes, including a reload on `/#/games/royal-palace-blackjack`.

`build:firebase` sets the asset base to `/`, matching Firebase's root URL. The regular `build` retains `/inmogames/` for GitHub Pages. Both write to `dist`, so always rebuild for the intended host immediately before deployment.

## Deploy

Create or select a Firebase project in the Firebase console and enable Hosting. Sign in with an account that can deploy to that project:

```sh
npx --yes firebase-tools@15.32.1 login
npx --yes firebase-tools@15.32.1 projects:list
pnpm validate
pnpm build:firebase
npx --yes firebase-tools@15.32.1 deploy --only hosting --project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with the actual project ID. The CLI prints the Hosting URL when deployment succeeds. No project ID is assumed or committed, and credentials stay in the CLI's local credential store.

## Routing and caching

The existing hash routes work with static hosting, so no SPA catch-all rewrite is needed. Missing static files return 404. Vite's hashed `/assets/` files are cached for one year; `index.html` is revalidated so new releases load the current asset names.

The GitHub Pages workflow remains available. Firebase deployment is manual until a project and deployment identity are configured; deploying to Firebase does not enable GitHub Pages.
