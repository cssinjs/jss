// @flow
import expect from 'expect.js'
import getDynamicStyles from './getDynamicStyles'

describe('react-jss: merge-classes', () => {
  it('should extract dynamic styles', () => {
    const color = data => data.color
    const styles = {
      button: {
        float: 'left',
        margin: [5, 10],
        color,
        '@media screen': {
          width: null
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
        }
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
    expect(getDynamicStyles(styles)).to.eql({
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
    })
  })

  it('should return null if there are no function values', () => {
    const styles = {
      button: {
        float: 'left'
      },
      '@media': {
        button: {
          width: 2
        }
      }
    }
    expect(getDynamicStyles(styles)).to.be(undefined)
  })
})
