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

Run all runtime tests (Vitest unit tests followed by Karma browser tests):

```bash
yarn test
```

Browser-independent unit tests run in Node with Vitest, without a browser or a build:

```bash
yarn test:unit
yarn test:unit:watch
```

Name these tests `*.node.test.js`. Import test APIs from `vitest`; do not use DOM globals or
browser-only helpers such as `tests/utils.js`. Vitest only discovers these files, and Karma
excludes them. Use Vitest's built-in `expect` for assertions; `expect.js` remains for Karma tests.

Browser tests still use Karma and launch real browsers. Rebuild packages after source changes:

```bash
yarn build
yarn test:browser
# For headless environments:
yarn test:browser --browsers ChromeHeadless
# Watch browser tests:
yarn test:watch
```

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
