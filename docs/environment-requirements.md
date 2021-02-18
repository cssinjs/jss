## JavaScript Environment Requirements

We run our tests against a [number of real browsers](../browsers.json) including IE9, but we do NOT include polyfills we rely on in the build. It is up to the user to include polyfills depending on what environment they need to support. Here is a [full list of polyfills]() you will need if you support ALL browsers JSS does.

We consider adding a requirement to a new polyfill - a breaking change and it will require a major version incrementation.

It is hard to compile and maintain a full list of required polyfills for each runtime for each version of JSS, so we think you should test your application in the browser you support, and you will see if any polyfill is missing.

We recommend using [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env), which is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s). This both makes your life easier and JavaScript bundles smaller!
