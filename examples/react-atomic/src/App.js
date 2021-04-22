import {createUseStyles, jss} from 'react-jss'
import AtomicDomRenderer from 'jss-atomic-dom-renderer'

console.log('jss', jss, AtomicDomRenderer)

jss.setup({
  Renderer: AtomicDomRenderer
})

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const useStyles = createUseStyles({
  helloA: {
    color: 'red',
    display: 'flex'
  },
  helloB: {
    color: 'red'
  }
})

function HelloA() {
  const classes = useStyles()
  return <span className={classes.helloA}>Hello form A</span>
}

function HelloB() {
  const classes = useStyles()
  return <span className={classes.helloA}>Hello form B</span>
}

function App() {
  return (
    <div className="App">
      <HelloA />
      <br />
      <HelloB />
    </div>
  )
}

export default App
