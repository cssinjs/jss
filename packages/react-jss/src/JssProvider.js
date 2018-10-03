// @flow
import {Component, Children, type Element, type ElementType} from 'react'
import PropTypes from 'prop-types'
import type {Jss, GenerateClassName, SheetsRegistry} from 'jss'
import {createGenerateClassNameDefault} from './jss'
import * as ns from './ns'
import contextTypes from './contextTypes'
import propTypes from './propTypes'
import type {Context} from './types'

/* eslint-disable react/require-default-props */

type Props = {
  jss?: Jss,
  registry?: SheetsRegistry,
  generateClassName?: GenerateClassName,
  classNamePrefix?: string,
  disableStylesGeneration?: boolean,
  children: Element<ElementType>
}

export default class JssProvider extends Component<Props> {
  static propTypes = {
    ...propTypes,
    generateClassName: PropTypes.func,
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
      generateClassName,
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

    if (generateClassName) {
      sheetOptions.generateClassName = generateClassName
    } else if (!sheetOptions.generateClassName) {
      if (!this.generateClassName) {
        let createGenerateClassName = createGenerateClassNameDefault
        if (localJss && localJss.options.createGenerateClassName) {
          createGenerateClassName = localJss.options.createGenerateClassName
        }
        // Make sure we don't loose the generator when JssProvider is used inside of a stateful
        // component which decides to rerender.
        this.generateClassName = createGenerateClassName()
      }

      sheetOptions.generateClassName = this.generateClassName
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

  generateClassName: GenerateClassName

  render() {
    const {children} = this.props

    return Children.only(children)
  }
}
