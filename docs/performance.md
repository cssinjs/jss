# Performance

## Advantages

JSS has some performance advantages.

- Incremental compilation and rendering (as soon as needed).
- Rendered styles are cached. Compilation and DOM Rules creation happens only once.
- Only styles which are currently in use on your screen are also in the DOM (react-jss).
- Simple class selectors ensure high selectors [performance](#jsperf-simple-class-selectors) at scale.

## Run benchmarks locally

These benchmarks are used to ensure performance after code changes.

However, one test compiles bootstrap library from JSS to a CSS string. On my machine in Chrome ~130KB JSS compiles at **180 ops/sec**.

```bash
yarn
yarn bench
```

## Comparison with other CSSinJS libs

[css-in-js-perf-tests](https://github.com/rtsao/css-in-js-perf-tests)

## JSPerf JSS vs. CSS

[JSPerf bench](http://jsperf.com/jss-vs-css/3).

## JSPerf simple class selectors

[JSPerf bench](http://jsperf.com/css-selectors-amount-influences-dom-performance/3).

## JSPerf inline styles vs. classes

Inline styles are also slower because of a simple fact that same styled items (e.g. in a list) don't share the same rule.

[JSPerf bench 1](http://jsperf.com/classes-vs-inline-styles/4)

[JSPerf bench 2](http://jsperf.com/class-vs-inline-styles/2)
