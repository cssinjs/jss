# Contributing

## Prerequisites

To install the development dependencies you will at least need Node 8 installed.

## Installation

We use yarn as our package manager.
This will install all dev dependencies and the dependencies in the actual packages.

```bash
yarn
```

## Building

For building all of the packages run:

```bash
yarn build
```

## Lint & Formatting & Typechecking

To lint, format and type check the project run the following commands:

```bash
yarn lint
yarn format
yarn typecheck
```

## Run tests

Using karma (real browsers will be launched).

> Notice: When you change the source files of packages, you will need to rebuild the project.

```bash
yarn test
```
