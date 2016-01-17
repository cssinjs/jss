## Performance

### Advantages

JSS has a number of advantages in terms of performance, compared to plain CSS.

  - Incremental compilation and rendering (as soon as needed).
  - Rendered styles are cached. Compilation and DOM Rules creation happens only once.
  - Only styles which are currently in use on your screen are also in the DOM.
  - Simple class selectors ensure high selectors performance at scale.

### Bootstrap bench experiment

As an experiment, I have converted bootstraps css to jss. In `bench/bootstrap` folder you will find[jss](http://jsstyles.github.io/jss/bench/bootstrap/jss.html) and [css](http://jsstyles.github.io/jss/bench/bootstrap/css.html) files. You need to try more than once to have some average result.

    On my machine overhead is about 10-15ms.

### JSPerf

[JSperf bench](http://jsperf.com/jss-vs-css/3).
