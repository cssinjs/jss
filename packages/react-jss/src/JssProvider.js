// @flow
import React, {Component, type Node} from 'react'
import PropTypes from 'prop-types'
import defaultJss, {createGenerateId, type Jss, type GenerateId, SheetsRegistry} from 'jss'
import type {Context, Managers} from './types'
import JssContext from './JssContext'

/* eslint-disable react/require-default-props */

type Props = {
  jss?: Jss,
  registry?: SheetsRegistry,
  generateId?: GenerateId,
  classNamePrefix?: string,
  disableStylesGeneration?: boolean,
  media?: string,
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
    media: PropTypes.string
  }

  managers: Managers = {}

  /**
   * We need to merge the outer context with the props,
   * because we allow overriding any prop at any level.
   */
  createContext(outerContext: Context): Context {
    const {registry, classNamePrefix, jss, generateId, disableStylesGeneration, media} = this.props
    // Clone the outer context
    const context = {
      ...outerContext,
      managers: this.managers
    }

    if (registry) {
      context.registry = registry
    }

    if (generateId) {
      context.sheetOptions.generateId = generateId
    } else if (!context.sheetOptions.generateId) {
      if (!this.generateId) {
        this.generateId = createGenerateId()
      }
      context.sheetOptions.generateId = this.generateId
    }

    // Merge the classname prefix
    if (classNamePrefix) {
      context.sheetOptions.classNamePrefix =
        (context.sheetOptions.classNamePrefix || '') + classNamePrefix
    }
      
    if (media !== undefined) {
      context.sheetOptions.media = media
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
