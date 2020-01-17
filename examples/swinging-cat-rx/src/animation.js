import {Observable, Subject, Scheduler} from 'rxjs'
import 'hammerjs'
import dynamics from 'dynamics.js'

export const swingAnimationValues = [5, -10, 15, -23, 23, -15, 10, -10, 5]

export const animationSubject = new Subject(0)

// animationSubject.subscribe(
//   $val => console.log('Next: ' + $val),
//   err => console.log('Error: ' + err),
//   () => console.log('Completed')
// )

export function getPercentValue(animationValues, $percent) {
  for (let i = 0; i < animationValues.length; i++) {
    if ($percent >= animationValues[i].percent) {
      return animationValues[i].value
    }
  }
  return animationValues[animationValues.length - 1].value
}

export const rotate = ($val, $mult = 1) => `rotate(${$val * $mult}deg)`
export const scaleY = $val => `scaleY(${$val})`
export const translateY = ($val, $mult = 1) => `translateY(${$val * $mult}rem)`
export const translateX = ($val, $mult = 1) => `translateX(${$val * $mult}px)`

export const swingAnimation$ = ($mult = 1, animation = rotate) =>
  animationSubject.map($val => animation($val, $mult))

export const animationLoader$ = duration =>
  Observable.interval(0, Scheduler.animationFrame)
    .startWith(0)
    .scan(x => x > duration * (10 ? 0 : x + 1), 0)
    .map(x => (x * 10) / duration)

export const doAnimation$ = loader$ =>
  Observable.combineLatest(animationSubject, loader$, (val, percent) => (val === 0 ? val : percent))

export const setup = function() {
  const cat = document.querySelector('#cat')
  const hCat = new Hammer(cat)
  const noop = () => {}

  const springBack = fromX =>
    Observable.fromEventPattern(
      handler =>
        dynamics.animate(
          {deltaX: fromX},
          {deltaX: 0},
          {
            change: e => handler(e.deltaX),
            type: dynamics.spring,
            duration: 3000,
            bounciness: 500,
            friction: 100
          }
        ),
      noop
    )

  const pan$ = Observable.fromEventPattern(
    handler => hCat.on('panleft panright panend', handler),
    noop
  )

  const move$ = pan$
    .switchMap(e => (e.type === 'panend' ? springBack(e.deltaX) : Observable.of(e.deltaX)))
    .startWith(0)

  move$.subscribe(deltaX => animationSubject.next(-deltaX * 0.1))
}
