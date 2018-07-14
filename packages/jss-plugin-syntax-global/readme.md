# Global Styles for JSS

If you want to write regular globally scoped CSS with JSS, this plugin is for you. Don't use it if you can avoid it.

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/cssinjs/lobby)

## Top level global declarations block

```javascript
const styles = {
  '@global': {
    body: {
      color: 'green'
    },
    a: {
      textDecoration: 'underline'
    }
  }
}
```

## Top level global prefix

```javascript
const styles = {
  '@global body': {
    color: 'green'
  }
}
```

## Nested global declarations block

```javascript
const styles = {
  button: {
    float: 'left',
    '@global': {
      span: {color: 'red'}
    }
  }
}
```

## Nested global prefix

```javascript
const styles = {
  button: {
    float: 'left',
    '@global span': {color: 'red'}
  }
}
```

## Issues

File a bug against [cssinjs/jss prefixed with \[jss-global\]](https://github.com/cssinjs/jss/issues/new?title=[jss-global]%20).

## Run tests

```bash
npm i
npm run test
```

## License

MIT
