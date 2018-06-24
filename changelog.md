## 9.8.7 / 2018-06-24

* Fix `global` access in the dist version (#736)

## 9.8.6 / 2018-06-19

* Remove type attribute from style element (#724)

## 9.8.5 / 2018-06-19

* Fix version in the dist version (#730)

## 9.8.4 / 2018-06-12

* Add link to the egghead course
* Upgrade prettier and format code (#726)

## 9.8.3 / 2018-06-10

- Fix CSSOM local typings (flow stopped looking into node_modules if types are not imported directly since v0.57.0)

## 9.8.2 / 2018-06-01

- Fixed typings for RuleList.update method.
- Migrated from webpack to rollup.
- Upgraded to flow 0.72

## 9.8.1 / 2018-03-19

- Upgrade to flow 0.68.0

## 9.8.0 / 2018-02-08

- Remove hyphenation from the core, moved it to jss-camel-case. Now any function values and `rule.prop()` will get hyphenation automatically.

## 9.7.0 / 2018-01-06

- Allow function values return falsy values in order to remove a property.

## 9.6.0 / 2018-01-28

- Added prettier
- Added a new, correct way of handling CSP

## 9.5.1 / 2018-01-08

- Added postinstall script with donation log.

## 9.5.0 / 2018-01-02

- Export `toCssValue` utility function for css-vendor package.

## 9.4.0 / 2017-12-16

- Added array values support when used with function values. It now also supports priority option "!important" (#629)
- Use classNamePrefix option in production mode (#638)
- Added onUpdate to docs and types, now officially supported
- Fixed class names collisions with multiple jss instances (#644)

## 9.3.3 / 2017-11-15

- Added CSS.escape fallback, so that polyfill is not required.

## 9.3.2 / 2017-11-14

- Don't put escaped class names into classes hash

## 9.3.1 / 2017-11-13

- Never use window object directly

## 9.3.0 / 2017-11-13

- Add CSS class name escaping for dev mode also we support emoji now! (#624)
- Added CSP over webpack (#559)

## 9.2.0 / 2017-11-06

- Allow empty rules when option {link: true} is used.
- Simplify internal logic for function values.
- Introduce function rules - similar to function values, now function can return the entire style object.

## 9.1.0 / 2017-10-31

- Added Observable rules. Now not only values can be an observable, but also the entire style object.

## 9.0.0 / 2017-09-30

- Added `SheetsManager.size` getter to get amount of items in `SheetsManager`.
- Refactored `StyleRule.selector` for better performance. Breaking change - it doesn't reregister rule in the classes map any more. It was used mainly in jss-isolate (#419).
- Method `jss.setup()` can now be called multiple times and will merge properly the options. Also it will avoid applying same plugins more than once by comparing the reference (#576).
- Fixed linker, which didn't work if selectors were escaped (#557).
- In production `createGenerateClassName()` option will now produce short selectors and warn about memory leaks. (#546)
- Update flow to v0.54.1.
- Support observable values (#442).
- Warn when dynamic properties update but link: true option is not set (#581)

## 8.1.0 / 2017-07-12

- Added webpackbin examples
- Added size-limit tool
- Added SheetsManager

## 8.0.0 / 2017-06-20

- Option `insertionPoint` can now accept a DOM node
- DOM node provided in `insertionPoint` can be inside of an iframe.
- Warn when an `insertionPoint` was specified but not found in the DOM.

### Breaking changes for users

- Option `generateClassName` which was used in Jss constructor and `Jss.setup` has been removed. A new option is called `createGenerateClassName` which is a factory that returns the old `generateClassName`. We need this to reset counters on SSR for each request.
- Removed default `insertionPoint` value ("jss") in order to have warnings when insertionPoint is not found in the DOM. With the default one we simply don't know when to warn.

### Potentially breaking changes for plugins

- KeyframeRule has been renamed to KeyframesRule.
- KeyframeRule.type === 'keyframe' => KeyFrames.type === 'keyframes'.
- RegularRule has been renamed to StyleRule
- RegularRule.type === 'regular' => StyleRule.type === 'style'.
- RegularRule.name => RegularRule.key
- ConditionalRule.selector => ConditionalRule.key
- FontFaceRule.selector => FontFaceRule.key
- SimpleRule.name => SimpleRule.key
- ViewportRule.name => ViewportRule.key
- RulesContainer => RuleList

## 7.1.7 / 2017-06-15

- Fix CSS flow types

## 7.1.6 / 2017-06-14

- Fix dynamic values for conditional and keyframe rules

## 7.1.5 / 2017-05-28

- Prevent duplicates in the sheets registry (#504)
- Optimize `sheets.add` for a big registry

## 7.1.4 / 2017-05-27

- Fixed undefined rule support (#489)

## 7.1.3 / 2017-05-26

- Fixes flow error when updating to the latest version (#507)
- Fixes createStyleSheet type definitions error (#495)
- Fixes function values for for nested rules (#500)

## 7.1.2 / 2017-05-12

- Fixes function values within keyframes (#471)

## 7.1.1 / 2017-04-26

- Fixes rendering rules with function values only (#475)

## 7.1.0 / 2017-04-21

- Support updating specific rule in `sheet.update(name, data)`

## 7.0.3 / 2017-04-14

- Fix a bug when dynamically inserted rules disapeared after reattaching the sheet (#438)

## 7.0.2 / 2017-04-14

- Remove temporarily jss-isolate from the tests

## 7.0.1 / 2017-04-14

- Fix `getDynamicStyles` when nested object is in the same styles object (#467)

## 7.0.0 / 2017-04-10

- Perf improvement through removing of JSON.parse(JSON.stringify(style))
- New hook `onProcessStyle`
- New hook `onChangeValue`

### Bugfixes

- Run plugins over property names with function values (#441)
- Function values inside of nested rules (#445)

### Breaking changes

- New signature of `generateClassName(rule, sheet)` option.
- Property `rule.originalStyle` is now available through `rule.options.parent.rules.raw[rule.name]`. It is longer but its a better place and is used in plugins only.
- Plugin signature for the hook `onProcessRule` shortcut `jss.use((rule) => {})` is not supported any more. Instead this hook is supported using its full name: `jss.use({onProcessRule: () => {}})`

## 6.5.0 / 2017-03-14

- Dynamic Sheets for theming and animations. #356

## 6.4.0 / 2017-03-10

- Reintroduced counter based class generation algorithm. #432

## 6.3.0 / 2017-02-16

- Introduced new option `insertionPoint`.
- Reduced amount of files in the package, dropped .npmignore file.
- Removed babel-runtime from the build.
- Added a new hook `onProcessSheet`.
- Started a list of companies/products using JSS, see docs/users.md

## 6.2.0 / 2017-01-15

- Added @viewport and @-ms-viewport support (used in bootstrap).

## 6.1.1 / 2017-01-04

- Allow sheet.link() call when VirtualRenderer is used.

## 6.1.0 / 2016-12-26

- Add jss-cache to the tests suit.
- Don't run processors on a rule which has been processed already.
- Add test for onCreateRule arguments.
- Add sheet as a second argument to the onProcessRule hook.

## 6.0.2 / 2016-12-23

- Call `onCreateRule` for every rule type.
- RulesContainer is now exported for the plugins.
- Using babel-runtime for the lib build now.
- Using webpack 2 now.
- Preparation for the bugfix - nesting within @global (#380)
- Preparation for the bugfix - nested @media inside of a rule inside of @global (#387).

## 6.0.1 / 2016-12-10

- Don't insert empty rules #363.

## 6.0.0 / 2016-12-09

- Added flow types.
- Added a new plugins API. It is backwards compatible. See plugins section.
- Perf improvements.

### Breaking changes

- Option "named" has been removed from JSS core and replaced by a jss-global plugin. From now on global styles are only possible using that plugin.
- Sheets are not added to the sheets registry automatically server-side any more. In order to prevent leaking styles between requests, you now need to create your own SheetsRegistry instance and add sheets to it manually. Make sure to create a new instance for each request. On the client, sheets are still automatically added to the registry.

## 5.5.6 / 2016-11-03

- test suite
- new is-in-browser detection #305
- warning when using an unknown at-rule
- start using flow #296

## 5.5.5 / 2016-09-23

- remove rewire from build
- update roadmap

## 5.5.4 / 2016-09-19

- always use `cssRules.insertRule` when using addRule on attached sheet, mixing them results in weird overwrite of a rule added by insertRule by a media query rendered using text node.
- catch errors from `cssRules.insertRule` and use a warning in development

## 5.5.3 / 2016-09-19

- add edge browser for browserstack
- fix addRule insertion order from plugins when sheet is attached
- fix @media insertion in IE

## 5.5.2 / 2016-09-9

- Skip empty values #307

## 5.5.1 / 2016-09-6

- Fix adding rules during the plugins loop

## 5.5.0 / 2016-09-6

- Fix wrong order of nested rules #285
- Add `index` option to `sheet.addRule` which allows to specify the order or added rules
- Add `<style>` node position control option `index` and insertion point comment
- Better browser detection by using `is-browser` package

## 5.4.0 / 2016-08-15

- More docs
- More benchmarks
- Make sheet.addRule accept options

## 5.3.0 / 2016-08-06

- Added `jss.setup` method which accepts options like the contructor and can be used for presets
- Docs
- Create Rodamap
- Cleanup DomRenderer from IE8 code.
- Fix benchmark, use a new jss instance, because there is sheets registry

## 5.2.0 / 2016-07-27

- Added `sheet.deleteRule` #266

## 5.1.0 / 2016-07-13

- alternative syntax for space and comma separated values #264

## 5.0.0 / 2016-07-10

- new fallbacks api #256
- rule.applyTo doesn't support fallbacks any more
- support conditionals overwrite upfront #259, #180
- remove compatibility fix for babel 5, now you need to use `var jss = require('jss').default` in ES5

## 4.0.3 / 2016-07-05

- fixed bug when plugins called twice on createStyleSheet #258
- enable node 7 #248

## 4.0.2 / 2016-06-28

- allow adding rules to a detached sheet #253

## 4.0.1 / 2016-06-23

- fix jss.version in lib

## 4.0.0 / 2016-06-23

- user defined classname generation function
- deterministic class names generation
- run plugins separately when creating rules in a batch

## 3.11.1 / 2016-05-11

- register children of a conditional in sheet.classes #81

## 3.11.0 / 2016-05-06

- added option element to .createStyleSheet #231

## 3.10.0 / 2016-05-02

- fix multiple @imports
- added benchmarks
- rewrote all tests with mocha

## 3.9.1 / 2016-04-26

- fix multiple @media in one sheet

## 3.9.0 / 2016-04-24

- update linter eslint-config-jss@1.0.0

## 3.8.0 / 2016-04-24

- added jss.version to the build (Daijiro Wachi)

## 3.7.0 / 2016-04-21

- docs
- font-face rule can now handle array of font-faces (Ken Carpenter)

## 3.6.3 / 2016-03-12

- fix rule registration in style sheet, previous commits resulted in a selector instead of class nem within sheet.classes map.

## 3.6.2 / 2016-04-12

- register rule when changed worked by setting selector

## 3.6.1 / 2016-03-11

- Update StyleSheet#rules when modifying selector

## 3.6.0 / 2016-04-08

- implement selector setter, now Rule#selector can be set, due to the fact not every browser implements selectorText setter, the entire sheet will be rerendered in such browsers. Should be used with caution.

## 3.5.0 / 2016-04-04

- fixed breaking change, which made exports of 3.4.0 incompatible with 3.3.0
- fix font-face rule type

## 3.4.0 / 2016-04-03

- added style sheets registry accesible via jss.sheets
- updated babel to version 6

## 3.3.0 / 2016-01-31

- fixed bug: nested rule inside of a @media conditional
- new docs
- trim empty rules (@wldcordeiro)
- support node 5 (@nikgraf)

## 3.2.0 / 2015-11-27

- jss-debug is deprecated, rule name is inside of generated class name now
- no more "type" option for style sheet, its always set to text/css
- no more "title" option for style sheet, its not a part of the spec http://www.w3.org/TR/html-markup/style.html
- added meta option, now you can for e.g. set the name of your component and find it on style element.
- fixed bug when multiple conditionals used in one sheet

## 3.1.1 / 2015-11-14

- added Rule#originalStyle property to access original style object from a plugin

## 3.1.0 / 2015-11-12

- new testing infrastructure with browserstack and codeship

## 3.0.0 / 2015-10-19

- internal rewrite for cleaner code (ConditionalRule, KeyframeRule, SimpleRule)
- moved all DOM related methods to dom.js module
- now child rules exist only in ConditionalRule, simplified Rule and StyleSheet logic
- fixed Named rules not generating when using @media only #81
- added support for @charset, @import, @namespace, @supports
- removed jss.Rule from public access, use jss.createRule() instead
- removed jss.Jss from public access, use jss.create() instead
- removed jss.StyleSheet from public access, use jss.createStyleSheet() instead

## 2.3.4 / 2015-09-21

- remove bower.json
- remove dist from repository
- add dist to npm package
- add cdnjs support

## 2.3.3 / 2015-09-20

- remove xpkg, update npmignore and ingore list for bower

## 2.3.2 / 2015-09-19

- reference rule name on the rule instance to fix jss-debug

## 2.3.1 / 2015-09-15

- use eslint-config-jss

## 2.3.0 / 2015-09-10

- migrate to es6
- move examples to jss-examples repository

## 2.2.1 / 2015-09-6

- remove @media from classes hash

## 2.2.0 / 2015-09-6

- added support for named at-rules e.g. @media

## 2.1.6 / 2015-09-2

- removed invalid characters

## 2.1.5 / 2015-08-20

- stop mutating original rules passed by user. expecting style to be a plaing object.

## 2.1.4 / 2015-07-31

- add internal method uid.reset() for testing

## 2.1.3 / 2015-07-31

- rename global reference to globalReference

## 2.1.2 / 2015-07-28

- avoid conflicts of jss ids when multiple jss versions are used on the same page

## 2.1.1 / 2015-07-20

- remove browser field from package.json, it makes webpack use dist version instead of src.

## 2.1.0 / 2015-07-18

- create Jss constructor so that we can have multiple jss instances with different plugins, needed when you want to reuse jss lib from different standalone components which have own jss configuration and should not clash.

## 2.0.0 / 2015-06-17

- create jss-cli package, remove bin script from jss

## 1.0.8 / 2015-03-16

- fix bower package name
- make change condition to include any non-null value in Rule#prop (Stephen Saunders)

## 1.0.7 / 2015-02-26

- remove NO-BREAK SPACE chars

## 1.0.6 / 2015-02-24

- add rule.toJSON()

## 1.0.5 / 2015-02-17

- support any node version above 0.8

## 1.0.4 / 2015-02-6

- allow rule options to be passed in internal rule#addRule method to allow nested rules to have different options than parent one (for now just "named")

## 1.0.3 / 2015-01-31

- pass rule name to make debug plugin possible

## 1.0.2 / 2015-01-31

- fix duplicated rule rendering

## 1.0.1 / 2015-01-31

- run plugins on inner rules of at-rules

## 1.0.0 / 2015-01-31

- styles have named: true option by default, this is backwards incompatible
- at-rules like @media can now also have named rules

## 0.10.2 / 2015-01-31

- fixed #40 there is no colons in all at-rules with nested declarations

## 0.10.1 / 2014-12-21

- fixed firefox issues

## 0.10.0 / 2014-12-21

- added rule.prop() for dynamic rule properties #15

## 0.9.0 / 2014-12-21

- added Rule#prop() for setting and getting rule props dynamically
- added `link` option in order to make .prop() work but still without to add perf overhead by default.
- added example for .prop()

## 0.8.2 / 2014-12-17

- added build for "support non browser env #12"
- added calendar example

## 0.8.1 / 2014-11-29

- supported non browser env #12

## 0.8.0 / 2014-11-29

- renamed Stylesheet to StyleSheet because its wrong.

## 0.7.0 / 2014-11-29

- moved jss to separate github organization
- moved all plugins to separate repositories (don't force people use plugins they don't need)

## 0.6.0 / 2014-11-28

- renamed processors to plugins
- added public .use function for registering plugins

## 0.5.0 / 2014-11-27

- supported multiple declarations with identical property names #22

## 0.4.0 / 2014-11-23

- supported nested rules when using .addRule method #20

## 0.3.2 / 2014-11-19

- rewrittn prefixer for feature testing using camel cased version because of firefox

## 0.3.0 / 2014-11-19

- added vendor prefixes plugin for properties #21

## 0.2.10 / 2014-11-10

- supported nested extend
- added more complex topcoat example

## 0.2.9 / 2014-11-03

- added @keyframes and @media support #16

## 0.2.8 / 2014-11-02

- added possibility write multi nested selector in one line #18

## 0.2.7 / 2014-11-02

- added @font-face to cli converter
- added @keyframes to cli converter

## 0.2.6 / 2014-11-02

- createed perf comparence for bootstrap #13

## 0.2.5 / 2014-11-02

- createed css->jss converter #11

## 0.2.4 / 2014-11-01

- made tests runnable from githubs gh-pages http://jsstyles.github.io/jss/test/

## 0.2.3 / 2014-11-01

- fixed test failing in firefox #14

## 0.2.2 / 2014-11-01

- Renamed param "generateClasses" to "named" in createStyleSheet
- If `named` is true, ss.rules[name] is accessible using the name.
- ss.addRules will render new rules after style element has been rendered too.
- document ss.addRules

## 0.2.1 / 2014-10-29

First official release.
