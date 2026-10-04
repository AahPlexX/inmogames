# Firebase account and game-save architecture

**Status:** Approved; repository-side integration pending  
**Last synchronized:** 2026-10-04

## Purpose

Provide optional user accounts and account-bound game persistence while keeping InMo Games a static GitHub Pages application.

Firebase Authentication provides identity. Cloud Firestore stores authenticated game saves. Browser-local storage remains the guest path and local cache/fallback.

## Non-goals

- No custom application server.
- No Firebase Admin SDK in the browser.
- No service-account credentials in the repository.
- No forced sign-in before playing.
- No telemetry, advertising or unrelated Firebase products as part of this integration.
- No server-authoritative multiplayer or trusted competitive leaderboard in this phase.

## Authentication

Initial account UX supports:
- email/password registration;
- email/password sign-in;
- persistent signed-in session using Firebase Auth's browser persistence;
- password reset;
- sign out;
- accessible loading/error/success states.

Authentication is optional. Games must remain playable when signed out or when Firebase is temporarily unavailable.

## Firestore save model

Authenticated game save path:

`users/{uid}/games/{gameSlug}`

Each document uses an envelope:

```ts
interface CloudGameSave<TState> {
  schemaVersion: number;
  state: TState;
  updatedAt: unknown;
}
```

`updatedAt` is written with a Firestore server timestamp at the adapter boundary. The game slug is the stable catalog slug. A game with persistent data defines and owns its `TState` schema and schema version.

Do not persist live/transient state unless that game's spec explicitly requires it.

## Shared repository boundary

Games depend on a shared save contract, not Firebase APIs:

```ts
interface GameSaveRepository<TState> {
  load(gameSlug: string): Promise<TState | null>;
  save(gameSlug: string, schemaVersion: number, state: TState): Promise<void>;
  delete(gameSlug: string): Promise<void>;
}
```

Expected platform implementations:
- local/browser repository for guests and cache;
- Firestore repository for authenticated account saves;
- hybrid/orchestrating repository that selects behavior from auth state.

Firebase imports belong under `src/platform/`. Pure game engines must remain Firebase-free.

## Guest and account behavior

Signed out:
- load/save from the game's existing local persistence path;
- no account required;
- Firebase failure must not prevent play.

Signed in:
- Cloud Firestore is authoritative for durable account state;
- keep an optional local mirror/cache for fast recovery;
- save at meaningful game checkpoints, not every render or incidental UI interaction.

First sign-in migration:
- if no cloud document exists and eligible local progress exists, seed the account document from local progress;
- if a cloud document already exists, load the cloud version and do not silently replace it with unrelated guest state.

Reset:
- guest reset clears the game's local save;
- authenticated reset clears/resets both the account save and local mirror for that game only;
- account deletion is separate from resetting one game's progress.

## Security rules

Initial Firestore scope is only authenticated per-user game saves.

Required ownership rule:

```text
request.auth != null && request.auth.uid == userId
```

Target rules shape:

```text
match /users/{userId}/games/{gameId} {
  allow read, create, update, delete:
    if request.auth != null && request.auth.uid == userId;
}
```

All other document access remains denied unless a future documented feature requires it.

UI checks are not security controls. Firestore Security Rules are mandatory.

## Firebase client configuration

Use the modular Firebase Web SDK.

Firebase Web app configuration may be present in browser-readable configuration because it is not a privileged credential. Never expose:
- service-account JSON;
- private keys;
- Admin SDK credentials;
- privileged server tokens.

If concrete Firebase project configuration is unavailable during repository implementation, do not invent it. Implement a validated configuration boundary and document the exact external setup blocker.

## Failure behavior

- Firebase unavailable: guest/local play continues; authenticated sync surfaces a nonblocking failure and retains local state for retry.
- Auth session loading: avoid flashing destructive guest/account migration actions before auth state is known.
- Firestore permission denied: fail closed; do not retry by weakening rules.
- Schema mismatch: use explicit versioned migration or reject safely; never reinterpret unknown data silently.
- Sign-out: stop account writes before switching back to guest-local state.

## Game migration targets

### Royal Palace Blackjack

Cloud slug: `royal-palace-blackjack`.

Durable state:
- bankroll;
- last completed wager;
- W/L/P statistics;
- cumulative virtual-credit net;
- sound preference;
- strategy-hint preference.

Never cloud-persist the active shoe, dealer hand, player hand, current wager construction or unfinished round.

### Threefold

Cloud slug: `threefold`.

Durable state:
- best completed score.

Active five-round runs remain ephemeral in the current design.

## Verification

Integration is not verified until:
- auth state/provider behavior has tests at its public seam;
- local and Firestore repositories have success/failure coverage;
- guest mode works without Firebase;
- first-sign-in migration behavior is tested;
- Firestore Security Rules are verified against own-user access and cross-user denial;
- Blackjack reload/sign-in behavior preserves only committed durable state;
- Threefold account best score follows the authenticated user;
- no privileged credential is present in source/build artifacts;
- `pnpm validate` passes;
- docs/trackers/tasks match shipped behavior;
- deployed GitHub Pages auth/save flow is tested once external Firebase project configuration is available.
