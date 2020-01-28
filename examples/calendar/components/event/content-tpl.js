/**
 * Returns compiled html for event content.
 *
 * @param {Object} data
 * @return {String}
 */
export function compile(data) {
  const {classes} = data
  return `
    <div class="${classes.content}">
      <h3 class="${classes.title}">${data.title}</h3>
      <div class="${classes.location}">${data.location}</div>
    </div>
  `
}
