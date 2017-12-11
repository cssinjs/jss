import global from './global'

const ns = '2f1acc6c3a606b082e5eef5e54414ffb'
if (global[ns] == null) global[ns] = 0

// In case we have more than one module version.
export default global[ns]++
