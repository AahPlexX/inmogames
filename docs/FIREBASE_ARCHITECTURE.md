# Firebase account and game-save architecture

**Status:** Repository implementation verified with unit, Security Rules and browser emulator tests; live project/site verification blocked
**Last synchronized:** 2026-10-04

## Platform boundary

The frontend remains static React + TypeScript + Vite on GitHub Pages. Firebase Authentication provides optional email/password identity; Cloud Firestore stores account-bound game progress. Guest play remains available. Optional Firebase Hosting compatibility is separate from account services. There is no custom application server, Admin SDK, privileged browser credential, telemetry or unrelated Firebase product.

See [Firebase setup](FIREBASE_SETUP.md) for Console configuration, public build variables, current official references and live-verification requirements.

## Shared modules

| Module | Responsibility |
| --- | --- |
| `src/platform/firebase/config.ts` | Validate the four required Web configuration fields; missing/invalid config becomes guest-only |
| `src/platform/firebase/client.ts` | Modular SDK initialization for Auth and Firestore Lite |
| `src/platform/auth/firebase.ts` | Auth SDK adapter: browser-local persistence, observer, registration/sign-in/reset/sign-out |
| `src/platform/auth/controller.ts` | Observable account state, safe error messages and write authorization across identity changes |
| `src/platform/auth/AccountControls.tsx` | Optional native-dialog account controls and session feedback |
| `src/platform/saves/contracts.ts` | Generic game-save contracts and version validation |
| `src/platform/saves/local.ts` | Defensive guest persistence, per-account mirrors and in-memory fallback |
| `src/platform/saves/firestore.ts` | Owner document access, server timestamps and atomic first-save migration |
| `src/platform/saves/session.ts` | Hydration, local resilience, ordered checkpoint writes, reset/retry/status |
| `src/platform/PlatformProvider.tsx` | Page-lifetime per-game sessions and game-facing `useGameSave` |

Game workspaces request save/reset through `useGameSave`; they do not import Firebase. Pure engines remain Firebase-, React-, DOM- and storage-free. Each game owns its save definition and decoder. Adding a game does not require a global union of game state or another Firebase client.

## Authentication

Email/password registration, sign-in, password reset and sign-out are optional. The Auth adapter awaits `setPersistence(auth, browserLocalPersistence)` before subscribing to `onAuthStateChanged`. Browser-local persistence restores sessions between visits. If browser storage cannot support it, the adapter explicitly falls back to `inMemoryPersistence` and reports the limited session lifetime.

The observer resolves initial account state; the application never assumes that an initially null `currentUser` means restoration is complete. Guest play during initialization writes only guest-local data. Once an account is resolved, account hydration controls cloud writes. Signing out immediately prevents new account operations before switching to the guest scope. Queued operations from an old identity are rejected, and stale hydration callbacks are ignored. A request already issued before sign-out may finish for its original account; it cannot be redirected to another account.

The UI uses labelled email/password fields, native form validation, disabled pending controls, actionable errors, status announcements and a modal `<dialog>` with native focus confinement/Escape/focus restoration. The account bar is available in the catalog and games. No auth wall is introduced.

## Save contract and envelope

```ts
interface GameSaveRepository<TState> {
  load(gameSlug: string): Promise<TState | null>;
  save(gameSlug: string, schemaVersion: number, state: TState): Promise<void>;
  delete(gameSlug: string): Promise<void>;
}
```

The Firestore adapter additionally provides `loadOrSeed` for transactional migration. Account documents use:

`users/{uid}/games/{gameSlug}`

```ts
interface CloudGameSave<TState> {
  schemaVersion: number;
  state: TState;
  updatedAt: unknown;
}
```

`updatedAt` is written using `serverTimestamp()` at the adapter boundary. Game decoders reject unsupported versions and invalid values while projecting only durable fields. Unknown cloud schemas are not silently reinterpreted or overwritten by migration.

The modular Firestore Lite SDK reads directly from the server and does not provide an implicit offline queue. The platform owns local fallback, retry and operation ordering explicitly. Document reads/writes do not require composite indexes or a realtime subscription.

## Guest/local behavior

Guests retain the existing storage keys:

- `inmogames:royal-palace-blackjack:v1`
- `inmogames:threefold:v1`

New local writes use `{ schemaVersion, state }` envelopes. Valid legacy Blackjack JSON and Threefold numeric best scores are read and normalized without removing unrelated keys. Malformed/unavailable storage falls back to defaults/in-memory state with a nonblocking notice. No guest operation needs Firebase.

Account mirrors use `inmogames:account:{encodedUid}:{gameSlug}:v{schemaVersion}`. They are separate from guest keys and from every other account. Signed-in gameplay never writes account data into guest keys. The mirrors are caches, not an authorization mechanism.

## Account hydration, migration and checkpoints

On the first authenticated load of each game, a transaction reads its cloud document. An existing valid account save wins over guest data. If no document exists and eligible guest progress exists, the same transaction creates the save with that progress and a server timestamp. Concurrent first loads retry against the current document, avoiding a read-then-write migration race. Missing guest data does not create a save until a meaningful checkpoint/reset.

Until cloud hydration succeeds, cached/default account play remains possible but automatic cloud writes are withheld. The UI shows a nonblocking failure/slow-loading notice; authoritative account hydration starts a fresh ephemeral game session. A retry that finally loads cloud progress takes the cloud state, rather than uploading unverified guest/default changes.

After hydration, meaningful checkpoints update the account-local mirror and enter one ordered cloud-write queue. Per-game sessions survive navigation within the page so queued writes are not discarded when a workspace unmounts. Signing out/changing account disposes those sessions and prevents stale writes. Opening an account from another device or reloading loads the latest server state; there is no realtime multi-device conflict-resolution UI. Confirmed checkpoint writes use normal last-write-wins document semantics.

On a failed account write, the current page retains its pending checkpoint and local mirror, exposes **Retry account sync**, and keeps gameplay available. Retry flushes the latest checkpoint/reset in order. Pending retry intent is not replayed across page reloads or sign-out; on a subsequent successful load the cloud remains authoritative. The UI asks players to retry before leaving. If the cloud cannot load, only that account's mirror/defaults are used, never another user's or unrelated guest progress.

## Game-scoped reset

For guests, reset removes only the selected game's local key and restores its defaults. For accounts, reset clears that game's mirror and writes a versioned default-state cloud document. Retaining that default document prevents old guest progress from being seeded again after sign-out/in. Failed resets are retried through the same queue. The underlying Firestore repository also supports exact-document deletion; no account collection or other game is deleted by the game reset UI.

## Game schemas and durable boundaries

Both current cloud schemas use version **1**.

Royal Palace Blackjack (`royal-palace-blackjack`) stores bankroll, last completed base wager (`lastBet`), integer W/L/P counts, cumulative virtual-credit net (`sessionNet`), and sound/hint preferences. Completed settlement commits credit/statistic progression; preference changes merge into the last committed balance. Chip construction, deal, insurance/split/double in progress and unfinished rounds never commit transient balances. Reload abandons an unfinished round with the last completed balance. Legacy saves already damaged by the old betting-time write cannot be reconstructed because the staged wager was not recorded; valid legacy balances are preserved without guessing a correction.

Threefold (`threefold`) stores only `{ bestScore }`, updated after a completed five-round run beats the previous best. Scores are zero or valid completed totals from 100 through 500 in steps of 20. Active runs, tiles, selections and partial scores remain ephemeral.

## Security Rules

`firestore.rules` denies access by default. For `users/{userId}/games/{gameId}`, reads/deletes require `request.auth != null && request.auth.uid == userId`. Creates/updates also require a valid slug, exactly `schemaVersion`, `state`, `updatedAt`, a positive integer version, a map state and `updatedAt == request.time`. Hiding controls is not authorization. Game-state decoding is client-side integrity checking; virtual game scores are not trusted competitive results.

`firebase.json` retains Hosting and adds the Firestore rules path plus local emulator settings. No permissive rule or privileged credential is introduced.

## Verification and external blockers

`pnpm validate` covers dependency policy, TypeScript, game structure, unit behavior, mandatory rules emulator tests, browser Auth/Firestore emulator tests, the optional root-base Hosting build and the canonical Pages build. Use pnpm 10.0.0, Node 22+, Java 21 and Playwright Chromium. Run a frozen install and `pnpm exec playwright install chromium` first; Linux CI installs Chromium dependencies as well.

`pnpm test:rules` uses Firebase's `@firebase/rules-unit-testing` against `demo-inmogames` to verify owner CRUD, other-user/guest denial, default denial, game isolation and timestamp/envelope requirements. `pnpm test:browser` launches two local Vite servers with isolated demo/unconfigured configuration and tests guest/blocked storage, wagering/reload, optional Auth, migration, cross-browser progress, scoped reset, sync retry and a 320px account dialog with 200% text, Tab confinement and Escape focus restoration. Browser test data is synthetic and emulator-only. Emulator wiring is permitted only in Vite development mode, on localhost/127.0.0.1, with the explicit emulator flag and reserved demo project; it is disabled in production builds.

Repository tests do not verify a live project or deployed Auth/email/save flow. TASK-003 requires actual Web app configuration, provider/database/rules/domain setup and deployed-site verification. TASK-001 separately requires enabling GitHub Pages. Optional Hosting deployment remains TASK-004 and does not block accounts on Pages.
