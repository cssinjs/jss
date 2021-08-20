// @flow

type Result = any
type Args = any
type ComputeFn = (...args: Args) => Result
type MemoFn = (...args: Args) => Result

const memoize = (fn: ComputeFn): MemoFn => {
  const cache = new Map<string, Result>()

  return (...args: Args): Result => {
    const key: string = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result: Result = fn(...args)
    cache.set(key, result)

    return result
  }
}

export default memoize
