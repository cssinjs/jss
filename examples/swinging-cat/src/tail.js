import jss from './jss'
import * as theme from './theme'
import sheet from './globalStyles'

const styles = {
  catTail: {
    position: 'absolute',
    height: 15,
    width: 10,
    animation: `${sheet.keyframes['swing-tail']} ${theme.duration} ${theme.easing} infinite both`,
    transformOrigin: 'top center',
    zIndex: 0,
    backgroundImage: `linear-gradient(to right, #fff, ${theme.colorFurLight}, ${theme.colorFurDark})`,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  catTailNotFirst: {
    top: '50%'
  },
  catTailFirst: {
    left: 'calc(50% - 5px)',
    top: '95%'
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

export default () => {
  let tail = `<div class="${classes.catTail} ${classes.catTailFirst}">`
  for (let t = 0; t <= 15; t++) {
    tail += `<div class="${classes.catTail} ${classes.catTailNotFirst}">`
  }
  for (let t = 0; t <= 15; t++) {
    tail += '</div>'
  }
  tail += '</div>'
  return tail
}
