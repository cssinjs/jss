/* eslint-disable no-nested-ternary */
export default (typeof global !== 'undefined'
  ? global
  : typeof self !== 'undefined'
    ? self
    : typeof window !== 'undefined'
      ? window
      : {})
