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

Run all runtime tests (Vitest Node tests, Vitest JSS browser tests, then remaining Karma tests):

```bash
yarn test
```

Browser-independent unit tests run in Node with Vitest, without a browser or a build:

```bash
yarn test:unit
yarn test:unit:watch
```

Name these tests `*.node.test.js`. Import test APIs from `vitest`; do not use DOM globals or
browser-only helpers such as `tests/utils.js`. The Node Vitest configuration only discovers
these files, and Karma excludes them. Use Vitest's built-in `expect` for assertions; `expect.js` remains for Karma tests.

JSS core browser tests use Vitest Browser Mode with Playwright's real Chromium browser.
Install Chromium once, then run the tests directly against source (no build required):

```bash
yarn playwright install --with-deps chromium
yarn test:browser:jss
yarn test:browser:jss --coverage
yarn test:browser:jss:watch
```

These tests live in `packages/jss/tests/` and are named `*.browser.test.js`. Import test APIs
from `vitest`. Karma excludes these files. Coverage is written to `coverage/vitest-jss/`.

Other packages still use Karma. Rebuild packages after source changes:

```bash
yarn build
yarn test:browser:karma
# For headless environments:
yarn test:browser:karma --browsers ChromeHeadless
# Watch remaining Karma tests:
yarn test:watch
```

`yarn test:browser` runs both browser suites. Pass runner-specific flags to the individual
commands above.

TypeScript/Flow checks, bundle-size snapshots, benchmarks, and packaged-consumer smoke tests
remain separate from Vitest.

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
