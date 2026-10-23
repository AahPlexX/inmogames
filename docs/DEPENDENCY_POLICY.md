# Dependency policy and current audit

**Last researched:** 2026-10-23
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

The 2026-10-23 audit fetched each official registry `latest` endpoint above. Every response matched the existing target set in `.tasks/dependency-refresh-request.json` (request revision 18): Firebase 13.1.0, React/React DOM 19.3.1, Firebase rules testing 6.0.0, React types 19.3.0, Vite React plugin 6.1.2, Firebase CLI 15.34.1, Playwright 1.64.1, TypeScript 7.0.2, Vite 8.3.5 and Vitest 5.0.5. npmjs.com package pages returned HTTP 403 during this audit; the official registry endpoint is the approved fallback under D-025. The authoritative release-source links remain independently required as shown in the table. The current candidate `package.json` and `pnpm-lock.yaml` contain the target pins. Frozen install passed locally on 2026-10-23 with Node 24.19.0 and pnpm 10.0.0. Local full validation passed on 2026-10-23 with 161 unit tests, four rules tests, shared/game browsers and both builds. Exact committed CI/Pages evidence remains pending.

The 2026-10-22 target refresh was triggered by the live `dependency:current` gate on revision `514c50d11daa9ad0074ef7e6326e26e773bf9e63`. That run verified the unchanged direct pins against npm `latest` and found three newer stable releases: Firebase JavaScript SDK 13.1.0, Firebase CLI 15.34.1 and Vite 8.3.5. Firebase's official release notes publish JavaScript SDK 13.1.0 on 2026-10-21; Vite's official repository marks v8.3.5 as its latest immutable release from 2026-10-21; Firebase CLI v15.34.1 is an official immutable non-prerelease GitHub release published 2026-10-22. The maintenance workflow must still regenerate and validate `package.json`/`pnpm-lock.yaml`; this target manifest does not itself claim that refresh has integrated.

The 2026-10-19 refresh established the prior exact baseline: Firebase 13.0.0, React/React DOM 19.3.1, Firebase rules testing 6.0.0, React types 19.3.0, Vite React plugin 6.1.2, Firebase CLI 15.34.0, Playwright 1.64.1, TypeScript 7.0.2, Vite 8.3.4 and Vitest 5.0.5.

## Runtime/toolchain consequence

`@firebase/rules-unit-testing@6.0.0` requires the repository's current Node 24.12+ validation toolchain. Repository workflows use Node 24.12.0.

## Refresh procedure

1. Research every direct package against its authoritative release source and corroborate the stable `latest` tag on npmjs.com. If the page is unavailable, use the official registry `latest` endpoint fallback and record the response/date plus evidence of page unavailability.
2. Update `.tasks/dependency-refresh-request.json` with the exact stable targets.
3. Let `Refresh pinned dependencies` regenerate the lockfile and run full validation. It commits only if the live npm `latest` check and all validation gates pass.
4. The maintenance workflow explicitly dispatches the Pages workflow after its bot commit because GitHub intentionally does not recursively start push workflows from commits made with `GITHUB_TOKEN`.
5. Update this audit if any target/evidence changes.
