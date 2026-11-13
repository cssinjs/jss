## JavaScript Environment Requirements

The [historical browser support matrix](../browsers.json) includes IE9; the current automated browser tests run in Chromium using Vitest and Playwright. We do NOT include polyfills we rely on in the build. It is up to the user to include polyfills depending on what environment they need to support. Here is a full list of polyfills you will need if you support ALL browsers JSS does:

```js
// react-jss, css-jss
import 'core-js/features/map'
import 'core-js/features/function/name'
// jss, jss-plugin-cache
import 'core-js/features/weak-map'
// styled-system
import 'core-js/features/set'
import 'core-js/features/symbol'
// react-jss, css-jss
import 'core-js/features/object/assign'
// tests
import 'core-js/features/typed-array'
import 'core-js/features/string/includes'
// examples
import 'raf/polyfill'
```

We consider adding a requirement to a new polyfill - a breaking change and it will require a major version incrementation.

We recommend using [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env), which is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s). This both makes your life easier and JavaScript bundles smaller!
