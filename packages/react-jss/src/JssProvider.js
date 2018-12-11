// @flow
import React, {Component, type Node} from 'react'
import PropTypes from 'prop-types'
import warning from 'warning'
import defaultJss, {
  createGenerateId,
  type Jss,
  type GenerateId,
  SheetsRegistry,
  type StyleSheetFactoryOptions
} from 'jss'
import type {Context, Managers} from './types'
import JssContext from './JssContext'

/* eslint-disable react/require-default-props */

type Props = {
  jss?: Jss,
  registry?: SheetsRegistry,
  generateId?: GenerateId,
  classNamePrefix?: string,
  disableStylesGeneration?: boolean,
  sheetOptions: StyleSheetFactoryOptions,
  children: Node
}

export default class JssProvider extends Component<Props> {
  static propTypes = {
    registry: PropTypes.instanceOf(SheetsRegistry),
    jss: PropTypes.instanceOf(defaultJss.constructor),
    generateId: PropTypes.func,
    classNamePrefix: PropTypes.string,
    disableStylesGeneration: PropTypes.bool,
    children: PropTypes.node.isRequired,
    sheetOptions: PropTypes.shape({
      media: PropTypes.string,
      element: PropTypes.instanceOf(HTMLStyleElement)
    })
  }

  managers: Managers = {}

  createContext(outerContext: Context): Context {
    const {
      registry,
      classNamePrefix,
      jss,
      generateId,
      disableStylesGeneration,
      sheetOptions
    } = this.props
    // Clone the outer context
    const context = {
      ...outerContext,
      managers: this.managers
    }

    if (sheetOptions) {
      warning(
        'generateId' in sheetOptions,
        '[JSS] Pass generateId as a prop instead of sheet options.'
      )

      context.sheetOptions = {
        ...context.sheetOptions,
        ...sheetOptions
      }
    }

    if (registry) {
      context.registry = registry
    }

    if (generateId) {
      context.sheetOptions.generateId = generateId
    } else if (!context.sheetOptions.generateId) {
      this.generateId = createGenerateId()
      context.sheetOptions.generateId = this.generateId
    }

    // Merge the classname prefix
    if (classNamePrefix) {
      context.sheetOptions.classNamePrefix =
        (context.sheetOptions.classNamePrefix || '') + classNamePrefix
    }

    if (jss) {
      context.jss = jss
    }

    if (disableStylesGeneration !== undefined) {
      context.disableStylesGeneration = disableStylesGeneration
    }

    return context
  }

  generateId: GenerateId

  renderProvider = (outerContext: Context) => {
    const {children} = this.props

    return (
      <JssContext.Provider value={this.createContext(outerContext)}>{children}</JssContext.Provider>
    )
  }

  render() {
    return <JssContext.Consumer>{this.renderProvider}</JssContext.Consumer>
  }
}
