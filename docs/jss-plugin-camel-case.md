## Camel case syntax

After using this plugin, we can write CSS properties in camel case syntax.

```javascript
const styles = {
  button: {
    color: 'red',
    fontSize: '12px'
  }
}
```

Compiles to:

```css
.button-0 {
  color: red;
  font-size: 12px;
}
```
