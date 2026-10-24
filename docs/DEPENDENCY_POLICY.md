# Dependency policy and current audit

**Last researched:** 2026-10-23 (direct packages)
**Last security audit:** 2026-10-24 (`pnpm audit`: no known vulnerabilities; see "Transitive security overrides")
**Machine-readable target set:** `.tasks/dependency-refresh-request.json`

## Integration rule

Every direct package in `dependencies` and `devDependencies` must satisfy all of the following when a change is integrated to `main`:

1. The target is the current stable release documented by the package/project's authoritative source.
2. The exact version is corroborated by the package's npmjs.com page as the stable `latest` tag. If that page is unavailable, the official npm registry `latest` endpoint may provide corroboration; record the endpoint, returned version, check date and page-unavailability evidence. The package/project's authoritative release source remains independently required.
3. The version is written as exact semver in `package.json`; ranges such as `^`, `~`, wildcards, prerelease tags and unpinned URLs are prohibited.
4. `pnpm-lock.yaml` is regenerated from that exact target set.
5. `pnpm dependency:check`, `pnpm dependency:current`, frozen install and the full validation suite pass before deployment.

`dependency:current` compares `package.json` with the researched target manifest and npm's live registry `latest` result. An upstream stable release that appears before a later `main` integration therefore blocks that integration until the repository is deliberately refreshed and revalidated.

Prerelease channels such as `next`, `alpha`, `beta`, `rc`, canary and experimental are not considered stable for this policy.

## Current direct-package audit

| Package | Exact stable target | Authoritative release evidence | npmjs.com package page | Official registry `latest` verified 2026-10-23 |
| --- | ---: | --- | --- | --- |
| firebase | 13.1.0 | Firebase release notes: https://firebase.google.com/support/release-notes/js | https://www.npmjs.com/package/firebase | https://registry.npmjs.org/firebase/latest — `13.1.0` |
| react | 19.3.1 | React releases: https://github.com/facebook/react/releases | https://www.npmjs.com/package/react | https://registry.npmjs.org/react/latest — `19.3.1` |
| react-dom | 19.3.1 | React releases: https://github.com/facebook/react/releases | https://www.npmjs.com/package/react-dom | https://registry.npmjs.org/react-dom/latest — `19.3.1` |
| @firebase/rules-unit-testing | 6.0.0 | Firebase JS SDK package source: https://github.com/firebase/firebase-js-sdk/blob/main/packages/rules-unit-testing/package.json | https://www.npmjs.com/package/@firebase/rules-unit-testing | https://registry.npmjs.org/@firebase%2Frules-unit-testing/latest — `6.0.0` |
| @types/react | 19.3.0 | DefinitelyTyped React definitions: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react | https://www.npmjs.com/package/@types/react | https://registry.npmjs.org/@types%2Freact/latest — `19.3.0` |
| @types/react-dom | 19.3.0 | DefinitelyTyped React DOM definitions: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom | https://www.npmjs.com/package/@types/react-dom | https://registry.npmjs.org/@types%2Freact-dom/latest — `19.3.0` |
| @vitejs/plugin-react | 6.1.2 | Vite React plugin releases: https://github.com/vitejs/vite-plugin-react/releases | https://www.npmjs.com/package/@vitejs/plugin-react | https://registry.npmjs.org/@vitejs%2Fplugin-react/latest — `6.1.2` |
| firebase-tools | 15.34.1 | Firebase CLI release: https://github.com/firebase/firebase-tools/releases/tag/v15.34.1 | https://www.npmjs.com/package/firebase-tools | https://registry.npmjs.org/firebase-tools/latest — `15.34.1` |
| playwright | 1.64.1 | Playwright release notes: https://playwright.dev/docs/release-notes | https://www.npmjs.com/package/playwright | https://registry.npmjs.org/playwright/latest — `1.64.1` |
| typescript | 7.0.2 | TypeScript releases: https://github.com/microsoft/TypeScript/releases | https://www.npmjs.com/package/typescript | https://registry.npmjs.org/typescript/latest — `7.0.2` |
| vite | 8.3.5 | Vite release: https://github.com/vitejs/vite/releases/tag/v8.3.5 | https://www.npmjs.com/package/vite | https://registry.npmjs.org/vite/latest — `8.3.5` |
| vitest | 5.0.5 | Vitest releases: https://github.com/vitest-dev/vitest/releases | https://www.npmjs.com/package/vitest | https://registry.npmjs.org/vitest/latest — `5.0.5` |

The 2026-10-23 audit fetched each official registry `latest` endpoint above. Every response matched the existing target set in `.tasks/dependency-refresh-request.json` (request revision 18): Firebase 13.1.0, React/React DOM 19.3.1, Firebase rules testing 6.0.0, React types 19.3.0, Vite React plugin 6.1.2, Firebase CLI 15.34.1, Playwright 1.64.1, TypeScript 7.0.2, Vite 8.3.5 and Vitest 5.0.5. npmjs.com package pages returned HTTP 403 during this audit; the official registry endpoint is the approved fallback under D-025. The authoritative release-source links remain independently required as shown in the table. The current candidate `package.json` and `pnpm-lock.yaml` contain the target pins. Frozen install passed locally on 2026-10-23 with Node 24.19.0 and pnpm 10.0.0. Local full validation passed on 2026-10-23 with 161 unit tests, four rules tests, shared/game browsers and both builds. Exact functional `2628ca2` passed CI/Pages `40034775904` on 2026-10-23.

The 2026-10-22 target refresh was triggered by the live `dependency:current` gate on revision `514c50d11daa9ad0074ef7e6326e26e773bf9e63`. That run verified the unchanged direct pins against npm `latest` and found three newer stable releases: Firebase JavaScript SDK 13.1.0, Firebase CLI 15.34.1 and Vite 8.3.5. Firebase's official release notes publish JavaScript SDK 13.1.0 on 2026-10-21; Vite's official repository marks v8.3.5 as its latest immutable release from 2026-10-21; Firebase CLI v15.34.1 is an official immutable non-prerelease GitHub release published 2026-10-22. The maintenance workflow must still regenerate and validate `package.json`/`pnpm-lock.yaml`; this target manifest does not itself claim that refresh has integrated.

The 2026-10-19 refresh established the prior exact baseline: Firebase 13.0.0, React/React DOM 19.3.1, Firebase rules testing 6.0.0, React types 19.3.0, Vite React plugin 6.1.2, Firebase CLI 15.34.0, Playwright 1.64.1, TypeScript 7.0.2, Vite 8.3.4 and Vitest 5.0.5.

## Runtime/toolchain consequence

`@firebase/rules-unit-testing@6.0.0` requires the repository's current Node 24.12+ validation toolchain. Repository workflows use Node 24.12.0.

## Transitive security overrides

Authority: D-029. Direct packages stay exact-pinned to npm `latest` (rules above); vulnerable *transitive* packages are patched through `pnpm.overrides` in `package.json`. Each key is `name@vulnerable-range`, each value one exact patched version, so only the affected range is rewritten. `pnpm dependency:check` rejects bare package names, selectors whose range is not an upper-bounded version range (`pkg@*`, `pkg@latest`, `pkg@x`, `pkg@>=0.0.0`) and non-exact targets.

**Evidence, 2026-10-24.** The GitHub dependency-graph SBOM for `main` (SPDX, created 2026-10-24T03:10:52Z, 665 unique npm package names) has no advisory data; it was cross-checked against the pre-change `pnpm-lock.yaml` (0 version mismatches) and the advisories were identified with `pnpm audit` on that lockfile: 17 advisories, 6 high / 8 moderate / 3 low, 743 packages, all transitive. After the overrides, `pnpm audit` reports "No known vulnerabilities found". Patched versions were confirmed to exist with `npm view <pkg> versions`.

| Override selector → exact version | Advisory | Severity | Reached through | Notes |
| --- | --- | --- | --- | --- |
| `@grpc/grpc-js@<1.13.6` → `1.13.6` | GHSA-m9gg-hp2v-232j, GHSA-f596-whhp-79r4 | high, low | `firebase` → `@firebase/firestore` (`~1.9.0`) | Node-only; the browser bundle uses `firebase/firestore/lite` and contains no gRPC code (SECURITY-001 evidence). Minor-line bump within 1.x. |
| `@opentelemetry/core@<2.8.0` → `2.8.0` | GHSA-8988-4f7v-96qf | moderate | `firebase-tools` → `@google-cloud/pubsub` | Major bump 1.x→2.x for a dev tool; `@opentelemetry/api` stays 1.9.1, inside core's `>=1.0.0 <1.10.0` peer range. Revisit if Pub/Sub emulation is ever used. |
| `body-parser@<1.20.9` → `1.20.9` | GHSA-27r3-jxmh-p828 | high | `firebase-tools` | Same major. |
| `body-parser@>=2.0.0 <2.4.0` → `2.4.0` | GHSA-27r3-jxmh-p828 | high | `firebase-tools` → `@modelcontextprotocol/sdk` → `express` | Same major. |
| `fast-uri@>=3.0.0 <3.1.9` → `3.1.9` | GHSA-w74x-v6f9-j3xg, GHSA-xhq7-xmqj-769h, GHSA-wjr9-j795-jxcr, GHSA-333x-w4r6-6crp | moderate, low | `firebase-tools` → `ajv` | Held to 3.x (latest is 4.x, outside `ajv`'s range). |
| `ip-address@<10.7.4` → `10.7.4` | GHSA-rxp7-6hxx-x8q5 | moderate | `firebase-tools` → `@modelcontextprotocol/sdk` → `express-rate-limit` | Same major. |
| `undici@>=6.5.0 <6.29.1` → `6.29.1` | GHSA-4qv8-2p9j-2685, GHSA-xjj6-f33q-929c | moderate, high | `firebase-tools` | Same major. |
| `undici@>=8.0.0 <8.12.2` → `8.12.3` | GHSA-4qv8-2p9j-2685, GHSA-f72v-6w45-q472, GHSA-xjj6-f33q-929c | moderate, high | `firebase-tools` → `superstatic` → `re2` → `node-gyp` | Same major. |
| `uuid@<11.1.1` → `11.1.1` | GHSA-w5hq-g745-h8pq | moderate | `firebase-tools` → `gaxios` | Major bump 9→11. 11.1.1 is the first patched release and ships both ESM and CommonJS entry points (checked with `npm view`); uuid 12+ is ESM-only, and `gaxios` 6.x is CommonJS and `require()`s uuid, so 11.1.1 avoids relying on `require(esm)`. Smoke-tested: `gaxios@6.7.1` loads and `v4()` runs. |
| `zod@<4.6.6` → `4.6.7` | GHSA-mrhx-c7xc-m3w5 | high | `firebase-tools` | Same major; 4.6.7 is the current 4.x release. |

**Not fixable by override, accepted:** none; every advisory resolved.

**Local verification, 2026-10-24 (Node 22.22.0, pnpm 10.0.0):** `pnpm install --frozen-lockfile`, `pnpm dependency:check`, `pnpm typecheck`, `pnpm game:check`, `pnpm test:unit` (161 tests), `pnpm test:rules` (emulator launched through the patched `firebase-tools`), `pnpm build` and `pnpm build:firebase` passed. `pnpm test:browser` and the Playwright design suites could not run in that container (the pinned Playwright 1.64.1 needs a Chromium build that was not installed there) and were not claimed. The exact CI/Pages run for the integrating commit is recorded in `.tasks/WORK_LOG.md` once it exists; the firebase-tools-dependent jobs (rules, account browser tests, maintenance workflow) are the ones that exercise the overridden packages.

**Maintenance:** when `firebase` or `firebase-tools` ships a release that natively resolves a patched version, remove the matching override, re-run `pnpm install --no-frozen-lockfile` and `pnpm audit`, and update this table in the same change. Do not add an override without an advisory ID, a scoped selector, and a row here.

## Refresh procedure

1. Research every direct package against its authoritative release source and corroborate the stable `latest` tag on npmjs.com. If the page is unavailable, use the official registry `latest` endpoint fallback and record the response/date plus evidence of page unavailability.
2. Update `.tasks/dependency-refresh-request.json` with the exact stable targets.
3. Let `Refresh pinned dependencies` regenerate the lockfile and run full validation. It commits only if the live npm `latest` check and all validation gates pass.
4. The maintenance workflow explicitly dispatches the Pages workflow after its bot commit because GitHub intentionally does not recursively start push workflows from commits made with `GITHUB_TOKEN`.
5. Run `pnpm audit`. Remove overrides that upstream now satisfies, add scoped overrides for new advisories (D-029), and keep the "Transitive security overrides" table identical to `package.json`. `scripts/apply-dependency-request.mjs` preserves `pnpm.overrides`; it rewrites only the dependency groups, `engines` and two scripts.
6. Update this audit if any target/evidence changes.

## Integrated refresh evidence — 2026-10-23

Functional revision `2628ca27e8aa95778203f78848d30df31e60f25e` passed frozen install, exact/current dependency gates, full validation, both builds and Pages deployment in run `40034775904`. Refreshed 10M-spin acceptance passed in `40036114157`. Dependency audit warnings recorded at that time as SECURITY-001 were resolved on 2026-10-24 by D-029 (see "Transitive security overrides" below); passing validation alone is never a zero-advisory claim, so re-run `pnpm audit` on every refresh.
