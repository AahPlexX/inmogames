# Dependency policy and current audit

**Last researched:** 2026-10-07  
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
| vite | 8.3.3 | Vite current stable line and official `release: v8.3.3` commit: https://vite.dev/releases and https://github.com/vitejs/vite/commit/fea5b21 | https://www.npmjs.com/package/vite |
| vitest | 5.0.3 | Vitest 5 stable announcement/release: https://vitest.dev/blog/vitest-5 and https://github.com/vitest-dev/vitest/releases/tag/v5.0.3 | https://www.npmjs.com/package/vitest |
| oxlint | 1.87.0 | oxc release `oxlint_v1.87.0` (stable, not a prerelease, 2026-10-05): https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.87.0 | https://www.npmjs.com/package/oxlint |
| oxlint-tsgolint | 7.0.2003 | tsgolint release `v7.0.2003` (stable, 2026-09-24): https://github.com/oxc-project/tsgolint/releases/tag/v7.0.2003 | https://www.npmjs.com/package/oxlint-tsgolint |
| fast-check | 4.10.2 | fast-check release `v4.10.2` (stable, 2026-09-19): https://github.com/dubzzz/fast-check/releases/tag/v4.10.2 | https://www.npmjs.com/package/fast-check |
| @vitest/coverage-v8 | 5.0.3 | Vitest release `v5.0.3`, the same release as vitest (peer dependency is exactly `5.0.3`): https://github.com/vitest-dev/vitest/releases/tag/v5.0.3 | https://www.npmjs.com/package/@vitest/coverage-v8 |
| @testing-library/react | 16.3.3 | React Testing Library release `v16.3.3` (stable, 2026-08-27): https://github.com/testing-library/react-testing-library/releases/tag/v16.3.3 | https://www.npmjs.com/package/@testing-library/react |
| @testing-library/dom | 10.4.2 | DOM Testing Library release `v10.4.2` (stable, 2026-09-13); required peer of @testing-library/react: https://github.com/testing-library/dom-testing-library/releases/tag/v10.4.2 | https://www.npmjs.com/package/@testing-library/dom |
| happy-dom | 20.14.5 | happy-dom release `v20.14.5` (stable, 2026-09-12): https://github.com/capricorn86/happy-dom/releases/tag/v20.14.5 | https://www.npmjs.com/package/happy-dom |
| @axe-core/playwright | 4.13.0 | axe-core-npm release `v4.13.0` (stable, 2026-08-11): https://github.com/dequelabs/axe-core-npm/releases/tag/v4.13.0 | https://www.npmjs.com/package/@axe-core/playwright |
| knip | 6.40.0 | knip release `knip@6.40.0` (stable, 2026-10-06): https://github.com/webpro-nl/knip/releases/tag/knip%406.40.0 | https://www.npmjs.com/package/knip |

The 2026-10-06 refresh was triggered by the live npm freshness gate observing Vite `8.3.3` after the repository had pinned `8.3.2`. Vite's official repository recorded `release: v8.3.3` on 2026-10-06, Vite's release policy identifies `vite@8.3` as the current regular-patch line, and npm corroborated `8.3.3` as the newly published stable package. No prerelease channel is used.

The prior 2026-10-05 refresh was triggered by the npm live `latest` tag moving `@vitejs/plugin-react` from 6.1.1 to 6.1.2. The official Vite plugin release is non-prerelease and was published 2026-10-05; the repository's live npm freshness gate independently observed 6.1.2 as `latest`.

## Runtime/toolchain consequence

`@firebase/rules-unit-testing@5.0.2` declares Node `>=24.12.0`. Repository validation therefore uses Node 24.12.0 or newer.

## Refresh procedure

1. Research every direct package against its authoritative release source and npmjs.com immediately before the refresh.
2. Update `.tasks/dependency-refresh-request.json` with the exact stable targets.
3. Let `Refresh pinned dependencies` regenerate the lockfile and run full validation. It commits only if the live npm `latest` check and all validation gates pass.
4. The maintenance workflow explicitly dispatches the Pages workflow after its bot commit because GitHub intentionally does not recursively start push workflows from commits made with `GITHUB_TOKEN`.
5. Update this audit if any target/evidence changes.

## 2026-10-07 development-tooling additions (Mergrove quality tooling)

Nine dev-only packages were added to catch broken or missing code, find untested code and verify accessibility. None ships in the production bundle. Choices were checked against peer-dependency ranges first:

- **Linting uses oxlint, not ESLint.** `typescript-eslint@8.71.1` requires `typescript <6.1.0` and `eslint-plugin-jsx-a11y@6.10.2` stops at ESLint 9, while this repository pins TypeScript 7.0.2. Using them would need forced peer overrides. `oxlint` parses TypeScript/JSX itself, includes React-hooks and jsx-a11y rules, and `oxlint-tsgolint@7.0.2003` provides type-aware rules for TypeScript 7.
- **`@vitest/coverage-v8` has a peer dependency of exactly `vitest@5.0.3`**, which matches the repository pin.
- **`happy-dom` was chosen over `jsdom`** for faster component tests; only one DOM environment is installed.
- **`@testing-library/dom` is listed explicitly** because `@testing-library/react@16` requires it as a peer.
- Authoritative evidence: each project's GitHub release page (links above), all stable and non-prerelease, corroborated against the npm `latest` tag with `npm view <pkg> dist-tags.latest` on 2026-10-07.
