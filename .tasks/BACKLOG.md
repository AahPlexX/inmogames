# Backlog

- Shared game helpers (seeded random, local best-score storage, pause on tab hidden): add only when a second game needs them.
- Tool-route search indexing: hash routes are not reliably indexed (see D-003).

- INTEGRATION-001: review and reconcile existing remote branch `mergrove-v1.1-balance-and-presentation` (`1a5cc149c817c59ce83e2a2eda791a2c258c834e`) against main before any deletion. Eleven commits are not reachable from main; the comparison spans 41 files. Work is blocked by D-022 sequencing and requires connected-code/full-validation review; no merge/deletion was performed. Source: `git log origin/main..origin/mergrove-v1.1-balance-and-presentation` and `git diff --stat origin/main...origin/mergrove-v1.1-balance-and-presentation`, 2026-10-23.
