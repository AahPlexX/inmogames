# Mergrove tracker

**Authoritative spec:** `docs/specs/2026-10-06-mergrove-design.md`  
**Last synchronized:** 2026-10-06

## Capability state

| Capability | Status | Evidence / continuation |
| --- | --- | --- |
| Deterministic 5 × 5 engine and queue | started | Local TypeScript/Node RED→GREEN probe passes; repository CI pending. |
| Orthogonal merge + cascade resolution | started | Local probes cover trio, two-stage cascade and scoring formula; CI pending. |
| Sunlight + compost recovery | started | Local probes cover full-board recovery threshold and compost spend; CI pending. |
| Tier-eight ancient bloom | started | Local probe verifies board-clearing terminal-tier merge; CI pending. |
| Eight-tier original SVG sprite bank | started | Repository-authored vector symbols implemented; rendered QA pending. |
| Responsive pointer/touch/keyboard UI | started | React/native-button implementation prepared; rendered browser evidence pending. |
| Guest active-run persistence | started | v1 decoder locally typechecked/probed; browser reload evidence pending. |
| Shared account checkpoint/reset | blocked externally | Shared emulator path will be tested in CI; real Firebase remains TASK-003. |
| Catalog/registry/index integration | started | Integration prepared; CI/document checker pending. |
| Production deployment | planned | Requires full validated `main` workflow and Pages smoke test. |

## Asset and network record

All Mergrove art is original repository-authored SVG in `src/games/mergrove/sprites.tsx`; no third-party licence or attribution is required. Mergrove adds no runtime network request. Optional account saves use only the repository's shared Firebase platform.

## Current handoff

**Implementation state:** implementing  
**Last verified revision:** none yet; this is new game-local work.  
**Open game-local work:** integrate source/tests/docs, pass repository CI/rendered browser coverage, smoke-test deployed route, then reconcile completion evidence.  
**External blockers:** TASK-003 blocks real configured-project Firebase account-save verification only; it does not block game-local implementation or emulator evidence.  
**Next action:** integrate the prepared Mergrove implementation onto the current live `main`, preserving any parallel-agent changes, then observe full validation and fix any evidence-backed defects before marking the game verified.
