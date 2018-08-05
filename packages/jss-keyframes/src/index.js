// @flow
import defaultJss, {SheetsRegistry, type Jss} from 'jss'
import warning from 'warning'

type Options = {
  jss?: Jss,
  name?: string
}

let counter = 0
const registry = new SheetsRegistry()
const stylesheets = new WeakMap()

function getStyleSheet(jss: Jss) {
  const existingStylesheet = stylesheets.get(jss)

  if (existingStylesheet) {
    return existingStylesheet
  }

  const stylesheet = jss.createStyleSheet({}, {meta: 'JSS Keyframes'})

  stylesheets.set(jss, stylesheet)

  registry.add(stylesheet)

  stylesheet.attach()

  return stylesheet
}

export function getAllSheets() {
  return registry
}

export default function createKeyframes(keyframes: {}, options: Options = {}) {
  counter++

  warning(
    counter <= 10000,
    'You might have a memory leak because the keyframes counter grew up to 10000'
  )

  const {name = 'animation', jss = defaultJss} = options
  const keyframesName = process.env.NODE_ENV === 'production' ? `c${counter}` : `${name}-${counter}`
  const stylesheet = getStyleSheet(jss)

  // Add the rule to the stylesheet with the uniquely generated name
  stylesheet.addRule(`@keyframes ${keyframesName}`, keyframes)

  return keyframesName
}
