// @flow

// A reference based cache.
// Will only work if the same style object refereces have been passed.

const createCache = () => {
  const cache = new WeakMap()

  return {
    get(args) {
      const cached = cache.get(args[0])
      if (!cached) return undefined
      // Check if all arguments are equal.
      for (const i in args) {
        if (args[i] !== cached.args[i]) {
          return undefined
        }
      }
      return cached.className
    },
    set(args, className) {
      if (!args[0]) return className
      cache.set(args[0], {className, args})
      return className
    }
  }
}

export default createCache
