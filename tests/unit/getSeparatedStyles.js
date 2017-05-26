import expect from 'expect.js'
import getSeparatedStyles from '../../src/utils/getSeparatedStyles'

describe('Unit: jss - getSeparatedStyles', () => {
  it('should extract separated styles', () => {
    const color = data => data.color
    const styles = {
      button: {
        float: 'left',
        margin: [5, 10],
        color,
        '@media screen': {
          width: null,
        },
        '@media print': {
          width: undefined,
          color
        },
        '& a': {
          color: 'red',
          '& b': {
            color
          }
        },
      },
      '@media': {
        button: {
          width: 2,
          color
        }
      },
      nested: {
        '& a': {
          color: 'red'
        }
      }
    }

    expect(getSeparatedStyles(styles)).to.eql({
      dynamicStyles: {
        button: {
          color,
          '@media print': {
            color
          },
          '& a': {
            '& b': {
              color
            }
          }
        },
        '@media': {
          button: {
            color
          }
        }
      },
      staticStyles: {
        button: {
          float: 'left',
          margin: [5, 10],
          '@media screen': {
            width: null,
          },
          '@media print': {
            width: undefined,
          },
          '& a': {
            color: 'red',
          }
        },
        '@media': {
          button: {
            width: 2,
          }
        },
        nested: {
          '& a': {
            color: 'red'
          }
        }
      }
    })
  })
})
