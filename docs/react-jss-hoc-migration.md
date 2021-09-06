# Migrating the `withStyles` HOC

Although we recommend using the new hooks, it's possible that you have class components that cannot be migrated easily at this time. In that case, you can create your own higher order component (HOC) from the provided hooks. This way, you'll have a HOC that stays up-to-date with the latest features, and you'll still have the option of fully migrating to hooks at your own convenience.

A simple solution may look something like this:

```jsx
import React from 'react'
import {createUseStyles, useTheme} from 'react-jss'

/**
 * Creates a Higher Order Component that injects the CSS specified in `styles`.
 * @param styles
 */
function withStyles(styles) {
  return function(WrappedComponent) {
    const useStyles = createUseStyles(styles)

    const StyledComponent = props => {
      const {classes, ...passThroughProps} = props
      const theme = useTheme()
      const reactJssClasses = useStyles({...passThroughProps, theme})

      return <WrappedComponent {...passThroughProps} classes={reactJssClasses} />
    }

    StyledComponent.displayName = `withStyles(${WrappedComponent.name})`

    return StyledComponent
  }
}

export default withStyles
```

Note that `useTheme` can be excluded if your application is not using a theme.

To learn more about HOCs, see [react's documentation](https://reactjs.org/docs/higher-order-components.html). Since our HOC uses the `createUseStyles` hook under the hood, you can use the regular [hooks documentation](react-jss.md) for help with defining your `styles` objects.

**Warning**: Because this HOC makes use of hooks, it cannot be used as a decorator.

## Adding TypeScript to Your HOC

If you're using TypeScript, you'll likely want to add types for your custom `withStyles` HOC, like so:

```tsx
import React from 'react'
import {createUseStyles, useTheme, Styles} from 'react-jss'

type ReactJSSProps = {classes?: ReturnType<ReturnType<typeof createUseStyles>>}

/**
 * Creates a Higher Order Component that injects the CSS specified in `styles`.
 * @param styles
 */
function withStyles<C extends string, Pr extends ReactJSSProps, T>(
  styles: Styles<C, Pr, T> | ((theme: T) => Styles<C, Pr>)
) {
  return function<P extends Pr, S>(WrappedComponent: React.ComponentClass<P, S>): React.FC<P> {
    const useStyles = createUseStyles<C, P, T>(styles)

    const StyledComponent: React.FC<P> = (props: P) => {
      const {classes, ...passThroughProps} = props
      const theme = useTheme<T>()
      const reactJssClasses = useStyles({...(passThroughProps as P), theme})

      return <WrappedComponent {...passThroughProps as P} classes={reactJssClasses} />
    }

    StyledComponent.displayName = `withStyles(${WrappedComponent.name})`

    return StyledComponent
  }
}

export default withStyles
```

This typed HOC enforces consistency with your `RuleNames` and `Theme`. It also enforces consistency between the `Props` you give to `Styles` and the ones you give to your component.

You'll notice that here, we've typed the HOC to accept only class components as arguments. This is because you should be using the provided hooks for your functional components; not only do hooks provide a simpler interface, but they also help clarify which props actually belong to your component.

## Migrating from Decorators

Because this custom HOC makes use of hooks (which are [unusable in class components](https://reactjs.org/docs/hooks-faq.html#:~:text=You%20can't%20use%20Hooks,implementation%20detail%20of%20that%20component.)), you won't be able to use this HOC as a decorator. If you are using decorators in your project, you'll likely have to migrate your code from this:

```javascript
import React from 'react'
import decorator1 from 'some-hoc-library'
import decorator2 from 'another-hoc-library'
// ...
import withStyles from 'path/to/custom-hoc'

const styles = {
  /* ... */
}

@decorator1
@decorator2
// ...
@withStyles(styles)
class MyComponent extends React.Component {
  // ...
}

export default MyComponent
```

to this:

```javascript
import React from 'react'
import decorator1 from 'some-hoc-library'
import decorator2 from 'another-hoc-library'
// ...
import withStyles from 'path/to/custom-hoc'

const styles = {
  /* ... */
}

@decorator1
@decorator2
// ...
class MyComponent extends React.Component {
  // ...
}

export default withStyles(styles)(MyComponent)
```

If you find yourself using many decorators for your class components, consider migrating away from chained decorators to [composed function calls](https://reactjs.org/docs/higher-order-components.html#convention-maximizing-composability). This is a safer play in the long run since decorators still have not stabilized in the JS standard.

If you don't use decorators or aren't familiar with them, then this won't be a concern for you.
