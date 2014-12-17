## 0.8.2 / 2014-12-17

- add build for "support non browser env #12"
- add calendar example

## 0.8.1 / 2014-11-29

- support non browser env #12

## 0.8.0 / 2014-11-29

- renamed Stylesheet to StyleSheet because its wrong.

## 0.7.0 / 2014-11-29

- moved jss to separate github organization
- moved all plugins to separate repositories (don't force people use plugins they don't need)

## 0.6.0 / 2014-11-28

- rename processors to plugins
- add public .use function for registering plugins

## 0.5.0 / 2014-11-27

- support multiple declarations with identical property names #22

## 0.4.0 / 2014-11-23

- support nested rules when using .addRule method #20

## 0.3.2 / 2014-11-19

- rewrite prefixer for feature testing using camel cased version because of firefox

## 0.3.0 / 2014-11-19

- add vendor prefixes plugin for properties #21

## 0.2.10 / 2014-11-10

- support nested extend
- add more complex topcoat example

## 0.2.9 / 2014-11-03

- add @keyframes and @media support #16

## 0.2.8 / 2014-11-02

- add possibility write multi nested selector in one line #18

## 0.2.7 / 2014-11-02

- add @font-face to cli converter
- add @keyframes to cli converter

## 0.2.6 / 2014-11-02

- create perf comparence for bootstrap #13

## 0.2.5 / 2014-11-02

- create css->jss converter #11

## 0.2.4 / 2014-11-01

- make tests runnable from githubs gh-pages http://jsstyles.github.io/jss/test/

## 0.2.3 / 2014-11-01

- fix test failing in firefox #14

## 0.2.2 / 2014-11-01

- Rename param "generateClasses" to "named" in createStyleSheet
- If `named` is true, ss.rules[name] is accessible using the name.
- ss.addRules will render new rules after style element has been rendered too.
- document ss.addRules

## 0.2.1 / 2014-10-29

First official release.
