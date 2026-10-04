# Firebase account-service setup

GitHub Pages is the canonical frontend host. Firebase Hosting is optional and is not needed for these steps. Repository tests use the Emulator Suite; no live project has been provisioned or verified by those tests.

## Firebase Console

1. Create or select a Firebase project. Register a **Web app** in Project settings > General. Copy that app's `apiKey`, `authDomain`, `projectId` and `appId` from the SDK configuration. These are public Web configuration values. Do not use service-account credentials or an Admin SDK configuration.
2. In Authentication > Sign-in method, enable **Email/Password**. Email-link sign-in is not used. Review the password policy; the form requires at least six characters and the service enforces any stronger project policy. Keep email-enumeration protection enabled.
3. In Firestore Database, create the **default Cloud Firestore database**, using Standard edition/native Firestore and a suitable region. Start in production mode, not permissive test mode. The client uses the default database; no composite index is required for its document reads.
4. Publish the repository's `firestore.rules` before using cloud saves. It denies other paths and limits game documents to their authenticated owner. It also requires a versioned state map and a server timestamp. Do not add an unrestricted rule to work around a permissions error.
5. In Authentication > Settings > Authorized domains, add the final site's **hostname**, without scheme or path. For the default project site this is `aahplexx.github.io`; verify the actual Pages/custom-domain hostname before configuring it. Add any custom hostname from which the app will be served. The password-reset call includes the site's origin and Vite base path as its return URL, so that URL's domain must be authorized. The Firebase-hosted email action handler performs the reset; the app does not implement a custom handler.
6. For real-project local development, authorize `localhost` or `127.0.0.1` only if needed for that test URL. Firebase projects created after April 28, 2025 do not include `localhost` by default. Use a separate development project where possible. Emulator tests need no real project or Console changes.

Rules may be published from the Console Rules editor or with an authenticated developer CLI:

```sh
npx --yes firebase-tools@15.32.1 login
npx --yes firebase-tools@15.32.1 deploy --only firestore:rules --project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with the selected project's actual ID. This deploys only Firestore rules and does not deploy Hosting. CLI credentials remain outside the repository.

## Web configuration and Pages

For local development, copy `.env.example` to `.env.local` and fill in the four values from the Web app configuration. `.env.local` is ignored by Git. Restart Vite after changing it.

For GitHub Actions, add these **repository variables** in Settings > Secrets and variables > Actions > Variables:

| Variable | Firebase Web configuration field |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

The workflow supplies them at build time. Vite embeds them in the public bundle. They do not authorize Firestore access; Firebase Auth and Security Rules do. Never supply a service-account JSON, private key, Admin credential or privileged token to a `VITE_` variable.

Blank configuration builds successfully and enables guest play. Partial/invalid configuration disables account controls safely. A syntactically valid configuration can still point to an unavailable service; the application exposes nonblocking account/sync errors in that case.

Enable repository Settings > Pages > Source = GitHub Actions separately. After the configuration and rules are ready, deploy the current main through the existing workflow. Ordinary builds use `/inmogames/`; a custom domain may require revisiting the base-path decision. Changing the Firebase variables requires a new build/deployment.

## Verification on the deployed site

Verify all of the following before marking live integration complete:

- A visitor can play both games without signing in, including with storage/network unavailable.
- Registration, sign-in, session restoration after a reload/browser restart, password-reset email delivery/action/return URL, and sign-out work on the actual hostname.
- Seed guest progress into a new account; then sign in from a second browser with unrelated guest progress. Existing account saves must win.
- Complete a Blackjack round and a Threefold run, then reload and sign in from another browser. Only the documented durable state follows the account.
- Reload during Blackjack chip construction and during an unfinished round. Neither staged chips nor cards/shoe change durable credits.
- Reset one game, sign out/in and check both games. Only the selected game's account progress resets; guest saves and the account remain intact.
- Interrupt Firestore connectivity, complete a checkpoint, restore connectivity and use **Retry account sync** before leaving. Confirm the retry writes the intended account checkpoint.
- Confirm the deployed rules match the repository and denied cross-account/unauthenticated requests remain denied.

Live verification is currently blocked by missing real Web configuration, provider/database/rules/domain provisioning evidence, and the Pages setting/deployment. Emulator verification does not satisfy those external checks.

## Authoritative references

Reviewed 2026-10-04:

- [Web setup and modular SDK](https://firebase.google.com/docs/web/setup)
- [Email/password Authentication and password policy](https://firebase.google.com/docs/auth/web/password-auth)
- [Auth persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence) and [Auth API reference](https://firebase.google.com/docs/reference/js/auth)
- [Auth observer, password reset and user management](https://firebase.google.com/docs/auth/web/manage-users)
- [Email action return URLs and authorized domains](https://firebase.google.com/docs/auth/web/passing-state-in-email-actions)
- [Current localhost authorization behavior](https://firebase.google.com/docs/auth/web/email-link-auth)
- [Firestore initialization, writes and server timestamps](https://firebase.google.com/docs/firestore/manage-data/add-data)
- [Firestore reads](https://firebase.google.com/docs/firestore/query-data/get-data) and [transactions](https://firebase.google.com/docs/firestore/manage-data/transactions)
- [Firestore Lite](https://firebase.google.com/docs/firestore/solutions/firestore-lite) and [Lite API reference](https://firebase.google.com/docs/reference/js/firestore_lite)
- [Security Rules conditions](https://firebase.google.com/docs/firestore/security/rules-conditions) and [Firebase-supported rules tests](https://firebase.google.com/docs/rules/unit-tests)
- [Auth emulator](https://firebase.google.com/docs/emulator-suite/connect_auth) and [Firestore emulator](https://firebase.google.com/docs/emulator-suite/connect_firestore)
- [JavaScript release notes](https://firebase.google.com/support/release-notes/js) and [official npm package](https://www.npmjs.com/package/firebase)

The npm `latest` tag and Firebase Web setup/release documentation identify `firebase@12.19.0` as the latest stable release at review time; the separate `next` tag is not used.
