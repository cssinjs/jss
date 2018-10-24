// @flow

export type NextChannel<T> = (value: T) => void
export type Observer<T> = {
  next: NextChannel<T>
}
export type Unsubscribe = () => void
export type Subscription = {
  unsubscribe: Unsubscribe
}

export type ObserverOrNext<T> = Observer<T> | NextChannel<T>

export type Observable<T> = {
  subscribe(observerOrNext: ObserverOrNext<T>): Subscription
}
