## Performance

### Advantages

JSS has a number of performance advantages.

  - Incremental compilation and rendering (as soon as needed).
  - Rendered styles are cached. Compilation and DOM Rules creation happens only once.
  - Only styles which are currently in use on your screen are also in the DOM.
  - Simple class selectors ensure high selectors [performance](#jsperf-simple-class-selectors) at scale.

### Bootstrap bench experiment

As an experiment, I have converted bootstraps css to jss. In `bench/bootstrap` folder you will find [jss](http://jsstyles.github.io/jss/bench/bootstrap/jss.html) and [css](http://jsstyles.github.io/jss/bench/bootstrap/css.html) files. You need to try more than once to have some average result.

On my machine overhead is about 10-15ms. However the difference in real application will be much lower because of the advantages named before.

### JSPerf JSS vs. CSS

[JSPerf bench](http://jsperf.com/jss-vs-css/3).

### JSPerf simple class selectors

[JSPerf bench](http://jsperf.com/css-selectors-amount-influences-dom-performance/3).

### JSPerf inline styles vs. classes

[JSPerf bench](http://jsperf.com/classes-vs-inline-styles/4)
