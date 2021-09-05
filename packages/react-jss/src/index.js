import withStyles from './withStyles'

export {ThemeProvider, withTheme, createTheming, useTheme} from 'theming'
export {default as createUseStyles} from './createUseStyles'
export {default as JssProvider} from './JssProvider'
export {default as jss} from './jss'
export {SheetsRegistry, createGenerateId} from 'jss'
export {default as JssContext} from './JssContext'
export {default as styled} from './styled'
export {default as jsx, create as createJsx} from './jsx'
export {withStyles}

// Kept for backwards compatibility.
export default withStyles
