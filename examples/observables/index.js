import {fromEvent} from 'rxjs'
import {switchMap, map, takeUntil} from 'rxjs/operators'
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

const renderBox = () => {
  const box = document.createElement('div')
  box.textContent = 'Drag me'
  return box
}

const getPosition = box => {
  // Create event streams. Note no event listeners are created at this point.
  const mousedown$ = fromEvent(box, 'mousedown')
  const mousemove$ = fromEvent(box.ownerDocument, 'mousemove')
  const mouseup$ = fromEvent(box, 'mouseup')

  // Now mousedown event listener will be created.
  return mousedown$.pipe(
    switchMap(md => {
      const startX = md.clientX + window.scrollX
      const startY = md.clientY + window.scrollY
      const style = getComputedStyle(md.target)
      const startLeft = parseInt(style.left, 10) || 0
      const startTop = parseInt(style.top, 10) || 0

      // Now mousemove event listener is will be created.
      return mousemove$.pipe(
        // Convert the event to object to a position object.
        map(mm => ({
          left: startLeft + mm.clientX - startX,
          top: startTop + mm.clientY - startY
        })),
        // As soon as mouseup event occurs, mousemove listener will be removed.
        takeUntil(mouseup$)
      )
    })
  )
}

const renderStyles = pos$ => {
  // Create the style sheet.
  const {classes} = jss
    .createStyleSheet(
      {
        box: {
          position: 'absolute',
          width: 100,
          height: 100,
          background: 'black',
          color: 'white',
          cursor: 'move',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          top: pos$.pipe(map(pos => pos.top)),
          left: pos$.pipe(map(pos => pos.left))
        }
        // Use option `link: true` in order to connect CSSStyleRule with the JSS StyleRule.
      },
      {link: true}
    )
    .attach()

  return classes.box
}

const mount = () => {
  const box = renderBox()
  const pos$ = getPosition(box)
  box.className = renderStyles(pos$)
  document.body.appendChild(box)
}

mount()
