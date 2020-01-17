import jss from './jss'

const styles = {
  catEar: {
    width: 20,
    height: '100%',
    position: 'absolute',
    borderRadius: 5,
    top: -10,
    '&:before': {
      content: '""',
      width: '60%',
      height: '100%',
      top: 10,
      position: 'absolute',
      backgroundColor: '#fff'
    },
    '&:first-child': {
      left: 0,
      transformOrigin: 'top left',
      transform: 'skewY(40deg)',
      backgroundColor: '#fff',
      '&:before': {
        content: '""',
        left: 0,
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
        backgroundColor: '#D7EBFB'
      }
    },
    '&:last-child': {
      right: 0,
      transformOrigin: 'top right',
      transform: 'skewY(-40deg)',
      backgroundColor: '#d1e6f7',
      '&:before': {
        content: '""',
        right: 0,
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
        backgroundColor: '#e0f0fc'
      }
    }
  }
}

const {classes} = jss.createStyleSheet(styles).attach()

export default () => `<div class=${classes.catEar}></div>`
