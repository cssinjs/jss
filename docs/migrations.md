# Migration guides

## From v9 to v10

1. New Observables and function values support.

In v9 Observables and function values have been part of JSS core. In v10 they are standalone plugins. If you are using the default preset you don't need to do anyhing else than upgrading the versions. If you are using a custom setup and you use function values or observables, you will have to add 2 additional plugins. See [plugins.md](./plugins.md).

1. Full syntax support in dynamic values.

Return values of from Observables and functions are not processed by the JSS plugins. This means you can return full JSS syntax from dynamic values. This also means it can be a bit slower, but you can always opt-out from processing by using `sheet.update(data, {process: false})` when using JSS core directly. Also you can opt-out when setting up the observable plugin `jss.use(pluginObservable({process: false}))`.

1. Scoped @keyframes.

In v9, when you declare keyframes `@keyframes my-animation` the id was global as it is by default in CSS. This could lead to problems since you could override them nondeterministically. In v10, id is scoped by default, same like we do with class names. Check out the full syntax [here](./jss-syntax.md/#keyframes-animation).

1. Renamed id generator function.

Due to the fact that we now use the same id generator function for both class names and keyframes id, we had to rename functions `createGenerateClassName` and `generateClassName` to `createGenerateId` and `generateId`.

1. Dropping support for React 0.13 and 0.14

React-JSS has migrated to the new Context API and now requires React v0.15 or higher.
