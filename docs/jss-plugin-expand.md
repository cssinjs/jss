## Better syntax for complex properties

This plugin makes complex properties like `box-shadow: 2px 2px 2px 1px gold;` easier to read and to remember.

```javascript
const styles = {
  container: {
    border: {
      color: 'black',
      width: 1,
      style: 'solid'
    }
  }
}
```

compiles to:

```css
.container {
  border: 1px solid black;
}
```

### Using arrays for space separated values.

```javascript
const styles = {
  container: {
    padding: [5, 10, 5],
    margin: [10, 5]
  }
}
```

compiles to

```css
.container {
  padding: 5px 10px 5px;
  margin: 10px 5px;
}
```

### Using arrays for multi-value properties.

```javascript
const styles = {
  container: {
    transition: [
      ['opacity', '200ms'],
      ['width', '300ms']
    ]
  }
}
```

compiles to:

```css
.container {
  transition: opacity 200ms, width 300ms;
}
```

### Use objects inside of arrays.

```javascript
const styles = {
  container: {
    transition: [
      {
        property: 'opacity',
        duration: '200ms'
      },
      {
        property: 'width',
        duration: '300ms'
      }
    ]
  }
}
```

compiles to:

```css
.container {
  transition: opacity 200ms, width 300ms;
}
```

### Fallbacks support

Expanded syntax has support for [fallbacks api](jss-syntax.md#fallbacks).

```javascript
const styles = {
  container: {
    button: {
      background: {
        image: 'linear-gradient(red, green)'
      },
      fallbacks: {
        background: {
          color: 'red',
          repeat: 'no-repeat',
          position: [0, 0]
        }
      }
    }
  }
}
```

compiles to:

```css
.container {
  background: red no-repeat 0 0;
  background: linear-gradient(red, green);
}
```

### Default unit support.

Now, using expanded arrays and objects syntax, you don't need to use quotes for the most numeric values! This is achieved in combination with [jss-plugin-default-unit](./jss-plugin-default-unit.md) plugin.

### Supported properties.

- `backgroundSize`
- `backgroundPosition`
- `border`
- `borderBottom`
- `borderLeft`
- `borderTop`
- `borderRight`
- `borderRadius`
- `borderImage`
- `borderWidth`
- `borderStyle`
- `borderColor`
- `boxShadow`
- `flex`
- `margin`
- `padding`
- `outline`
- `transformOrigin`
- `transform`
- `transition`

```javascript
const styles = {
  container: {
    padding: {
      top: 10 // Props right, bottom, left will get 0 as defaults, as opposite to `padding: 10px`.
    }
  }
}
```

compiles to:

```css
.container {
  padding: 10px 0 0 0;
}
```

#### padding

```javascript
const styles = {
  container: {
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
}
```

#### margin

```javascript
const styles = {
  container: {
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
}
```

#### font

```javascript
const styles = {
  container: {
    font: {
      style: null,
      variant: null,
      weight: null,
      stretch: null,
      size: null,
      family: null,
      lineHeight: null
    }
  }
}
```

#### background

Unlike pure CSS, `background-size` property can be written inside common `background` property.

```javascript
const styles = {
  container: {
    background: {
      attachment: null,
      color: null,
      image: null,
      position: null, // Accepts array notation (e.g., `[0, 0]`, `['center', 'top']`)
      repeat: null,
      size: null // Accepts array notation (e.g., `['100%', '50%']`) and keywords (`contain`, `cover`)
    }
  }
}
```

#### border

Same goes for `borderTop`, `borderRight`, `borderBottom`, `borderLeft`.

Unlike pure CSS, `border-radius` property can be written inside common `border` property.

```javascript
const styles = {
  container: {
    border: {
      width: null,
      style: null,
      color: null
    }
  }
}
```

#### outline

```javascript
const styles = {
  container: {
    outline: {
      width: null,
      style: null,
      color: null
    }
  }
}
```

#### listStyle

```javascript
const styles = {
  container: {
    listStyle: {
      type: null,
      position: null,
      image: null
    }
  }
}
```

#### transition

```javascript
const styles = {
  container: {
    transition: {
      property: null,
      duration: null,
      timingFunction: null,
      delay: null
    }
  }
}
```

#### animation

```javascript
const styles = {
  container: {
    animation: {
      name: null,
      duration: null,
      timingFunction: null,
      delay: null,
      iterationCount: null,
      direction: null,
      fillMode: null,
      playState: null
    }
  }
}
```

#### boxShadow

```javascript
const styles = {
  container: {
    boxShadow: {
      x: 0,
      y: 0,
      blur: null,
      spread: null,
      color: null,
      inset: null // If you want to add inset you need to write "inset: 'inset'"
    }
  }
}
```

#### textShadow

```javascript
const styles = {
  container: {
    textShadow: {
      x: 0,
      y: 0,
      blur: null,
      color: null
    }
  }
}
```

#### flex

```javascript
const styles = {
  container: {
    flex: {
      basis: null,
      direction: null,
      flow: null,
      grow: null,
      shrink: null,
      wrap: null
    }
  }
}
```

#### align

```javascript
const styles = {
  container: {
    align: {
      self: null,
      items: null,
      content: null
    }
  }
}
```

#### grid

```javascript
const styles = {
  container: {
    grid: {
      templateColumns: null,
      templateRows: null,
      templateAreas: null,
      template: null,
      autoColumns: null,
      autoRows: null,
      autoFlow: null,
      column: null,
      rowStart: null,
      rowEnd: null,
      columnStart: null,
      columnEnd: null,
      area: null,
      gap: null,
      rowGap: null,
      columnGap: null
    }
  }
}
```

### Demo

[CodeSandbox](//codesandbox.io/s/github/cssinjs/jss/tree/master/examples/plugins/jss-plugin-expand?fontsize=14)
