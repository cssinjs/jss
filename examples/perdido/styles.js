import perdido from 'perdido'

const blockMar = 30

export default {
  '@global': {
    '*, *:after, *:before': {
      boxSizing: 'border-box',
      padding: 0,
      margin: 0
    },

    html: {
      fontWeight: 'bold',
      color: '#FFFFFF',
      padding: blockMar,
      height: 'auto',
      overflowY: 'scroll',
      overflowX: 'hidden'
    },

    body: {
      width: '100%',
      overflowX: 'hidden',
      margin: 0,
      '*zoom': 1,

      '&:after, :before': {
        content: '""',
        display: 'table'
      },

      '&:after': {
        clear: 'both'
      }
    },

    'section:last-of-type': {
      marginBottom: 0
    }
  },
  // Header
  awesomeHeader: {
    textAlign: 'center',
    marginTop: 20
  },

  // Description
  coolDescription: {
    fontWeight: 'bold'
  },
  // Grid examples

  centerSections: {
    extend: perdido.center('1140px'),
    marginTop: blockMar,
    marginBottom: blockMar
  },

  purdyArticles: {
    height: 100,
    lineHeight: '100px',
    textAlign: 'center',
    marginTop: blockMar / 2,
    marginBottom: blockMar / 2,

    '& article': {
      marginTop: 0,
      marginBottom: 0
    }
  },

  // Simple 1/4
  fourUp: {
    background: '#FD7442',
    '& article': {
      background: '#FD5C22',
      extend: perdido.column('1/1')
    }
  },

  // Offset
  offset: {
    background: '#BA6D66',
    '& article': {
      background: '#B15A52',
      extend: perdido.column('1/3'),
      '&:first-child': {
        extend: perdido.offset('1/3')
      }
    }
  },

  // Nesting
  nested: {
    background: '#B18EA2',
    '& article': {
      extend: perdido.column('1/3'),
      background: '#A47B92',

      '& article': {
        extend: perdido.column('1/2'),
        background: '#976883'
      }
    }
  },

  // Alignment
  aligned: {
    extend: perdido.align('center'),
    background: '#D1EFF0',
    height: 300,
    '& article': {
      extend: perdido.column('1/3'),
      background: '#AFE3E5',
      marginTop: 0,
      marginBottom: 0
    }
  },

  // Cycle
  cycled: {
    background: '#3E95F1',

    '& article': {
      extend: perdido.column('2/8', {cycle: 4}),
      height: 'auto',
      lineHeight: '25px',
      fontWeight: 'normal',
      padding: blockMar / 2,
      background: '#2285EF'
    }
  },

  // Vertical Grid
  vertical: {
    background: '#FF8F1E',

    '& article': {
      extend: perdido.row('1/3'),
      marginTop: 0,
      background: '#FF8001',
      padding: 30
    }
  },

  // Waffle Grid
  mmmWaffles: {
    background: '#47E3FF',

    '& article': {
      background: '#26DEFF',
      extend: perdido.waffle('1/3'),
      marginTop: 0,
      lineHeight: 'inherit',
      padding: blockMar
    }
  },

  // Varying Sizes
  diffSizes: {
    background: '#FF0080',

    '& article': {
      background: '#E60073',

      '&:first-child': {
        extend: perdido.column('1/3')
      },
      '&:last-child': {
        extend: perdido.column('2/3')
      }
    }
  },

  // Source Ordering
  reordered: {
    background: '#A0615F',

    '& article': {
      background: '#905856',
      extend: perdido.column('1/2')
    }
  },

  // Media Queries
  '@media (min-width: 500px)': {
    fourUp: {
      '& article': {
        extend: perdido.column('1/2')
      }
    }
  },

  '@media (min-width: 800px)': {
    fourUp: {
      '& article': {
        extend: perdido.column('1/3')
      }
    },
    reordered: {
      '& article': {
        '&:first-child': {
          extend: perdido.move('1/2')
        },
        '&:last-child': {
          extend: perdido.move('-1/2')
        }
      }
    }
  },

  '@media (min-width: 1100px)': {
    fourUp: {
      '& article': {
        extend: perdido.column('1/4')
      }
    }
  }
}
