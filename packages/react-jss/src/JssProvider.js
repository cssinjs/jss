// @flow
/* eslint-disable react/require-default-props, react/no-unused-prop-types */

import * as React from 'react'
import PropTypes from 'prop-types'
import {shallowEqualObjects} from 'shallow-equal'
import defaultJss, {
  createGenerateId,
  type Jss,
  type GenerateId,
  SheetsRegistry,
  type CreateGenerateIdOptions
} from 'jss'
import type {Context, Managers} from './types'
import JssContext from './JssContext'

type Props = {|
  jss?: Jss,
  registry?: SheetsRegistry,
  generateId?: GenerateId,
  classNamePrefix?: string,
  disableStylesGeneration?: boolean,
  media?: string,
  id?: CreateGenerateIdOptions,
  children: React.Node
|}

const initialContext: Object = {}

class JssProvider extends React.Component<Props> {
  static propTypes = {
    registry: PropTypes.instanceOf(SheetsRegistry),
    jss: PropTypes.instanceOf(defaultJss.constructor),
    generateId: PropTypes.func,
    classNamePrefix: PropTypes.string,
    disableStylesGeneration: PropTypes.bool,
    children: PropTypes.node.isRequired,
    media: PropTypes.string,
    id: PropTypes.shape({minify: PropTypes.bool})
  }

  managers: Managers = {}

  createContext: (Context, Context | void) => Context = (
    parentContext,
    prevContext = initialContext
  ) => {
    const {
      registry,
      classNamePrefix,
      jss,
      generateId,
      disableStylesGeneration,
      media,
      id
    } = this.props

    const context = {...parentContext}

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

    context.managers = this.managers

    if (id !== undefined) {
      context.id = id
    }

    if (generateId !== undefined) {
      context.generateId = generateId
    } else if (!context.generateId || !prevContext || context.id !== prevContext.id) {
      context.generateId = createGenerateId(context.id)
    }

    if (classNamePrefix) {
      context.classNamePrefix = (context.classNamePrefix || '') + classNamePrefix
    }

    if (media !== undefined) {
      context.media = media
    }

    if (jss) {
      context.jss = jss
    }

    if (disableStylesGeneration !== undefined) {
      context.disableStylesGeneration = disableStylesGeneration
    }

    if (prevContext && shallowEqualObjects(prevContext, context)) {
      return prevContext
    }

    return context
  }

  prevContext: Context

  generateId: ?GenerateId

  registry: ?SheetsRegistry

  renderProvider: Context => React.Node = parentContext => {
    const {children} = this.props
    const context: Context = this.createContext(parentContext, this.prevContext)
    this.prevContext = context
    return <JssContext.Provider value={context}>{children}</JssContext.Provider>
  }

  render(): React.Node {
    return <JssContext.Consumer>{this.renderProvider}</JssContext.Consumer>
  }
}

export default (JssProvider: typeof JssProvider)
