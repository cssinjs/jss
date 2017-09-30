import isObservable from 'is-observable'

export default value => typeof value === 'function' || isObservable(value)
