const ns = '2f1acc6c3a606b082e5eef5e54414ffb'
if (global[ns] == null) global[ns] = 0

// Bundle may contain multiple JSS versions at the same time. In order to identify
// the current version with just one short number and use it for classes generation
// we use a counter. Also it is more accurate, because user can manually reevaluate
// the module.
export default global[ns]++
