import $$observable from 'symbol-observable'

export default value => value && value[$$observable] && value === value[$$observable]()
