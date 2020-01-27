import conf from '../conf'

export default {
  canvas: {
    flex: 1,
    position: 'relative',
    height: conf.height,
    background: '#ececec',
    borderLeft: '1px solid #d5d5d5',
    boxSizing: 'border-box'
  },
  content: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 0,
    bottom: 0
  }
}
