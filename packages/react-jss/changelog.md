## 8.6.1 / 2018-07-06

- Fixed empty rules generated when dynamic styles are used (#267)

## 8.6.0 / 2018-06-26

- Added `disableStylesGeneration` prop to the provider (#167)

## 8.5.1 / 2018-06-12

- Remove `forwardRef` support (#255)

## 8.5.0 / 2018-06-07

- Added `forwardRef` support.
- Updated hoist-non-react-statics to 2.5.0

## 8.4.0 / 2018-03-31

- Added `innerRef` prop to access the inner element.

## 8.3.5 / 2018-03-13

- Update package-lock.json

## 8.3.4 / 2018-03-13

- Allow updating Jss instance of JssProvider
- Update JSS dependency to v9.7.0

## 8.3.3 / 2018-02-12

- Add docs about fn values and rules

## 8.3.2 / 2018-02-12

- Add files to package.json

## 8.3.1 / 2018-02-12

- Fix function rules

## 8.3.0 / 2018-02-08

- Update default preset to v4.3.0

## 8.2.1 / 2018-01-03

- Production mode for defaultClassNamePrefix (#191).

## 8.2.0 / 2017-12-19

- Upgrade theming

## 8.1.0 / 2017-11-14

- Upgrade to JSS 9.3.2

## 8.0.0 / 2017-11-11

- Upgrade to JSS 9.
- Support React 16 (#162)
- Fixed manager leaking to next request on SSR (#133).
- Pass component name as a classNamePrefix (#133).
- Added classNamePrefix prop to JssProvider for better multi-tree support (#133).
- Allowed nesting of JssProvider (#157).
- Allow JssProvider rerender when used deep in the tree (#128).
- Added `inject` option to `injectSheet` which allows you to filter props which are going to be passed to the child props (#130).
- Removed the `sheet` prop. Now in order to get it back you need to specify the options `{inject: ['sheet']}`. Most of the time you should just use `props.classes`, which is provided by default.
- Restructured tests (#118)
- Object classes passed by the user via props is now merged with sheet classes and `InnerComponent.defaultProps.classes` (#132)

## 7.2.0 / 2017-09-23

- Add `generateClassName` prop to `JssProvider` in order to support multi-tree apps.

## 7.1.0 / 2017-08-16

- Added custom `theming` option

## 7.0.2 / 2017-07-19

- Fix theming with `JssProvider`

## 7.0.0 / 2017-07-13

- Added theming support, introduced `ThemeProvider` and `withTheme`.
- Function `injectSheet` now accepts a styles creator function which receives a theme.
- Updated to JSS 8
- Class generator counter will reset on every request for dynamic SSR.
- Dynamic styles are now also added to the sheets registry for SSR.
- Fixed classnames generators for dynamic SSR (generating sheets on each request).

### Breaking changes

- Removed `createInjectSheet`. Use JssProvider to pass a `jss` instead.
- Renamed `SheetsRegistryProvider` to `JssProvider`.
- Function `injectSheet` doesn't accept a StyleSheet instance any more. Potential solutions:
  - Extract common sheet into separate component.
  - Mix reusable styles into component styles.
  - Reuse a sheet directly, by managing your own sheet and using a `composes` feature.

## 7.0.0-pre.1 / 2017-07-06

- Add sheets to the registry when it is a new instance

## 7.0.0-pre / 2017-06-28

- Theming - `ThemeProvider` and `withTheme`
- Update to JSS 8
- Class generator counter will reset on every request for dynamic SSR.

### Breaking changes

- Removed `createInjectSheet`. Use JssProvider to pass a `jss` instead.
- Renamed `SheetsRegistryProvider` to `JssProvider`.

## 6.1.1 / 2017-04-14

- Use prop-types package

## 6.1.0 / 2017-04-14

- Refactored the structure
- Exposed and documented `StyledComponent.InnerComponent`
- Fixed default props not being passed to the function values. (#87)

## 6.0.0 / 2017-04-10

- Use JSS 7.0

## 5.4.1 / 2017-04-03

- Don't ignore static rules when function values are used (#82)

## 5.4.0 / 2017-03-14

- Introduced function values.

## 5.3.0 / 2017-01-30

- Pass `classes` object over props additionally to `sheet` prop.

## 5.2.0 / 2017-01-13

- Function injectSheet(styleSheet) now accepts StyleSheet instance.
- You can override the sheet property now from the parent component. (#47)

## 5.1.1 / 2016-12-31

- Fix specificity for the most cases cssinjs/react-jss#61

## 5.1.0 / 2016-12-13

- Export SheetsRegistryProvider and SheetsRegistry

## 5.0.0 / 2016-12-09

- Support JSS 6.0

## 4.2.0 / 2016-11-21

- Upgrade to jss-present-default 0.9.0

## 4.1.3 / 2016-11-03

- Fixing tests (React regression https://github.com/facebook/react/issues/7803)

## 4.1.2 / 2016-10-07

- Fix refs inconsistency on hot reloading #18

## 4.1.1 / 2016-09-27

- Update dependencies
- Tests integration for jss repo

## 4.1.0 / 2016-09-27

- Make default Jss instance available.

## 4.0.3 / 2016-09-25

- Default Container component should render children to allow wrapping.

## 4.0.2 / 2016-09-25

- Maked passing a component optional.

## 4.0.1 / 2016-09-25

- Fix test runner for jss main repo.

## 4.0.0 / 2016-09-24

- Added jss and jss-preset-default as a dependency, uses jss-preset-default by default #49.
- Added tests #28.
- Streamlined the api, default export is now a function without overloads, it is `injectSheet(styles, [options])(Component)`, same signature is used by ES7 decorators #37.
- Added component name as data-meta attribute to the sheet #22.
- Added a `create()` function to create a new `injectSheet` function which takes a `jss` instance.
- Updated readme.
- Added lint-staged.
