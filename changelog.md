## Next

### Improvements

- [jss] Simplify cloneStyle function ([#1003](https://github.com/cssinjs/jss/pull/1003))
- [internal] Improve publish script for creating github release ([#999](https://github.com/cssinjs/jss/pull/999))
- [react-jss] Warn about themed styles misuse ([#1006](https://github.com/cssinjs/jss/pull/1006))

### Bug fixes

- [jss-starter-kit] Fix react-jss exports and add missing jss exports ([#1001](https://github.com/cssinjs/jss/pull/1001))

## 10.0.0-alpha.9 (2019-1-25)

### Bug fixes

- [all] Move jss dependencies to normal dependencies instead of peer and dev dependencies ([#993](https://github.com/cssinjs/jss/pull/993))
- [internal] Upgrade lerna ([#992](https://github.com/cssinjs/jss/pull/992))
- [react-jss] Move @types/react to dev dependencies ([#990](https://github.com/cssinjs/jss/pull/990))
- [react-jss] Upgrade theming package to v3.0.3 ([#994](https://github.com/cssinjs/jss/pull/994))
- [docs] Fix demo links for jss-plugin-extend ([#992](https://github.com/cssinjs/jss/pull/992))

### Improvements

- [internal] Add script for building readme for packages ([#996](https://github.com/cssinjs/jss/pull/996))

## 10.0.0-alpha.8 (2018-1-17)

### Bug fixes

- [all] Fix npm repo urls ([#983](https://github.com/cssinjs/jss/pull/983))
- [jss] Declare ES classes as TypeScript classes instead of interfaces ([#971](https://github.com/cssinjs/jss/pull/971))

### Improvements

- [all] Remove warning from production ([#980](https://github.com/cssinjs/jss/pull/980))

### Breaking changes

- [react-jss] Move JssContext to new React Context, deprecate the `sheetOptions` prop on the JssProvider and support a `media` prop ([#924](https://github.com/cssinjs/jss/pull/924))
- [react-jss] Remove inject option ([#934](https://github.com/cssinjs/jss/pull/934))
- [react-jss] Extend classes instead of overwriting theme ([#946](https://github.com/cssinjs/jss/pull/946))
- [react-jss] Add forwardRef support ([#943](https://github.com/cssinjs/jss/pull/943))
- [react-jss] Upgrade to theming version 3 ([#942](https://github.com/cssinjs/jss/pull/942))

## 10.0.0-alpha.7 (2019-1-3)

### Bug fixes

- [jss] Fix IE 11 injection order

## 10.0.0-alpha.6 (2019-1-1)

Republish of alpha 5 with properly building the code.

## 10.0.0-alpha.5 (2018-12-31)

### Bug fixes

- [jss] Fix warning dependency

## 10.0.0-alpha.4 (2018-12-31)

### Bug fixes

- [all] Fix peer dependencies warnings ([#957](https://github.com/cssinjs/jss/pull/957))

### Improvements

- [all] Use smaller version of the warning package ([#953](https://github.com/cssinjs/jss/pull/953))
- [all] Improve documentation ([#958](https://github.com/cssinjs/jss/pull/958))
- [internal] Upgrade lerna ([#962](https://github.com/cssinjs/jss/pull/962))

## 10.0.0-alpha.3 (2018-12-26)

## Bug fixes

- [all] Fix building packages

## 10.0.0-alpha.2 (2018-12-26)

## Bug fixes

- [internal] Fix changelog.md

## 10.0.0-alpha.1 (2018-12-26)

### Bug fixes

- [jss] Fix class name white space escaping in dev mode ([938](https://github.com/cssinjs/jss/issues/938))
- [jss] Fix multiple cases where linking CSS rules didn't work ([#815](https://github.com/cssinjs/jss/pull/815), [#710](https://github.com/cssinjs/jss/pull/710), [#664](https://github.com/cssinjs/jss/pull/664))
- [jss] Fix sheet ordering when the last sheet was the last sibling in the head element ([#819](https://github.com/cssinjs/jss/pull/819))
- [jss-plugin-syntax-nested] Fix referencing rules inside media queries ([#900](https://github.com/cssinjs/jss/pull/900))
- [jss-plugin-syntax-global] Fix TypeError: Cannot read property '@global' of undefined ([#905](https://github.com/cssinjs/jss/pull/905))

### Improvements

- [jss-starter-kit] Introduce `jss-starter-kit.bundle.js`, which packages all the other libraries into one import for playgrounds like Codepen. ([#936](https://github.com/cssinjs/jss/pull/936))
- [jss] Add support for Typed CSSOM values ([#882](https://github.com/cssinjs/jss/pull/882))
- [jss] Function values and function rules support now fallbacks, media queries, nesting, global styles ([#682](https://github.com/cssinjs/jss/pull/682))
- [react-jss] Remove old lifecycle hooks ([#834](https://github.com/cssinjs/jss/pull/834))
- [react-jss] Add flow types ([#818](https://github.com/cssinjs/jss/pull/818))
- [all] Migrate to a monorepo using yarn workspaces and lerna ([#729](https://github.com/cssinjs/jss/pull/729))
- [all] Add TypeScript definitions to all packages ([#889](https://github.com/cssinjs/jss/pull/889))

### Breaking changes

- [jss] Observables, function values and rules are now standalone packages, not part of the core. They are still part of the default preset though.
- [jss] Function values, rules and observables apply plugins by default now, which means they can support all plugin defined syntaxes, but they are also slower by default. To speed them up use `sheet.update(data, {process: false})` for fn values/rules and `jss.use(pluginObservable({process: false}))` when setting up observables plugin. ([#682](https://github.com/cssinjs/jss/pull/682))
- [jss] Rule @keyframes has now scoped name by default, which means that you can access it using `$ref` from the same sheet and generate global one as before using `@global` rule ([#346](https://github.com/cssinjs/jss/pull/346)).
- [jss] Add scoped keyframes support ([#346](https://github.com/cssinjs/jss/pull/346))
- [jss|react-jss] Options `createGenerateClassName` and `generateClassName` are renamed to `createGenerateId` and `generateId` because the same function is now used to scope @keyframes rules.
- [react-jss] Drop support for older React versions, require v16.3 or higher ([#868](https://github.com/cssinjs/jss/pull/868), [#851](https://github.com/cssinjs/jss/pull/851))

## Pre v10 changelogs

- [jss](https://github.com/cssinjs/jss/blob/55af128963eaa50de906a0d3781e7c1ce04336a2/changelog.md)
- [jss-plugin-cache](https://github.com/cssinjs/jss-cache/blob/master/changelog.md)
- [jss-plugin-isolate](https://github.com/cssinjs/jss-isolate/blob/master/changelog.md)
- [jss-plugin-props-sort](https://github.com/cssinjs/jss-props-sort/blob/master/changelog.md)
- [jss-plugin-camel-case](https://github.com/cssinjs/jss-camel-case/blob/master/changelog.md)
- [jss-plugin-compose](https://github.com/cssinjs/jss-compose/blob/master/changelog.md)
- [jss-plugin-default-unit](https://github.com/cssinjs/jss-default-unit/blob/master/changelog.md)
- [jss-plugin-expand](https://github.com/cssinjs/jss-expand/blob/master/changelog.md)
- [jss-plugin-extend](https://github.com/cssinjs/jss-extend/blob/master/changelog.md)
- [jss-plugin-global](https://github.com/cssinjs/jss-global/blob/master/changelog.md)
- [jss-plugin-nested](https://github.com/cssinjs/jss-nested/blob/master/changelog.md)
- [jss-plugin-template](https://github.com/cssinjs/jss-template/blob/master/changelog.md)
- [jss-plugin-vendor-prefixer](https://github.com/cssinjs/jss-vendor-prefixer/blob/master/changelog.md)
- [jss-preset-default](https://github.com/cssinjs/jss-preset-default/blob/master/changelog.md)
- [react-jss](./docs/react-jss.md/blob/master/changelog.md)
