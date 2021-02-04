/* eslint-disable */
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
export default (typeof globalThis !== 'undefined'
  ? globalThis
  : typeof window !== 'undefined' && window.Math === Math
    ? window
    : typeof self !== 'undefined' && self.Math === Math
      ? self
      : Function('return this')())
