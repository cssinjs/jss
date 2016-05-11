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
- added support for @charset, @import, @namespace,  @supports
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
