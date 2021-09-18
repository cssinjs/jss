# Using TypeScript with React-JSS

React-JSS enables you to supply types for your `ruleNames`, `props`/`data`, and `theme` both explicitly and implicitly.

## Explicit Typing

```tsx
// Define Component
type RuleNames = 'myButton' | 'myLabel'

interface ButtonProps {
  children?: React.ReactNode
  spacing?: number
  fontWeight?: string
  labelColor?: string
}

interface CustomTheme {
  background: string
}

const useStyles = createUseStyles<RuleNames, ButtonProps, CustomTheme>({
  myButton: {
    padding: ({spacing}) => spacing || 10
  },
  myLabel: ({theme, ...props}) => ({
    display: 'block',
    color: props.labelColor || 'red',
    fontWeight: props.fontWeight || 'bold',
    backgroundColor: theme.background || 'gray'
  })
})

function Button({children, ...props}: ButtonProps): React.ReactElement {
  const theme = useTheme<CustomTheme>()
  const classes = useStyles({...props, theme})

  return (
    <button className={classes.myButton}>
      <span className={classes.myLabel}>{children}</span>
    </button>
  )
}

// Create App
const theme = {background: 'black'}

function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <Button fontWeight="bold">Submit</Button>
    </ThemeProvider>
  )
}
```

You only need to supply as much type information as you need. For instance, if you aren't using a `Theme`, then you don't need to supply a type for it. You'll notice that if you want to supply types for `Props` or `Theme`, you'll have to supply the type for `RuleNames` first. This means that if you want autocomplete for the `classes` that come from `useStyles`, you'll need to explicitly provide the strings you'll be using. This restriction is due to a limitation in TypeScript [that will hopefully get resolved soon](https://github.com/microsoft/TypeScript/pull/26349). However, you can see the next section for a workaround.

## Implicit Typing

If you want to provide `Props` and/or `Theme` types without having to supply the `RuleNames` type, you can make TypeScript infer the types implicitly. The primary benefit of doing this is that you'll get autocomplete on `classes` _in addition to_ your props/theme without having to duplicate your rule names. There are two approaches:

Using the functional variant...

```tsx
const useStyles = createUseStyles((theme: CustomTheme) => ({
  myButton: {
    padding: (props: ButtonProps) => props.spacing || 10
  },
  myLabel: (props) => ({
    display: 'block',
    color: props.labelColor || 'red',
    fontWeight: props.fontWeight || 'bold',
    backgroundColor: theme.background || 'gray'
  })
}))
```

Or using the object variant...

```tsx
const useStyles = createUseStyles({
  myLabel: ({theme, ...props}: ButtonProps & {theme: CustomTheme}) => ({
    display: 'block',
    color: props.labelColor || 'red',
    fontWeight: props.fontWeight || 'bold',
    backgroundColor: theme.background || 'gray'
  }),
  myButton: {
    padding: (props) => props.spacing || 10
  }
})
```

Note that because of how TS implicitly determines types, there are some restrictions here:

- For the functional variant, the `Theme` type _must_ be supplied with the `theme` argument to register its type. The `Props` type can be specified at any level in the object tree, but the first occurence of a data function _must_ provide the prop types.
- For the object variant, both the `Theme` type _and_ the `Props` type _must_ be provided in the first occurence of a data function. Additionally, this data function must be defined at the rule name level of the object. Due to both of these restrictions, you'll notice that the `myLabel` definition was moved above `myButton` in the object variant example.

In both cases, the types only need to be supplied _once_ for TS to infer everything, as shown in the examples above. And again, you only need to define the types you choose to use.

## Defining a Global Default Theme

If `CustomTheme` is the same across your entire application, you can define a default theme for React-JSS to use by creating a file called `global.d.ts` anywhere in the project:

```typescript
// global.d.ts

declare global {
  namespace Jss {
    export interface Thme {
      background: string
    }
  }
}

export {}
```

This enables React-JSS to rely on a default `Theme` type, removing the need to explicitly provide a type to `createUseStyles`. This file does not need to be imported anywhere; it is automatically acknowledged by TypeScript and/or VSCode's TypeScript Server.
