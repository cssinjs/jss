import {MinimalObservable, Styles} from '../../src'

interface Props {
  flag?: boolean
}

interface Theme {
  color: string
}

declare const color$: MinimalObservable<'cyan'>
declare const style$: MinimalObservable<{
  backgroundColor: 'fuchsia'
  transform: 'translate(0px, 205px)'
}>

// General Types Check
const styles: Styles<string, Props> = {
  basic: {
    textAlign: 'center',
    display: 'flex',
    width: 500,
    justifyContent: 'center'
  },
  property: {
    textAlign: 'center',
    display: 'flex',
    width: '100%',
    justifyContent: (props) => (props.flag ? 'center' : undefined)
  },
  inner: {
    textAlign: 'center',
    display: 'flex',
    width: '100%',

    '&.foo': {
      fontSize: 12
    }
  },
  func: (props) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '96px',
    cursor: 'pointer',
    position: 'relative',
    pointerEvents: props.flag ? 'none' : null
  }),
  funcNull: (props) => null,
  funcWithTerm: (props) => ({
    width: props.flag ? 377 : 272,
    height: props.flag ? 330 : 400,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
    position: 'relative',
    color: '#222222',
    background: '#fff',
    animation: '$fadeIn 300ms ease-in-out 300ms both',
    ...(props.flag && {
      height: 288
    })
  }),
  observable: style$,
  observableRule: {
    backgroundColor: color$,
    color: 'lime'
  },
  '@keyframes fadeIn': {
    from: {opacity: 0},
    to: {opacity: 1},
    '50%': {opacity: 0.5}
  }
}

// Test supplied Props and Theme
// Verify that nested parameter declarations are banned
const stylesPropsAndTheme: Styles<string, Props, Theme> = {
  // @ts-expect-error Did you mean to call this expression?
  rootParamDeclaration: ({flag, theme}: Props & {theme: Theme}) => ({
    fontWeight: 'bold',
    color: ({flag, theme}: Props & {theme: Theme}) => 'red'
  })
}

// Test the className types
const stylesClassNames: Styles<number, unknown, unknown> = {
  // @ts-expect-error
  stringClassName: '',
  [1]: '',
  [2]: ''
}
