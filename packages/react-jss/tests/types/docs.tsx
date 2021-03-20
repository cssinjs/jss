import React from 'react'
import {createUseStyles, useTheme, ThemeProvider} from 'react-jss'

/* -------------------- EXPLICIT EXAMPLE -------------------- */
// Define Component
type RuleNames = 'myButton' | 'myLabel'

interface ButtonProps {
  children?: React.ReactNode
  spacing?: number
  fontWeight?: string
  labelColor?: string
}

interface CustomTheme {
  background: string
}

const useStyles = createUseStyles<RuleNames, ButtonProps, CustomTheme>({
  myButton: {
    padding: ({spacing}) => spacing || 10
  },
  myLabel: ({theme, ...props}) => ({
    display: 'block',
    color: props.labelColor || 'red',
    fontWeight: props.fontWeight || 'bold',
    backgroundColor: theme.background || 'gray'
  })
})

function Button({children, ...props}: ButtonProps): React.ReactElement {
  const theme = useTheme<CustomTheme>()
  const classes = useStyles({...props, theme})

  return (
    <button className={classes.myButton}>
      <span className={classes.myLabel}>{children}</span>
    </button>
  )
}

// Create App
const theme = {background: 'black'}

function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <Button fontWeight="bold">Submit</Button>
    </ThemeProvider>
  )
}

/* -------------------- IMPLICIT EXAMPLES -------------------- */
// Note: `Theme` must be typed by the `theme` argument. And the
// first occurence of a data function must provide `Props`.
const useStylesImplicitFunc = createUseStyles((theme: CustomTheme) => ({
  myButton: {
    padding: (props: ButtonProps) => props.spacing || 10
  },
  myLabel: props => ({
    display: 'block',
    color: props.labelColor || 'red',
    fontWeight: props.fontWeight || 'bold',
    backgroundColor: theme.background || 'gray'
  })
}))

// Note: First occurence of data function must provide `Props` and `Theme`.
// It must also be defined at the `RuleNames` level.
const useStylesImplicitObj = createUseStyles({
  myLabel: ({theme, ...props}: ButtonProps & {theme: CustomTheme}) => ({
    display: 'block',
    color: props.labelColor || 'red',
    fontWeight: props.fontWeight || 'bold',
    backgroundColor: theme.background || 'gray'
  }),
  myButton: {
    padding: props => props.spacing || 10
  }
})
