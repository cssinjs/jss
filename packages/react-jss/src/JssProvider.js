// @flow
import React, {Component, type Node} from 'react'
import PropTypes from 'prop-types'
import defaultJss, {createGenerateId, type Jss, type GenerateId, SheetsRegistry} from 'jss'
import type {Context, Managers} from './types'
import JssContext from './JssContext'
import memoize from './memoize-one'

/* eslint-disable react/require-default-props, react/no-unused-prop-types */

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

  createContext = memoize(
    (outerContext: Context, props: Props): Context => {
      const {registry, classNamePrefix, jss, generateId, disableStylesGeneration, media} = props
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

      context.managers = this.managers

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
  )

  generateId: ?GenerateId

  registry: ?SheetsRegistry

  renderProvider = (outerContext: Context) => {
    const {children} = this.props
    // $FlowFixMe
    const context: Context = this.createContext(outerContext, this.props)

    return <JssContext.Provider value={context}>{children}</JssContext.Provider>
  }

  render() {
    return <JssContext.Consumer>{this.renderProvider}</JssContext.Consumer>
  }
}
