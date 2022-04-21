/* eslint-disable react/prop-types */

import * as React from 'react'
import {shallowEqualObjects} from 'shallow-equal'
import {createGenerateId} from 'jss'
import JssContext from './JssContext'

const initialContext = {}

export default function JssProvider(props) {
  const managersRef = React.useRef({})
  const prevContextRef = React.useRef()
  const registryRef = React.useRef(null)

  const createContext = (parentContext, prevContext = initialContext) => {
    const {registry, classNamePrefix, jss, generateId, disableStylesGeneration, media, id, isSSR} =
      props

    const context = {...parentContext}

    if (registry) {
      context.registry = registry

      // This way we identify a new request on the server, because user will create
      // a new Registry instance for each.
      if (registry !== registryRef.current) {
        // We reset managers because we have to regenerate all sheets for the new request.
        managersRef.current = {}
        registryRef.current = registry
      }
    }

    context.managers = managersRef.current

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

    if (isSSR !== undefined) {
      context.isSSR = isSSR
    }

    if (prevContext && shallowEqualObjects(prevContext, context)) {
      return prevContext
    }

    return context
  }

  const renderProvider = (parentContext) => {
    const {children} = props
    const context = createContext(parentContext, prevContextRef.current)
    prevContextRef.current = context
    return <JssContext.Provider value={context}>{children}</JssContext.Provider>
  }

  return <JssContext.Consumer>{renderProvider}</JssContext.Consumer>
}
