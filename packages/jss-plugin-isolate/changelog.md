## 5.1.0 / 2017-12-27

- Updated css-initials dependency, removes non-standard properties support.

## 5.0.0 / 2017-09-30

- Support JSS 9
- Use css-initials package
- Add `reset: 'all'` option
- Make updating selector synchronous.
- Added lockfile.

## 5.0.0-pre.2 / 2017-08-25

- Use css-initials package
- Add `reset: 'all'` option

## 5.0.0-pre.1 / 2017-08-17

- Require ^jss@9.0.0-pre

## 5.0.0-pre / 2017-08-17

- Make updating selector synchronous.
- Added lockfile.

## 4.0.2 / 2017-08-17

- Reverted changes introduced by 4.0.1 release because they are not compatible with JSS 8. They will be republished in v5.

## 4.0.0 / 2017-06-20

- support JSS 8

## 3.0.0 / 2017-04-25

- support JSS 7
- improve debounce performance
- added new values for option `isolate`

## 2.1.0 / 2017-01-19

- `jss.use(isolate({isolate: false})` - will not isolate any rule by default, to isolate you will need to set isolate: true on a sheet or on the rule.

- `jss.use(isolate({isolate: 'root'})` - will isolate automatically only rules with name "root" or any other name you want to use. This allows children in this component to inherit inheritable values, but components which have own roots will be isolated, so that inheritance doesn't spread to all children.

## 2.0.1 / 2017-01-05

- fixed isolate: false with jss-nested (cssinjs/jss#401)

## 2.0.0 / 2016-12-09

- update jss to 6.0

## 1.0.3 / 2016-11-23

- support jss.createRule(styles) without a sheet

## 1.0.2 / 2016-11-05

- cleanup DOM after tests

## 1.0.1 / 2016-11-05

- update deps
- migrate tests

## 1.0.0 / 2016-08-01

- update to jss 5
- update dev deps

## 0.1.0 / 2016-04-08

- First plugin release. Let the Party BigInt!
