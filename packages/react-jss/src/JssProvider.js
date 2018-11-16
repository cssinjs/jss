// @flow
import {Component, type Node} from 'react'
import PropTypes from 'prop-types'
import type {Jss, GenerateId, SheetsRegistry} from 'jss'
import {createGenerateIdDefault} from './jss'
import * as ns from './ns'
import contextTypes from './contextTypes'
import propTypes from './propTypes'
import type {Context} from './types'

/* eslint-disable react/require-default-props */

type Props = {
  jss?: Jss,
  registry?: SheetsRegistry,
  generateId?: GenerateId,
  classNamePrefix?: string,
  disableStylesGeneration?: boolean,
  children: Node
}

export default class JssProvider extends Component<Props> {
  static propTypes = {
    ...propTypes,
    generateId: PropTypes.func,
    classNamePrefix: PropTypes.string,
    disableStylesGeneration: PropTypes.bool,
    children: PropTypes.node.isRequired
  }

  static childContextTypes = contextTypes

  static contextTypes = contextTypes

  // JssProvider can be nested. We allow to overwrite any context prop at any level.
  // 1. Check if there is a value passed over props.
  // 2. If value was passed, we set it on the child context.
  // 3. If value was not passed, we proxy parent context (default context behaviour).
  getChildContext(): Context {
    const {
      registry,
      classNamePrefix,
      jss: localJss,
      generateId,
      disableStylesGeneration
    } = this.props
    // eslint-disable-next-line react/react/destructuring-assignment
    const sheetOptions = this.context[ns.sheetOptions] || {}
    const context: Context = {[ns.sheetOptions]: sheetOptions}

    if (registry) {
      context[ns.sheetsRegistry] = registry
      // This way we identify a new request on the server, because user will create
      // a new Registry instance for each.
      if (registry !== this.registry) {
        // We reset managers because we have to regenerate all sheets for the new request.
        this.managers = {}
        this.registry = registry
      }
    }

    // Make sure we don't loose managers when JssProvider is used inside of a stateful
    // component which decides to rerender.
    context[ns.managers] = this.managers

    if (generateId) {
      sheetOptions.generateId = generateId
    } else if (!sheetOptions.generateId) {
      if (!this.generateId) {
        if (localJss && localJss.generateClassName) {
          // re-use the same classname generator pinned to the local jss instance
          this.generateClassName = localJss.generateClassName
        } else {
          let createGenerateId = createGenerateIdDefault
          if (localJss && localJss.options.createGenerateId) {
            createGenerateId = localJss.options.createGenerateId
          }
          // Make sure we don't loose the generator when JssProvider is used inside of a stateful
          // component which decides to rerender.
          this.generateId = createGenerateId()
        }
      }

      sheetOptions.generateId = this.generateId
    }

    if (classNamePrefix) sheetOptions.classNamePrefix = classNamePrefix
    if (localJss) context[ns.jss] = localJss
    if (disableStylesGeneration !== undefined) {
      sheetOptions.disableStylesGeneration = disableStylesGeneration
    }

    return context
  }

  registry: SheetsRegistry

  managers: {}

  generateId: GenerateId

  render() {
    return this.props.children
  }
}
