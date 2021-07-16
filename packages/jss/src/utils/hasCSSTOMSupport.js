/**
 * Export a constant indicating if this browser has CSSTOM support.
 * https://developers.google.com/web/updates/2018/03/cssom
 */
const hasCSSTOMSupport = typeof CSS === 'object' && CSS != null && 'number' in CSS
export default hasCSSTOMSupport
