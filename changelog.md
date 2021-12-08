Since you are interested in what happens next, in case, you work for a for-profit company that benefits from using the project, please consider supporting it on https://opencollective.com/jss.

## Next (version and date will be generated, add changes below)

### Bug fixes

- [jss, jss-plugin-global, jss-plugin-nested, jss-plugin-rule-value-function] Fixes a memory leak with nested function rules [1574](https://github.com/cssinjs/jss/pull/1574)

### Improvements

- Keep classes ref when sheet and dynamicRules have not any change [1573](https://github.com/cssinjs/jss/pull/1573)

## 10.8.2 (2021-10-25)

### Bug fixes

- Reverting [1563](https://github.com/cssinjs/jss/pull/1563) because of regression [1565](https://github.com/cssinjs/jss/issues/1565)

## 10.8.1 (2021-10-16)

### Bug fixes

- [jss, jss-plugin-global, jss-plugin-nested, jss-plugin-rule-value-function] Fixes a memory leak with nested function rules [1563](https://github.com/cssinjs/jss/pull/1563)

## 10.8.0 (2021-9-18)

### Improvements

- [jss] New option to remove whitespaces. Useful for SSR [1549](https://github.com/cssinjs/jss/pull/1549)

- [all] Flow types are now moved from .js files to .flow type defs [1509](https://github.com/cssinjs/jss/pull/1509)

- [all] Upgrade typescript to 4.4.2 [1550](https://github.com/cssinjs/jss/pull/1550)

## 10.7.1 (2021-6-28)

### Bug fixes

- [jss] Fixes regression from previous release where useStyles() without arguments would throw an error

## 10.7.0 (2021-6-27)

### Improvements

- [jss][ts] Improved style type [1521](https://github.com/cssinjs/jss/pull/1521)
- [react-jss] Refactored JssProvider to function component [1513](https://github.com/cssinjs/jss/pull/1513)
- [react-jss] Refactored WithStyles to function component [1508](https://github.com/cssinjs/jss/pull/1508)

## 10.6.0 (2021-3-14)

### Improvements

- [*] Define specific polyfills for specific packages that will be required and define a policy for adding polyfills. Makes sure we will notice if a polyfill is needed in a supported browser by failing the CI. [1456](https://github.com/cssinjs/jss/issues/1456)
- [jss] Use `globalThis` to support secure version of JavaScript called SES [1449](https://github.com/cssinjs/jss/pull/1449)
- [jss][ts] `Styles` now supports `ClassNames`, `Props`/`Data`, and `Theme` as type parameters (eg. `Styles<Names, Data, Theme>`). [1460](https://github.com/cssinjs/jss/pull/1460)
- [react-jss][ts] `withStyles` and `createUseStyles` now support `ClassNames`, `Props`, and `Theme` as type parameters (eg. `createUseStyles<Names, Props, Theme>`). [1460](https://github.com/cssinjs/jss/pull/1460)
- [react-jss][ts] `useStyles` finally expects the correct argument type: a `Props` object with an optional `Theme` property (both determined from `createUseStyles`). [1460](https://github.com/cssinjs/jss/pull/1460)
- [react-jss][ts] Support global TS theme definition [1453](https://github.com/cssinjs/jss/pull/1453)
- [react-jss][ts] Allow partial `classes` prop in `withStyles()` [1428](https://github.com/cssinjs/jss/issues/1428)

### Breaking Changes

- [react-jss][ts] `Theme` is no longer the first generic type parameter for `createUseStyles`. [1460](https://github.com/cssinjs/jss/pull/1460)
  - There are two main ways to tell TS your `Theme`'s type without reaching over the other type parameters:

Using the function argument.

```typescript
const useStyles = createUseStyles(theme: Theme => ({
  ruleName: { /* ... */ };
}))
```

Using the object argument with a function. (You will only need to specify the `Theme` type once.)

```typescript
const useStyles = createUseStyles({
  ruleName: ({theme}: {theme: Theme}) => ({
    /* ... */
  })
})
```

## 10.5.1 (2021-1-23)

### Bug fixes

- [jss-plugin-default-unit] Fix crash in Chrome 88 when NaN is used by the user [1446](https://github.com/cssinjs/jss/pull/1446)
- [jss][ts] Fix intellisense suggestions [1423](https://github.com/cssinjs/jss/pull/1423)

### Improvements

- [jss-plugin-default-unit] Add px as default unit for text-decoration-thickness [1438](https://github.com/cssinjs/jss/pull/1438)
- [jss-plugin-default-unit] Add px as default unit for row-gap [1436](https://github.com/cssinjs/jss/pull/1436)
- [*] Allow project to be in a directory that contains spaces [1433](https://github.com/cssinjs/jss/pull/1433)

## 10.5.0 (2020-11-15)

### Bug fixes

- [jss][ts] Restore support for Observable styles [1402](https://github.com/cssinjs/jss/pull/1402)
- [jss-plugin-default-unit] Fix missing default unit for 0ms and 0% [1413](https://github.com/cssinjs/jss/pull/1413)

### Improvements

- [*] Improve docs [1384](https://github.com/cssinjs/jss/pull/1384), [1387](https://github.com/cssinjs/jss/pull/1387), [1391](https://github.com/cssinjs/jss/pull/1391),
- [*] Remove test files from the package [1406](https://github.com/cssinjs/jss/pull/1406)
- [*] Upgrade rollup [1426](https://github.com/cssinjs/jss/pull/1426)
- [*] Upgrade flow to 0.138.0 [1425](https://github.com/cssinjs/jss/pull/1425)
- [jss-plugin-default-unit] Add gap unit [1403](https://github.com/cssinjs/jss/pull/1403)
- [jss-plugin-default-unit] Add default units to logical properties [1415](https://github.com/cssinjs/jss/pull/1415)
- [jss] Improve `deleteRule()` performance [1424](https://github.com/cssinjs/jss/pull/1424)

## 10.4.0 (2020-8-14)

### Bug fixes

- [jss-plugin-extend] Fix can not extend rule name is array [1357](https://github.com/cssinjs/jss/pull/1357)
- [*] Fix yarn build for windows [1376](https://github.com/cssinjs/jss/pull/1376)

### Improvements

- [jss][ts] Bump `csstype` to 3.0.2 [1379](https://github.com/cssinjs/jss/pull/1379)
- [react-jss][ts] TS support for innerRef prop [1355](https://github.com/cssinjs/jss/pull/1355)
- [react-jss][ts] TS fix theme types [1349](https://github.com/cssinjs/jss/pull/1349)
- [react-jss][ts] Add properly react default props types calculation [1353](https://github.com/cssinjs/jss/pull/1353)
- [react-jss] Upgrade Theming to 3.3.0 [1382](https://github.com/cssinjs/jss/pull/1382)
- [*] Upgrade flowtype to 0.131.0 [1382](https://github.com/cssinjs/jss/pull/1382)

## 10.3.0 (2020-6-10)

### Improvements

- [jss, react-jss][ts] ts fixes, allow autocomplete for CSS rules [1352](https://github.com/cssinjs/jss/pull/1352)

## 10.2.0 (2020-6-3)

### Improvements

- [react-jss][ts] ts fixes [1310](https://github.com/cssinjs/jss/pull/1310)
- [jss][ts] ts fixes [1318](https://github.com/cssinjs/jss/pull/1318)
- [examples] Convert plugin examples to codesandbox [1316](https://github.com/cssinjs/jss/pull/1316)

### Bug fixes

- [jss-plugin-rule-value-function] Fixed missing dependency to tiny-warning [1315](https://github.com/cssinjs/jss/pull/1315)
- [jss-plugin-vendor-prefixer] Correct prefixing of writing-mode property [1326](https://github.com/cssinjs/jss/pull/1326)

## 10.1.1 (2020-3-15)

### Bug fixes

- [jss, react-jss] revert `getDynamicStyles` migration introduced in 10.1.0

## 10.1.0 (2020-3-15)

### Bug fixes

- [jss] Fix multiple .addRule calls with font-face ([1280](https://github.com/cssinjs/jss/pull/1280))
- [jss] Allow a Comment node as insertion point ([1284](https://github.com/cssinjs/jss/pull/1284))

### Improvements

- [jss-plugin-rule-value-function] Add warning when using a function value inside a function rule ([1285](https://github.com/cssinjs/jss/pull/1285))
- [react-jss][ts] Typescript support for createUseStyles theme ([1294](https://github.com/cssinjs/jss/pull/1294))
- [jss, react-jss] - `getDynamicStyles` utility function was originally exposed from `jss` package, but I don't think it was used externally, so I moved it to `react-jss` package and made it internal. If you have been using it as public API let me know, we will have to revert the change.
- [examples] Migrate examples to monorepo ([1306](https://github.com/cssinjs/jss/pull/1306))

### Features

- [jss-plugin-default-unit] Allow options to pass function transforms in ([1292](https://github.com/cssinjs/jss/pull/1292))

## 10.0.4 (2020-1-28)

### Bug fixes

- [react-jss] Add type alias for `WithStyles` ([1254](https://github.com/cssinjs/jss/pull/1254))
- [react-jss] Fix ts typings for hook, created common interface for options ([1266](https://github.com/cssinjs/jss/pull/1266))
- [react-jss] Revert strict style types for ts, since it's a breaking change and needs much more work done upfront ([1270](https://github.com/cssinjs/jss/pull/1270))

### Improvements

- [css-jss][ts] Add TS type definitions ([1247](https://github.com/cssinjs/jss/pull/1247))
- [react-jss] Accept options.generateId in useStyles() and withStyles() as an option ([1263](https://github.com/cssinjs/jss/pull/1263))

## 10.0.3 (2020-1-1)

### Improvements

- [jss] Improve `JssStyle` definition ([1218](https://github.com/cssinjs/jss/pull/1218))
- [react-jss] Improve `createUseStyles` definition ([1218](https://github.com/cssinjs/jss/pull/1218))

### Bug fixes

- [jss] Fix `create` definitions to allow `minify: boolean` ([1218](https://github.com/cssinjs/jss/pull/1218))
- [jss][ts] Fix `Name` Typescript constraint ([1218](https://github.com/cssinjs/jss/pull/1218))

## 10.0.2 (2019-12-30)

### Bug fixes

- [jss] Fix breaking change that was introduced in `10.0.1` ([1252](https://github.com/cssinjs/jss/pull/1252))

## 10.0.1 (2019-12-28)

### Bug fixes

- [jss-plugin-vendor-prefixer] Upgrade css-vendor package to v2.0.7 ([1208](https://github.com/cssinjs/jss/pull/1208))
- [jss] Fix `sheet.addRule()` support for duplicate rule names ([1242](https://github.com/cssinjs/jss/pull/1242))
- [react-jss] Fix function values support inside of nested media queries when component is a list item ([1242](https://github.com/cssinjs/jss/pull/1242))

## 10.0.0 (2019-9-22)

### Summary

A higher level overview of v10 release.

- [react-jss] A new hooks-based API has been released and became the new default way to use JSS with React.
- [jss] Keyframe IDs are now scoped by default.
- [jss] Function values, function rules and observables apply plugins by default now, which means they can support all kinds of syntaxes: e.g. fallbacks, media queries, nesting, global styles.
- [jss] Houdini Typed CSSOM Values are supported now.
- [all] Each package supports ESM modules import, also possible directly from https://unpkg.com/.
- [all][ts] Added TS type definitions to this repository.

For more details please read the rest of the changelog.

## 10.0.0-alpha.27 (2019-9-22)

### Bug fixes

- [react-jss] Add fallback for `Number.MIN_SAFE_INTEGER`, because not supported by IE <= 11 ([1197](https://github.com/cssinjs/jss/pull/1197))
- [jss-plugin-vendor-prefixer] Fix `fallbacks` syntax support regression ([1198](https://github.com/cssinjs/jss/pull/1198))

## 10.0.0-alpha.26 (2019-9-22)

### Bug fixes

- [jss] Fix dynamic rule updating after sheet re-attach in IE ([1194](https://github.com/cssinjs/jss/pull/1194))
- [ci] Fix browsers.json, bump suported ios Safari to 10.3.

## 10.0.0-alpha.25 (2019-9-16)

### Bug fixes

- [jss] Fix dynamic rule updating after sheet re-attach ([1190](https://github.com/cssinjs/jss/pull/1190))

### Improvements

- [jss-plugin-nested] Better warning text ([1170](https://github.com/cssinjs/jss/pull/1170))

## 10.0.0-alpha.24 (2019-8-13)

### Bug fixes

- [react-jss] Fix nested dynamic rule updating ([1144](https://github.com/cssinjs/jss/pull/1144))
- [jss] Support falsy value from fn rule ([1164](https://github.com/cssinjs/jss/pull/1164))

### Improvements

- [react-jss][ts] Improve TS definitions and add missing definition for `createUseStyles` ([1155](https://github.com/cssinjs/jss/pull/1155))
- [jss-plugin-default-unit] Consistent usage of the CSS browser API ([1168](https://github.com/cssinjs/jss/pull/1168))

## 10.0.0-alpha.23 (2019-7-20)

### Bug fixes

- [react-jss] Update dynamic nested rules need ([#1144](https://github.com/cssinjs/jss/pull/1144))
- [react-jss] withStyles shouldn't attach() on SSR ([#1149](https://github.com/cssinjs/jss/pull/1149), [#1157](https://github.com/cssinjs/jss/pull/1157))

### Improvements

- [jss] Improve treeshaking for webpack by not using `global`. ([#1153](https://github.com/cssinjs/jss/pull/1153))

## 10.0.0-alpha.22 (2019-7-2)

### Breaking Changes

- [jss] SheetsRegistry.toString(options) will now return all sheets by default, no matter detached or attached. You can specify which one you want by using the option `registry.toString({attached: true})` ([1140](https://github.com/cssinjs/jss/pull/1140))

### Bug fixes

- [react-jss] SSR for the hooks based API will now work with the registry as expected ([1140](https://github.com/cssinjs/jss/pull/1140))
- [react-jss] When id options passed to JssProvider, we need to create a new `generateId` function ([#1147](https://github.com/cssinjs/jss/pull/1147))

### Improvements

- [react-jss] Document `id` prop for JssProvider, add "Class name generator options" to the docs. ([#1147](https://github.com/cssinjs/jss/pull/1147))
- [react-jss] Use component name or displayName as a class name prefix also in production by default ([#1147](https://github.com/cssinjs/jss/pull/1147))

## 10.0.0-alpha.21 (2019-6-22)

### Bug fixes

- [jss-plugin-vendor-prefixer] Upgrade css-vendor package to v2.0.5 ([#1142](https://github.com/cssinjs/jss/pull/1142))
- [css-jss] Slows down in benchmark after 10k rules ([#1137](https://github.com/cssinjs/jss/pull/1137))

## 10.0.0-alpha.20 (2019-6-17)

### Bug Fixes

- [react-jss] Experimental styled API got some fixes and many more tests ([#1118](https://github.com/cssinjs/jss/pull/1118))

## 10.0.0-alpha.18 (2019-6-14)

### Features

- [react-jss] New experimental styled API (undocumented intentionally)([#1094](https://github.com/cssinjs/jss/pull/1094))
- [react-jss] JSX pragma for css prop (undocumented intentionally)([#1130](https://github.com/cssinjs/jss/pull/1130))
- [css-jss] New experimental css() API (undocumented intentionally)([#1129](https://github.com/cssinjs/jss/pull/1129))

### Bug fixes

- [jss] After attempting to insert an invalid rule, JSS is now able to insert a valid one ([#1123](https://github.com/cssinjs/jss/pull/1123))
- [react-jss][ts] Fix type optional `theming` property ([#1121](https://github.com/cssinjs/jss/pull/1121))
- [react-jss][ts] Export useTheme in TS declaration ([#1124](https://github.com/cssinjs/jss/pull/1124))

## 10.0.0-alpha.17 (2019-6-7)

### Features

- [react-jss] New hooks based API is out. HOC based API is deprecated. It will stay in v10 but will be removed in v11. ([#1089](https://github.com/cssinjs/jss/pull/1089))

### Breaking Changes

- [jss] Add option for opt-in minification of class names. ([#1075](https://github.com/cssinjs/jss/pull/1075))

### Bug fixes

- [jss-plugin-expand] Fix attributes spread for `border-bottom`, `border-top`, `border-left` and `border-right` ([#1083](https://github.com/cssinjs/jss/pull/1083))
- [jss-plugin-props-sort] Fix sorting in Node 11 ([#1084](https://github.com/cssinjs/jss/pull/1083))
- [jss] Fix escaping keyframes names ([#1100](https://github.com/cssinjs/jss/pull/1100))

## 10.0.0-alpha.16 (2019-3-24)

### Bug fixes

- [jss-plugin-camel-case] Fix some IE 11 regression ([#1065](https://github.com/cssinjs/jss/pull/1065))
- [jss-vendor-prefixer] Fix value prefixing, in particular `position: sticky` ([#1068](https://github.com/cssinjs/jss/pull/1068))

## 10.0.0-alpha.14 (2019-3-17)

### Improvements

- [jss] Add support for multiple referenced keyframes ([#1063](https://github.com/cssinjs/jss/pull/1063))

### Bug fixes

- [jss] Fix SSR aggregation regression ([#1064](https://github.com/cssinjs/jss/pull/1064))

## 10.0.0-alpha.13 (2019-3-12)

### Bug fixes

- [react-jss] Replace spaces inside the display name with hyphens ([#1049](https://github.com/cssinjs/jss/pull/1049))

### Improvements

- [jss] Remove VirtualRenderer and the option `virtual: true`. Now to simulate a non-browser environment, pass `create({Renderer: null})` when creating a Jss instance.
- [react-jss] Add dynamic rules to the static sheet ([#1048](https://github.com/cssinjs/jss/pull/1048))

## 10.0.0-alpha.12 (2019-2-27)

### Bug fixes

- [jss] Fix using function values with scoped keyframes ([#1043](https://github.com/cssinjs/jss/pull/1043))
- [jss] Fix removing styles from function rules ([#1046](https://github.com/cssinjs/jss/pull/1046))

## 10.0.0-alpha.11 (2019-2-24)

### Bug fixes

- [jss] Fix dynamic values inside of @global plugin ([#664](https://github.com/cssinjs/jss/pull/664))

### Improvements

- [all] All packages except of react-jss can now be used as ESM modules directly from unpkg.com ([1029](https://github.com/cssinjs/jss/pull/1029))
- [jss][ts] Improve typings ([#973](https://github.com/cssinjs/jss/pull/973))

## 10.0.0-alpha.10 (2019-2-9)

### Improvements

- [jss] Simplify cloneStyle function ([#1003](https://github.com/cssinjs/jss/pull/1003))
- [jss] Use WeakMap inside SheetsManager ([#1019](https://github.com/cssinjs/jss/pull/1019))
- [internal] Improve publish script for creating github release ([#999](https://github.com/cssinjs/jss/pull/999))
- [react-jss] Warn about themed styles misuse ([#1006](https://github.com/cssinjs/jss/pull/1006))

### Bug fixes

- [jss-starter-kit] Fix react-jss exports and add missing jss exports ([#1001](https://github.com/cssinjs/jss/pull/1001))
- [jss-plugin-camel-case] Fix hyphenating css variables ([#1017](https://github.com/cssinjs/jss/pull/1017))

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
- [jss][ts] Declare ES classes as TS classes instead of interfaces ([#971](https://github.com/cssinjs/jss/pull/971))

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
- [all][ts] Add TS definitions to all packages ([#889](https://github.com/cssinjs/jss/pull/889))

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
