// @flow
import React, {Component, type Node} from 'react'
import PropTypes from 'prop-types'
import {
  createGenerateId as createGenerateIdDefault,
  type Jss,
  type GenerateId,
  SheetsRegistry
} from 'jss'
import type {Context} from './types'
import JssContext from './JssContext'

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
    registry: PropTypes.instanceOf(SheetsRegistry),
    jss: PropTypes.shape(),
    generateId: PropTypes.func,
    classNamePrefix: PropTypes.string,
    disableStylesGeneration: PropTypes.bool,
    children: PropTypes.node.isRequired
  }

  createContext(outerContext: Context): Context {
    const {
      registry,
      classNamePrefix,
      jss: localJss,
      generateId,
      disableStylesGeneration
    } = this.props
    // Clone the outer context
    const context = {...outerContext}

    if (registry) {
      context.registry = registry
      // This way we identify a new request on the server, because user will create
      // a new Registry instance for each.
      if (registry !== this.registry) {
        // We reset managers because we have to regenerate all sheets for the new request.
        this.managers = {}
        this.registry = registry
      }
    }

    if (this.managers) {
      context.managers = this.managers
    }

    // Use the generateId of the props first
    // Then try to use the generateId of the jss instance if one was passed
    // Else wise if no generateId was created yet, we create one, save it and add it to the sheet options
    if (generateId) {
      context.sheetOptions.generateId = generateId
    } else if (localJss) {
      context.sheetOptions.generateId = localJss.generateId
    } else if (!context.sheetOptions.generateId) {
      this.generateId = createGenerateIdDefault()

      context.sheetOptions.generateId = this.generateId
    }

    if (classNamePrefix) {
      context.sheetOptions.classNamePrefix = classNamePrefix
    }
    if (localJss) {
      context.jss = localJss
    }
    if (disableStylesGeneration !== undefined) {
      context.disableStylesGeneration = disableStylesGeneration
    }

    return context
  }

  registry: SheetsRegistry

  managers: {}

  generateId: GenerateId

  render() {
    const {children} = this.props

    return (
      <JssContext.Consumer>
        {outerContext => (
          <JssContext.Provider value={this.createContext(outerContext)}>
            {children}
          </JssContext.Provider>
        )}
      </JssContext.Consumer>
    )
  }
}
