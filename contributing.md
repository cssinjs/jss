# Contributing

## Want to contribute but got stuck?

Please reach out on [Discord](https://discord.gg/e79XhqmaDH)

## Prerequisites

Use the Node version specified in `.nvmrc` (Node 24) to install dependencies and run tests.

## Installation

We use pnpm 12.18.0 as pinned in `package.json`. With Node 24 active, install it with
`npm install --global pnpm@12.18.0`.
It will install all dev dependencies and link the packages in the workspace.

```bash
pnpm install --frozen-lockfile
```

## Building

For building all of the packages run:

```bash
pnpm build
```

The shared `rolldown.config.mjs` preserves each package's CommonJS, ESM, development and
production UMD, and standalone ESM entry points. The source Babel pass only guards
development warnings. Flow declarations are separate from the runtime module graph and
need no stripping. Rolldown handles classic React JSX and loose class fields;
Babel lowers the bundled implementation and generated runtime to ES5, including a final
pass after minification. Object spread/rest stays in the loose Babel output pass to retain
its existing semantics without introducing Oxc runtime imports. Handwritten TypeScript
declarations remain in `src/`.

## Lint & Formatting & Typechecking

To lint, format, and type check the project run the following commands:

```bash
pnpm check:lint
pnpm format
pnpm check:ts
```

## Run tests

Run all runtime tests (Vitest Node and browser tests):

```bash
pnpm test
```

Browser-independent unit tests run in Node with Vitest, without a browser or a build:

```bash
pnpm test:unit
```

Name these tests `*.node.test.js`. Import test APIs from `vitest`; do not use DOM globals or
browser-only helpers such as `tests/utils.js`. The Node Vitest configuration only discovers
these files. Use Vitest's built-in `expect` for assertions.

All browser tests, including React-JSS and CSS-JSS, use Vitest Browser Mode with Playwright's real Chromium browser.
Install Chromium once, then run the tests directly against source (no build required):

```bash
pnpm exec playwright install --with-deps chromium
pnpm test:browser
pnpm test:browser --coverage
# Optionally filter by path:
pnpm test:browser packages/jss/tests/
```

All `packages/**/*.browser.test.js` files run together in one Vitest run. Name migrated browser
tests `*.browser.test.js` to include them automatically. Import test APIs and assertions from
`vitest`, and use `vi.spyOn` for spies. Coverage is written to `coverage/vitest-browser/`.
The `test:browser:vitest` script remains an alias for `test:browser`.

Benchmarks also run in Chromium with Vitest. Name them `*.bench.js` under a package's
`benchmark/` directory and import `bench` and `describe` from `vitest`:

```bash
pnpm test:bench
# Optionally filter by path:
pnpm test:bench packages/jss/benchmark/tests/add-rule.bench.js
```

Benchmark hooks use closures for state, not Benchmark.js's `this`. Use `setup`/`teardown`
options for per-task setup/cleanup.
Benchmarks run separately from `pnpm test` and are not performance gates in CI.

TypeScript/Flow checks, bundle-size budgets, and packaged-consumer smoke tests remain separate
from Vitest.

## Bundle size

Build all packages and check their size budgets:

```bash
pnpm size
```

If the packages are already built, run `pnpm exec size-limit` directly. CI builds once before
`pnpm check:all`, which includes Size Limit without rebuilding.

The root `.size-limit.js` defines a separate gzip budget for every published production UMD
artifact, measured without rebundling. Additional consumer checks bundle and tree-shake the
built ESM entry points for JSS core, JSS with the default preset, and React-JSS's
`createUseStyles`. Consumer checks include runtime dependencies, excluding React as a peer.
The default-preset consumer fixture lives in `scripts/size/default-preset.js`.

Initial budgets use fresh measurements plus 10% headroom, rounded up to 10 bytes. These are
ceilings, not exact snapshots: smaller bundles pass without updating anything, and builds
never rewrite budgets. If a check fails, investigate the added code or dependencies first.
For intentional growth, update only the affected budget in `.size-limit.js` and explain the
size increase in the pull request. Do not automatically regenerate budgets during releases.

## Releases

See [the release guide](docs/releases.md) for local version preparation and a human-reviewed
PR, followed by GitHub Actions publishing, npm trusted publishing setup, approval, and recovery.
Releases are no longer published from a maintainer's machine.

## IDEs

If you are using VS Code, you'll need to do 2 things to get Flow type support:

1. Install the [Flow Language Support extension](https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode).
2. If necessary, update your _local_ settings to disable JS file validation:

```JSON
// <PROJECT_ROOT>/.vscode/settings.json
{
  "javascript.validate.enable": false
}
```
