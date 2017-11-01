import isObservable from './isObservable'

export default value => typeof value === 'function' || isObservable(value)
