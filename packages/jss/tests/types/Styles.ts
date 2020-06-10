import {Styles} from '../../src'

interface Props {
  flag?: boolean
}

const styles: Styles = {
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
    justifyContent: (props: Props) => (props.flag ? 'center' : undefined)
  },
  inner: {
    textAlign: 'center',
    display: 'flex',
    width: '100%',

    '&.foo': {
      fontSize: 12
    }
  },
  func: (props: Props) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '96px',
    cursor: 'pointer',
    position: 'relative',
    pointerEvents: props.flag ? 'none' : null
  }),
  funcNull: (props: Props) => null,
  funcWithTerm: (props: Props) => ({
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
  '@keyframes fadeIn': {
    from: {opacity: 0},
    to: {opacity: 1}
  }
}
