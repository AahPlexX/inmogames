# Dependency policy and current audit

**Last researched:** 2026-10-05  
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

| Package | Exact stable pin | Authoritative release evidence | npm corroboration |
| --- | ---: | --- | --- |
| firebase | 12.19.0 | Firebase JavaScript SDK release notes: https://firebase.google.com/support/release-notes/js | https://www.npmjs.com/package/firebase |
| react | 19.3.0 | React 19.3 release: https://react.dev/blog/2026/09/09/react-19-3 | https://www.npmjs.com/package/react |
| react-dom | 19.3.0 | React 19.3 release: https://react.dev/blog/2026/09/09/react-19-3 | https://www.npmjs.com/package/react-dom |
| @firebase/rules-unit-testing | 5.0.2 | Firebase JS SDK package source: https://github.com/firebase/firebase-js-sdk/blob/main/packages/rules-unit-testing/package.json | https://www.npmjs.com/package/@firebase/rules-unit-testing |
| @types/react | 19.3.0 | DefinitelyTyped React definitions: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react | https://www.npmjs.com/package/@types/react |
| @types/react-dom | 19.3.0 | DefinitelyTyped React DOM definitions: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom | https://www.npmjs.com/package/@types/react-dom |
| @vitejs/plugin-react | 6.1.2 | Vite React plugin official release `plugin-react@6.1.2`: https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.1.2 | https://www.npmjs.com/package/@vitejs/plugin-react |
| firebase-tools | 15.32.1 | Firebase CLI release: https://github.com/firebase/firebase-tools/releases/tag/v15.32.1 | https://www.npmjs.com/package/firebase-tools |
| playwright | 1.63.0 | Playwright release notes: https://playwright.dev/docs/release-notes | https://www.npmjs.com/package/playwright |
| typescript | 7.0.2 | TypeScript 7 stable announcement: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ | https://www.npmjs.com/package/typescript |
| vite | 8.3.2 | Vite releases/current stable line: https://vite.dev/releases and https://github.com/vitejs/vite/releases/tag/v8.3.2 | https://www.npmjs.com/package/vite |
| vitest | 5.0.3 | Vitest 5 stable announcement/release: https://vitest.dev/blog/vitest-5 and https://github.com/vitest-dev/vitest/releases/tag/v5.0.3 | https://www.npmjs.com/package/vitest |

The 2026-10-05 refresh was triggered by the npm live `latest` tag moving `@vitejs/plugin-react` from 6.1.1 to 6.1.2. The official Vite plugin release is non-prerelease and was published 2026-10-05; the repository's live npm freshness gate independently observed 6.1.2 as `latest`.

## Runtime/toolchain consequence

`@firebase/rules-unit-testing@5.0.2` declares Node `>=24.12.0`. Repository validation therefore uses Node 24.12.0 or newer.

## Refresh procedure

1. Research every direct package against its authoritative release source and npmjs.com immediately before the refresh.
2. Update `.tasks/dependency-refresh-request.json` with the exact stable targets.
3. Let `Refresh pinned dependencies` regenerate the lockfile and run full validation. It commits only if the live npm `latest` check and all validation gates pass.
4. The maintenance workflow explicitly dispatches the Pages workflow after its bot commit because GitHub intentionally does not recursively start push workflows from commits made with `GITHUB_TOKEN`.
5. Update this audit if any target/evidence changes.
