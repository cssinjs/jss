// @flow

const memoize = <Arg, Return>(fn: (arg: Arg) => Return) => {
  let lastArg
  let lastResult

  return (arg: Arg): Return => {
    if (typeof lastArg === 'undefined' || lastArg !== arg) {
      lastArg = arg
      lastResult = fn(arg)
    }

    return lastResult
  }
}

export default memoize
