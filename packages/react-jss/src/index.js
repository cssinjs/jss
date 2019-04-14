// @flow
import {withStyles} from './with-styles'
import {createUseStyles} from './create-use-styles'

export {ThemeProvider, withTheme, createTheming} from 'theming'
export {JssProvider} from './JssProvider'
export {jss} from './jss'
export {SheetsRegistry, createGenerateId} from 'jss'
export {JssContext} from './JssContext'

export {withStyles, createUseStyles}

// Kept for backwards compatibility
export default withStyles
