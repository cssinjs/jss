// @flow
import {type Classes} from 'jss'
/**
 * Adds `composes` property to each top level rule
 * in order to have a composed class name for dynamic style sheets.
 *
 * It relies on jss-compose and jss-extend plugins.
 *
 * Example:
 * classes:  {left: 'a', button: 'b'}
 * styles:   {button: {height: () => { ... }}}
 * composed: {
 *   button: {
 *     composes: 'b',
 *     height: () => { ... }
 *   },
 *   left: {
 *     composes: 'a'
 *   }
 * }
 *
 * @param {Object} classes static classes map
 * @param {Object} styles dynamic styles object without static properties
 * @return {Object|null}
 */
export default (staticClasses: Classes, dynamicClasses: Classes) => {
  const combinedClasses = {...staticClasses}

  for (const name in dynamicClasses) {
    combinedClasses[name] = staticClasses[name]
      ? `${staticClasses[name]} ${dynamicClasses[name]}`
      : dynamicClasses[name]
  }

  return combinedClasses
}
