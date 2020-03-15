import jss from './jss'
import * as theme from './theme'
import yarn from './yarn'
import upperBody from './upperBody'
import lowerBody from './lowerBody'
import sheet from './globalStyles'

const styles = {
  root: {
    width: '100%',
    height: '100%',
    animation: `${sheet.keyframes.bob} ${theme.duration} ${theme.easing} infinite both`
  },
  scene: {
    top: '10rem',
    left: 'calc(50% - 2.5rem)',
    position: 'absolute',
    width: '5rem',
    height: '5rem',
    transformOrigin: 'center -20rem',
    animation: `${sheet.keyframes.swing} ${theme.duration} ${theme.easing} infinite both`,
    '&:before': {
      content: '""',
      height: '20rem',
      width: 2,
      backgroundColor: theme.colorYarn,
      left: 'calc(50% - 1px)',
      bottom: '20rem'
    }
  },
  catWrap: {
    position: 'absolute',
    top: 0,
    left: 'calc(50% - 45px)',
    width: 90,
    height: 130,
    animation: `${sheet.keyframes['reverse-swing']} ${theme.duration} ${theme.easing} infinite both`,
    transformOrigin: 'top center'
  },
  cat: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    animation: `${sheet.keyframes.swing} ${theme.duration} .2s infinite both`,
    transformOrigin: 'top center'
  }
}
const {classes} = jss.createStyleSheet(styles).attach()

export default () => {
  const root = document.createElement('div')
  root.className = classes.root

  root.innerHTML = `
    <div class=${classes.scene}>
      ${yarn()}
      <div class=${classes.catWrap}>
        <div class=${classes.cat}>
          ${upperBody()}
          ${lowerBody()}
        </div>
      </div>
    </div>
  `
  return root
}
