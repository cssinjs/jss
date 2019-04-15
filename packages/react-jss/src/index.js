// @flow
import withStyles from './withStyles'
import createUseStyles from './createUseStyles'

export {ThemeProvider, withTheme, createTheming} from 'theming'
export {default as JssProvider} from './JssProvider'
export {default as jss} from './jss'
export {SheetsRegistry, createGenerateId} from 'jss'
export {default as JssContext} from './JssContext'

export {withStyles, createUseStyles}

// Kept for backwards compatibility
export default withStyles
