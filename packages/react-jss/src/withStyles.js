// @flow
import React, {Component, type ComponentType, type Node} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {getDynamicStyles, SheetsManager, type StyleSheet} from 'jss'
import {ThemeContext} from 'theming'
import warning from 'tiny-warning'

import type {HOCProps, Options, Styles, InnerProps, DynamicRules} from './types'
import getDisplayName from './getDisplayName'
import memoize from './memoize-one'
import mergeClasses from './merge-classes'
import defaultJss from './jss'
import JssContext from './JssContext'

interface State {
  dynamicRules?: ?DynamicRules;
  sheet?: StyleSheet;
  classes: {};
}

/**
 * Global index counter to preserve source order.
 * As we create the style sheet during componentWillMount lifecycle,
 * children are handled after the parents, so the order of style elements would
 * be parent->child. It is a problem though when a parent passes a className
 * which needs to override any childs styles. StyleSheet of the child has a higher
 * specificity, because of the source order.
 * So our solution is to render sheets them in the reverse order child->sheet, so
 * that parent has a higher specificity.
 */
let indexCounter = -Number.MAX_SAFE_INTEGER

let managersCounter = 0

const NoRenderer = (props: {children?: Node}) => props.children || null

const sheetsMeta = new WeakMap()

const getStyles = <Theme: {}>(styles: Styles<Theme>, theme: Theme, displayName: string) => {
  if (typeof styles !== 'function') {
    return styles
  }
  warning(
    styles.length !== 0,
    `[JSS] <${displayName} />'s styles function doesn't rely on the "theme" argument. We recommend declaring styles as an object instead.`
  )

  return styles(theme)
}

const getSheetClasses = (sheet, dynamicRules: ?DynamicRules) => {
  if (!dynamicRules) {
    return sheet.classes
  }

  const classes = {}
  const meta = sheetsMeta.get(sheet)

  if (!meta) {
    return sheet.classes
  }

  for (const key in meta.themedStyles) {
    classes[key] = sheet.classes[key]

    if (key in dynamicRules) {
      classes[key] += ` ${sheet.classes[dynamicRules[key].key]}`
    }
  }

  return classes
}

const updateDynamicRules = <Theme, Props>(
  props: HOCProps<Theme, Props>,
  {dynamicRules, sheet}: State
) => {
  if (!sheet) {
    return
  }

  // Loop over each dynamic rule and update it
  // We can't just update the whole sheet as this has all of the rules for every component instance
  for (const key in dynamicRules) {
    // $FlowFixMe: Not sure why it throws an error here
    sheet.update(dynamicRules[key].key, props)
  }
}

const removeDynamicRules = ({dynamicRules, sheet}: State) => {
  if (!sheet) {
    return
  }

  // Loop over each dynamic rule and remove the dynamic rule
  // We can't just remove the whole sheet as this has all of the rules for every component instance
  for (const key in dynamicRules) {
    sheet.deleteRule(dynamicRules[key].key)
  }
}

const addDynamicStyles = (sheet: StyleSheet): ?DynamicRules => {
  const meta = sheetsMeta.get(sheet)

  if (!meta) {
    return undefined
  }

  const rules: DynamicRules = {}

  // Loop over each dynamic rule and add it to the stylesheet
  for (const key in meta.dynamicStyles) {
    const name = `${key}-${meta.dynamicRuleCounter++}`
    const rule = sheet.addRule(name, meta.dynamicStyles[key])

    if (rule) {
      rules[key] = rule
    }
  }

  return rules
}

/**
 * HOC creator function that wrapps the user component.
 *
 * `withStyles(styles, [options])(Component)`
 */
export default function withStyles<Theme: {}, StylesOrFn: Styles<Theme>>(
  styles: StylesOrFn,
  options?: Options<Theme> = {}
) {
  const {index = indexCounter++, theming, injectTheme, jss: optionsJss, ...sheetOptions} = options
  const isThemingEnabled = typeof styles === 'function'
  const ThemeConsumer = (theming && theming.context.Consumer) || ThemeContext.Consumer

  return <Props: InnerProps>(
    InnerComponent: ComponentType<Props> = NoRenderer
  ): ComponentType<Props> => {
    const displayName = getDisplayName(InnerComponent)
    const defaultClassNamePrefix =
      process.env.NODE_ENV === 'production' ? '' : `${displayName.replace(/\s/g, '-')}-`
    const managerId = managersCounter++
    const manager = new SheetsManager()
    const noTheme = {}
    // $FlowFixMe
    const getTheme = (props: HOCProps<Theme, Props>): Theme =>
      isThemingEnabled && props.theme ? props.theme : noTheme

    class WithStyles extends Component<HOCProps<Theme, Props>, State> {
      static displayName = `WithStyles(${displayName})`

      // $FlowFixMe
      static defaultProps = {...InnerComponent.defaultProps}

      mergeClassesProp = memoize(
        (sheetClasses, classesProp) =>
          classesProp ? mergeClasses(sheetClasses, classesProp) : sheetClasses
      )

      constructor(props: HOCProps<Theme, Props>) {
        super(props)

        const {sheetOptions: contextSheetOptions} = props.jssContext

        this.classNamePrefix = (contextSheetOptions.classNamePrefix || '') + defaultClassNamePrefix

        this.state = this.createState()
        this.manage(props, this.state)
      }

      componentDidUpdate(prevProps: HOCProps<Theme, Props>, prevState: State) {
        updateDynamicRules(this.props, this.state)

        if (isThemingEnabled && this.props.theme !== prevProps.theme) {
          const newState = this.createState()
          this.manage(this.props, newState)
          this.unmanage(prevProps, prevState)

          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(newState)
        }
      }

      componentWillUnmount() {
        this.unmanage(this.props, this.state)
      }

      get jss() {
        return this.props.jssContext.jss || optionsJss || defaultJss
      }

      get manager(): SheetsManager {
        const {managers} = this.props.jssContext

        // If `managers` map is present in the context, we use it in order to
        // let JssProvider reset them when new response has to render server-side.
        if (managers) {
          if (!managers[managerId]) {
            managers[managerId] = new SheetsManager()
          }
          return managers[managerId]
        }

        return manager
      }

      getSheet(): StyleSheet {
        const theme = getTheme(this.props)
        let sheet = this.manager.get(theme)

        if (sheet) {
          return sheet
        }

        const themedStyles = getStyles(styles, theme, displayName)
        const dynamicStyles = getDynamicStyles(themedStyles)
        const contextSheetOptions = this.props.jssContext.sheetOptions
        sheet = this.jss.createStyleSheet(themedStyles, {
          ...sheetOptions,
          ...contextSheetOptions,
          index,
          meta: `${displayName}, ${isThemingEnabled ? 'Themed' : 'Unthemed'}`,
          classNamePrefix: this.classNamePrefix,
          link: dynamicStyles !== null
        })

        sheetsMeta.set(sheet, {
          dynamicStyles,
          themedStyles,
          dynamicRuleCounter: 0
        })

        this.manager.add(theme, sheet)

        return sheet
      }

      classNamePrefix: string

      manage(props, state) {
        const {sheet} = state
        const {registry} = props.jssContext

        if (!sheet) {
          return
        }

        updateDynamicRules(props, state)

        this.manager.manage(getTheme(props))
        if (registry) {
          registry.add(sheet)
        }
      }

      unmanage(props, state: State) {
        removeDynamicRules(state)

        this.manager.unmanage(getTheme(props))
      }

      createState(): State {
        if (this.props.jssContext.disableStylesGeneration) {
          return {classes: {}}
        }

        const sheet = this.getSheet()
        const dynamicRules = addDynamicStyles(sheet)

        return {
          sheet,
          // Those are dynamic rules which are used in this specific element only.
          dynamicRules,
          classes: getSheetClasses(sheet, dynamicRules)
        }
      }

      render() {
        const {innerRef, jssContext, theme, classes, ...rest} = this.props
        const {classes: sheetClasses} = this.state
        const props = {
          ...rest,
          classes: this.mergeClassesProp(sheetClasses, classes)
        }

        if (innerRef) props.ref = innerRef
        if (injectTheme) props.theme = theme

        return <InnerComponent {...props} />
      }
    }

    // $FlowFixMe: Sadly there is no support for forwardRef yet
    const JssContextSubscriber = React.forwardRef((props, ref) => (
      <JssContext.Consumer>
        {context => {
          if (isThemingEnabled || injectTheme) {
            return (
              <ThemeConsumer>
                {theme => (
                  <WithStyles innerRef={ref} theme={theme} {...props} jssContext={context} />
                )}
              </ThemeConsumer>
            )
          }

          return <WithStyles innerRef={ref} {...props} jssContext={context} />
        }}
      </JssContext.Consumer>
    ))

    JssContextSubscriber.displayName = 'JssContextSubscriber'
    JssContextSubscriber.InnerComponent = InnerComponent

    return hoistNonReactStatics(JssContextSubscriber, InnerComponent)
  }
}
