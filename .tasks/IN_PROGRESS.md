# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold/Mergrove checkpoints and browser emulator checks. Live completion is tracked by TASK-003. GitHub Pages is canonical; optional Firebase Hosting is independent.

**2026-10-06 live-project verification:** the Firebase Web app `inmogames` is registered to project `inmogames-c4b7f`, all four documented public repository variables are now being consumed by production, and configured revision `05d035914d50bf8ab206745a8c07ff672c1cb99e` passed/deployed in Pages run `37478582518`. A fresh uncached post-deploy fetch renders the optional `Sign in / create account` UI rather than `Accounts are not available on this site yet`, functionally proving the production bundle accepted the Web configuration. Real Firebase services are not yet provisioned enough to complete TASK-003: the public Identity Toolkit project-config probe returned `CONFIGURATION_NOT_FOUND`, consistent with Firebase Authentication/provider setup not yet being enabled, and a direct default Firestore REST probe returned HTTP 403 stating that the Cloud Firestore API had not been used in project `inmogames-c4b7f` before or was disabled. Therefore no registration, persistence, rules, authorized-domain, password-reset, migration, cross-browser, retry, reset or ownership-denial **live-project** claim is made yet. Royal Palace Blackjack, Threefold and Mergrove v1 are game-local verified; their account-save emulator evidence remains distinct from TASK-003 live verification.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation not started

Product owner approved the v2 direction on 2026-10-07. The authoritative Mergrove spec now defines the written launch target: 40 Campaign levels across five groves, seven deterministic objective patterns, 1–3 star mastery, existing Compost plus Sunbeam/Gust/Rewind Leaf, deterministic rewards, 20 permanent achievements, an eight-entry Spirit Almanac, Challenge Grove, optional procedural audio, evidence-driven balance simulation and a safe v1→v2 persistence migration.

This task is intentionally stopped at the architectural review gate: shipped v1 remains verified and no production source/test/save-schema mutation is authorized until the product owner reviews the written spec. After written-spec approval, create/review the implementation plan. The first production implementation integration must atomically reopen the Mergrove Completion contract, TRACKER, PRD/todo, GAME_INDEX and task state to `implementing`. TASK-003 live Firebase remains separate and must not be represented as completed by emulator migration tests.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; written specification awaiting review

Product owner approved a repository-wide quality direction on 2026-10-07: every current and future game must deliver equivalent gameplay quality, legibility, control access and hierarchy across narrow phones, rotated phones, tablets, compact laptops, desktops, large displays, 200% text, keyboard, pointer/touch and reduced-motion use.

The written architectural specification is `docs/superpowers/specs/2026-10-07-device-viewport-agnostic-game-quality-design.md`. It defines the representative seven-viewport matrix, invariant-based overflow/clipping/reachability requirements, the existing 44 × 44 CSS-pixel game-action target baseline, 200%-text and reduced-motion matrices, dynamic discovery from the rendered catalog, CI integration under `test:design-browser`, failure diagnostics, and the relationship between shared conformance evidence and per-game reopen/documentation rules.

This task is intentionally documentation-only until the written spec is reviewed. No shared browser harness, package script, CI rule, DESIGN/AGENTS/GOVERNANCE binding change or game-local source change has been made yet. Mergrove is being finished by a separate agent and must not be independently edited under QUALITY-001 while that ownership is active. After written-spec approval, create and review an implementation plan before modifying tests/code/governance. Any actual game defect discovered later must be fixed through that game's normal spec/tracker/PRD/todo continuity workflow.
