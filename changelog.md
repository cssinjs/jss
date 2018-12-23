## Next / 2018-12-18

- [jss-starter-kit] Introduced `jss-starter-kit.bundle.js`, which packages all the other libraries into one import for playgrounds like Codepen. ([#936](https://github.com/cssinjs/jss/pull/936))
- [jss] Fix multiple cases where linking CSS rules didn't work ([#815](https://github.com/cssinjs/jss/pull/815), [#710](https://github.com/cssinjs/jss/pull/710), [#664](https://github.com/cssinjs/jss/pull/664))
- [jss] Added support for Typed CSSOM values ([#882](https://github.com/cssinjs/jss/pull/882))
- [jss] Added scoped keyframes support ([#346](https://github.com/cssinjs/jss/pull/346))
- [jss] Function values and function rules support now fallbacks, media queries, nesting, global styles ([#682](https://github.com/cssinjs/jss/pull/682))
- [react-jss] Remove old lifecycle hooks ([#834](https://github.com/cssinjs/jss/pull/834))
- [react-jss] Added flow types ([#818](https://github.com/cssinjs/jss/pull/818))
- [jss] Fix sheet ordering when the last sheet was the last sibling in the head element ([#819](https://github.com/cssinjs/jss/pull/819))
- [jss] Migrated to a monorepo structure ([#729](https://github.com/cssinjs/jss/pull/729))
- [all] Added TypeScript definitions to all packages ([#889](https://github.com/cssinjs/jss/pull/889))
- [jss-plugin-nested] Fixed referencing rules inside media queries ([#900](https://github.com/cssinjs/jss/pull/900))
- [jss-plugin-global] TypeError: Cannot read property '@global' of undefined ([#905](https://github.com/cssinjs/jss/pull/905))

### Breaking changes

- [jss] Observables, function values and rules are now standalone packages, not part of the core. They are still part of the default preset though.
- [jss] Function values, rules and observables apply plugins by default now, which means they can support all plugin defined syntaxes, but they are also slower by default. To speed them up use `sheet.update(data, {process: false})` for fn values/rules and `jss.use(pluginObservable({process: false}))` when setting up observables plugin. ([#682](https://github.com/cssinjs/jss/pull/682))
- [jss] Rule @keyframes has now scoped name by default, which means that you can access it using `$ref` from the same sheet and generate global one as before using `@global` rule ([#346](https://github.com/cssinjs/jss/pull/346)).
- [jss] Options `createGenerateClassName` and `generateClassName` are renamed to `createGenerateId` and `generateId` since the same function is now used to scope @keyframes rules. This affects both JSS and React-JSS.
- [react-jss] Drop support for React 0.13 and 0.14 ([#868](https://github.com/cssinjs/jss/pull/868), [#851](https://github.com/cssinjs/jss/pull/851))

## Old changelogs

You can find all of the old changelogs here:

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
- [react-jss](https://github.com/cssinjs/react-jss/blob/master/changelog.md)
