## 1.0.8 / 2014-03-16

- fix bower package name
- make change condition to include any non-null value in Rule#prop (Stephen Saunders)

## 1.0.7 / 2014-02-26

- remove NO-BREAK SPACE chars

## 1.0.6 / 2014-02-24

- add rule.toJSON()

## 1.0.5 / 2014-02-17

- support any node version above 0.8

## 1.0.4 / 2014-02-6

- allow rule options to be passed in internal rule#addRule method to allow nested rules to have different options than parent one (for now just "named")

## 1.0.3 / 2014-01-31

- pass rule name to make debug plugin possible

## 1.0.2 / 2014-01-31

- fix duplicated rule rendering

## 1.0.1 / 2014-01-31

- run plugins on inner rules of at-rules

## 1.0.0 / 2014-01-31

- styles have named: true option by default, this is backwards incompatible
- at-rules like @media can now also have named rules

## 0.10.2 / 2014-01-31

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
