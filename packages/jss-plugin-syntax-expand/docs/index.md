# Features

### Expanded properties.

A much more readable syntax and less repetitions compared to CSS.

```js
border: {
  color: 'black',
  width: 1,
  style: 'solid'
}
```
will output:

```css
border: 1px solid black;
```

See [properties section](#supported-properties) for more details.


### Using arrays for space separated properties.

```js
padding: [5, 10, 5],
margin: [10, 5]
```

will output

```css
padding: 5px 10px 5px;
margin: 10px 5px
```
Supported properties:
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

### Using arrays for multi value properties.

```js
transition: [
  ['opacity', '200ms'],
  ['width', '300ms']
]
```

will output

```css
transition: opacity 200ms, width 300ms;
```

### Use objects inside of arrays.

```js
transition: [{
    property: 'opacity',
    duration: '200ms'
  }, {
    property: 'width',
    duration: '300ms'
}]

```
will output:

```css
transition: opacity 200ms, width 300ms;
```

### Fallbacks are supported.

JSS has a [fallbacks api](https://github.com/cssinjs/jss/blob/master/docs/json-api.md#fallbacks) which is also supported.

```js
button: {
  background: {
    image: 'linear-gradient(red, green)'
  },
  fallbacks: {
    background: {
      color: 'red',
      repeat: 'no-repeat',
      position: [0 , 0]
    }
  }
}
```

will output:

```css
foo {
  background: red no-repeat 0 0;
  background: linear-gradient(red, green);
}
```

## Supported properties.

A list of all properties supported in expanded syntax and their corresponding defaults.


```js
padding: {
  top: 10 // Props right, bottom, left will get 0 as defaults, as opposite to `padding: 10px`.
}
```

Will output:

```css
padding: 10px 0 0 0;
```

### padding

```js
padding: {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}
```

### margin

```js
margin: {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}
```

### font

```js
font: {
  style: null,
  variant: null,
  weight: null,
  stretch: null,
  size: null,
  family: null,
  lineHeight: null
}
```

### background

Unlike pure CSS, `background-size` property can be written inside common `background` property.

```js
background: {
  attachment: null,
  color: null,
  image: null,
  position: null, // Accepts array notation (e.g., `[0, 0]`, `['center', 'top']`)
  repeat: null,
  size: null, // Accepts array notation (e.g., `['100%', '50%']`) and keywords (`contain`, `cover`)
}
```

### border

Same goes for `borderTop`, `borderRight`, `borderBottom`, `borderLeft`.

Unlike pure CSS, `border-radius` property can be written inside common `border` property.

```js
border: {
  width: null,
  style: null,
  color: null
}
```

### outline

```js
outline: {
  width: null,
  style: null,
  color: null
}
```

### listStyle

```js
listStyle: {
  type: null,
  position: null,
  image: null
}
```

### transition

```js
transition: {
  property: null,
  duration: null,
  timingFunction: null,
  delay: null
}
```

### animation

```js
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
```

### boxShadow

```js
boxShadow: {
  x: 0,
  y: 0,
  blur: null,
  spread: null,
  color: null,
  inset: null // If you want to add inset you need to write "inset: 'inset'"
}
```

### textShadow

```js
textShadow: {
  x: 0,
  y: 0,
  blur: null,
  color: null
}
```

### flex

```js
flex: {
  basis: null,
  direction: null,
  flow: null,
  grow: null,
  shrink: null,
  wrap: null
}
```

### align
```js
align: {
  self: null,
  items: null,
  content: null
}
```

### grid
```js
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
  columnGap: null,
},
```
