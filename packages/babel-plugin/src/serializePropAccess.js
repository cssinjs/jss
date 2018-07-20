export default node => {
  // Find the `theme` object.
  let object = node
  // Aggregate a props access chain: `theme.x[0].color` => `['theme', 'c', 0, 'color']`
  const props = [object.property.name || object.property.value]
  while (object.object) {
    // Find the first object we are accessing.
    object = object.object
    props.unshift(object.name || object.property.name || object.property.value)
  }
  return {object, props}
}
