// @flow
import defaultJss, {SheetsRegistry, type Jss, type StyleSheet, type StyleRule} from 'jss'

type Options = {
  jss?: Jss,
  name?: string,
  sheet?: StyleSheet,
  registry?: SheetsRegistry
}

export const sheetsRegistry = new SheetsRegistry()
const stylesheets = new WeakMap()

function getStyleSheet(jss: Jss, sheetOptions): StyleSheet {
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

  // Save the stylesheet for other keyframes with the same jss instance
  stylesheets.set(jss, stylesheet)

  // Add the sheet to the registry to keep track of
  sheetsRegistry.add(stylesheet)

  // Attach the stylesheet to the DOM
  stylesheet.attach()

  return stylesheet
}

export default function createKeyframes(keyframes: {}, options: Options = {}) {
  const {name = 'animation', jss = defaultJss, sheet, ...sheetOptions} = options
  const stylesheet = sheet || getStyleSheet(jss, sheetOptions)
  const keyframesName = jss.generateClassName((({key: name}: any): StyleRule), stylesheet)

  // Add the rule to the stylesheet with the uniquely generated name
  stylesheet.addRule(`@keyframes ${keyframesName}`, keyframes)

  return keyframesName
}
