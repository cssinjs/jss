export default {
  event: {
    position: 'absolute',
    background: '#fff',
    borderLeft: '4px solid #4b6ea8',
    boxSizing: 'border-box'
  },
  content: {
    padding: 7,
    overflow: 'hidden',
    height: '100%',
    border: '1px solid #d5d5d5',
    borderLeft: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#4b6ea8'
    }
  },
  title: {
    color: '#4b6ea8',
    margin: 0,
    fontSize: '1em'
  },
  location: {
    fontSize: '0.8em'
  },
  '@media (max-width: 600px)': {
    event: {
      borderColor: 'green'
    },
    content: {
      '&:hover': {
        borderColor: 'green'
      }
    },
    title: {
      color: 'green'
    }
  }
}
