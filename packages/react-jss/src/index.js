// @flow
import {withStyles} from './hoc'
import {createUseStyles} from './hook'

export {ThemeProvider, withTheme, createTheming} from 'theming'
export {JssProvider} from './JssProvider'
export {jss} from './jss'
export {SheetsRegistry, createGenerateId} from 'jss'
export {JssContext} from './JssContext'

export {withStyles, createUseStyles}

// Kept for backwards compatibility
export default withStyles
