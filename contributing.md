# Contributing

## Want to contribute but got stuck?

Please reach out on [Discord](https://discord.gg/e79XhqmaDH)

## Prerequisites

Use the Node version specified in `.nvmrc` (Node 24) to install dependencies and run tests.

## Installation

We use Yarn as our package manager.
It will install all dev dependencies and the dependencies in the actual packages.

```bash
yarn
```

## Building

For building all of the packages run:

```bash
yarn build
```

## Lint & Formatting & Typechecking

To lint, format, and type check the project run the following commands:

```bash
yarn check:lint
yarn format
yarn check:ts
```

## Run tests

Run all runtime tests (Vitest Node and browser tests):

```bash
yarn test
```

Browser-independent unit tests run in Node with Vitest, without a browser or a build:

```bash
yarn test:unit
```

Name these tests `*.node.test.js`. Import test APIs from `vitest`; do not use DOM globals or
browser-only helpers such as `tests/utils.js`. The Node Vitest configuration only discovers
these files. Use Vitest's built-in `expect` for assertions.

All browser tests, including React-JSS and CSS-JSS, use Vitest Browser Mode with Playwright's real Chromium browser.
Install Chromium once, then run the tests directly against source (no build required):

```bash
yarn playwright install --with-deps chromium
yarn test:browser
yarn test:browser --coverage
# Optionally filter by path:
yarn test:browser packages/jss/tests/
```

All `packages/**/*.browser.test.js` files run together in one Vitest run. Name migrated browser
tests `*.browser.test.js` to include them automatically. Import test APIs and assertions from
`vitest`, and use `vi.spyOn` for spies. Coverage is written to `coverage/vitest-browser/`.
The `test:browser:vitest` script remains an alias for `test:browser`.

Benchmarks also run in Chromium with Vitest. Name them `*.bench.js` under a package's
`benchmark/` directory and import `bench` and `describe` from `vitest`:

```bash
yarn test:bench
# Optionally filter by path:
yarn test:bench packages/jss/benchmark/tests/add-rule.bench.js
```

Benchmark hooks use closures for state, not Benchmark.js's `this`. Use `setup`/`teardown`
options for per-task setup/cleanup.
Benchmarks run separately from `yarn test` and are not performance gates in CI.

TypeScript/Flow checks, bundle-size snapshots, and packaged-consumer smoke tests remain separate
from Vitest.

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
