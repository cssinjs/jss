suite('isObject', () => {
  function isObject1(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]'
  }

  function isObject2(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj)
  }

  const obj0 = {}
  const obj1 = null
  const obj2 = []
  const obj3 = '123'
  const obj4 = 123

  function use(result) {
    return result === true
  }

  benchmark('isObject impl 1', () => {
    use(isObject1(obj0))
    use(isObject1(obj1))
    use(isObject1(obj2))
    use(isObject1(obj3))
    use(isObject1(obj4))
  })

  benchmark('isObject impl 2', () => {
    use(isObject2(obj0))
    use(isObject2(obj1))
    use(isObject2(obj2))
    use(isObject2(obj3))
    use(isObject2(obj4))
  })
})
