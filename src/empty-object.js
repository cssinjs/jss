export default function isEmptyObject(obj) {
  for (let key in obj) return false

  return true
}
