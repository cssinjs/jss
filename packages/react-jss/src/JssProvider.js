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

const defaultGenerateId = createGenerateIdDefault()

export default class JssProvider extends Component<Props> {
  static propTypes = {
    registry: PropTypes.instanceOf(SheetsRegistry),
    jss: PropTypes.shape({}),
    generateId: PropTypes.func,
    classNamePrefix: PropTypes.string,
    disableStylesGeneration: PropTypes.bool,
    children: PropTypes.node.isRequired
  }

  createContext(outerContext: Context): Context {
    const {registry, classNamePrefix, jss, generateId, disableStylesGeneration} = this.props
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

    if (!context.sheetOptions.generateId) {
      context.sheetOptions.generateId = generateId || (jss && jss.generateId) || defaultGenerateId
    }

    if (classNamePrefix) {
      context.sheetOptions.classNamePrefix =
        classNamePrefix + (context.sheetOptions.classNamePrefix || '')
    }
    if (jss) {
      context.jss = jss
    }
    if (disableStylesGeneration !== undefined) {
      context.disableStylesGeneration = disableStylesGeneration
    }

    return context
  }

  registry: SheetsRegistry

  managers: {}

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
