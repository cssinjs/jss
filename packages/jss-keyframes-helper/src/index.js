// @flow
import defaultJss, {SheetsRegistry, type Jss, type StyleSheet, type StyleRule} from 'jss'

type Options = {
  jss?: Jss,
  name?: string,
  sheet?: StyleSheet,
  registry?: SheetsRegistry
}

let sheetsRegistry = null
const stylesheets = new WeakMap()

function getStyleSheet(jss: Jss, registry: SheetsRegistry | null, sheetOptions): StyleSheet {
  const existingStylesheet = stylesheets.get(jss)

  if (existingStylesheet) {
    return existingStylesheet
  }

  const stylesheet = jss.createStyleSheet(
    {},
    {
      meta: 'JSS Keyframes',
      ...sheetOptions
    }
  )

  stylesheets.set(jss, stylesheet)

  if (registry !== null) {
    registry.add(stylesheet)
  }

  stylesheet.attach()

  return stylesheet
}

export function setRegistry(registry: SheetsRegistry | null) {
  sheetsRegistry = registry
}

export default function createKeyframes(keyframes: {}, options: Options = {}) {
  const {
    name = 'animation',
    jss = defaultJss,
    registry = sheetsRegistry,
    sheet,
    ...sheetOptions
  } = options
  const stylesheet = sheet || getStyleSheet(jss, registry, sheetOptions)
  const keyframesName = jss.generateClassName((({key: name}: any): StyleRule), stylesheet)

  // Add the rule to the stylesheet with the uniquely generated name
  stylesheet.addRule(`@keyframes ${keyframesName}`, keyframes)

  return keyframesName
}
