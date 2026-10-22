# Dependency policy and current audit

**Last researched:** 2026-10-22  
**Machine-readable target set:** `.tasks/dependency-refresh-request.json`

## Integration rule

Every direct package in `dependencies` and `devDependencies` must satisfy all of the following when a change is integrated to `main`:

1. The target is the current stable release documented by the package/project's authoritative source.
2. The exact version is corroborated on the package's npmjs.com page as the stable `latest` tag.
3. The version is written as exact semver in `package.json`; ranges such as `^`, `~`, wildcards, prerelease tags and unpinned URLs are prohibited.
4. `pnpm-lock.yaml` is regenerated from that exact target set.
5. `pnpm dependency:check`, `pnpm dependency:current`, frozen install and the full validation suite pass before deployment.

`dependency:current` compares `package.json` with the researched target manifest and npm's live registry `latest` result. An upstream stable release that appears before a later `main` integration therefore blocks that integration until the repository is deliberately refreshed and revalidated.

Prerelease channels such as `next`, `alpha`, `beta`, `rc`, canary and experimental are not considered stable for this policy.

## Current direct-package audit

| Package | Exact stable target | Authoritative release evidence | npm corroboration |
| --- | ---: | --- | --- |
| firebase | 13.1.0 | Firebase release notes: https://firebase.google.com/support/releases | https://www.npmjs.com/package/firebase |
| react | 19.3.1 | React releases: https://github.com/facebook/react/releases | https://www.npmjs.com/package/react |
| react-dom | 19.3.1 | React releases: https://github.com/facebook/react/releases | https://www.npmjs.com/package/react-dom |
| @firebase/rules-unit-testing | 6.0.0 | Firebase JS SDK package source: https://github.com/firebase/firebase-js-sdk/blob/main/packages/rules-unit-testing/package.json | https://www.npmjs.com/package/@firebase/rules-unit-testing |
| @types/react | 19.3.0 | DefinitelyTyped React definitions: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react | https://www.npmjs.com/package/@types/react |
| @types/react-dom | 19.3.0 | DefinitelyTyped React DOM definitions: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom | https://www.npmjs.com/package/@types/react-dom |
| @vitejs/plugin-react | 6.1.2 | Vite React plugin releases: https://github.com/vitejs/vite-plugin-react/releases | https://www.npmjs.com/package/@vitejs/plugin-react |
| firebase-tools | 15.34.1 | Firebase CLI release: https://github.com/firebase/firebase-tools/releases/tag/v15.34.1 | https://www.npmjs.com/package/firebase-tools |
| playwright | 1.64.1 | Playwright release notes: https://playwright.dev/docs/release-notes | https://www.npmjs.com/package/playwright |
| typescript | 7.0.2 | TypeScript releases: https://github.com/microsoft/TypeScript/releases | https://www.npmjs.com/package/typescript |
| vite | 8.3.5 | Vite release: https://github.com/vitejs/vite/releases/tag/v8.3.5 | https://www.npmjs.com/package/vite |
| vitest | 5.0.5 | Vitest releases: https://github.com/vitest-dev/vitest/releases | https://www.npmjs.com/package/vitest |

The 2026-10-22 target refresh was triggered by the live `dependency:current` gate on revision `514c50d11daa9ad0074ef7e6326e26e773bf9e63`. That run verified the unchanged direct pins against npm `latest` and found three newer stable releases: Firebase JavaScript SDK 13.1.0, Firebase CLI 15.34.1 and Vite 8.3.5. Firebase's official release notes publish JavaScript SDK 13.1.0 on 2026-10-21; Vite's official repository marks v8.3.5 as its latest immutable release from 2026-10-21; Firebase CLI v15.34.1 is an official immutable non-prerelease GitHub release published 2026-10-22. The maintenance workflow must still regenerate and validate `package.json`/`pnpm-lock.yaml`; this target manifest does not itself claim that refresh has integrated.

The 2026-10-19 refresh established the prior exact baseline: Firebase 13.0.0, React/React DOM 19.3.1, Firebase rules testing 6.0.0, React types 19.3.0, Vite React plugin 6.1.2, Firebase CLI 15.34.0, Playwright 1.64.1, TypeScript 7.0.2, Vite 8.3.4 and Vitest 5.0.5.

## Runtime/toolchain consequence

`@firebase/rules-unit-testing@6.0.0` requires the repository's current Node 24.12+ validation toolchain. Repository workflows use Node 24.12.0.

## Refresh procedure

1. Research every direct package against its authoritative release source and npmjs.com immediately before the refresh.
2. Update `.tasks/dependency-refresh-request.json` with the exact stable targets.
3. Let `Refresh pinned dependencies` regenerate the lockfile and run full validation. It commits only if the live npm `latest` check and all validation gates pass.
4. The maintenance workflow explicitly dispatches the Pages workflow after its bot commit because GitHub intentionally does not recursively start push workflows from commits made with `GITHUB_TOKEN`.
5. Update this audit if any target/evidence changes.
