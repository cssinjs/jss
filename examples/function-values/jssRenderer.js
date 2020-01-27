import jss from 'jss'
import preset from 'jss-preset-default'
import times from 'lodash/times'
import {getRandomColor, getRandomTransform} from './utils'

jss.setup(preset())

let container
let sheet

const createStyleSheet = styles => {
  if (sheet) sheet.detach()
  sheet = jss.createStyleSheet(styles, {link: true}).attach()
}

const ensureContainer = () => {
  if (!container) container = document.body.appendChild(document.createElement('div'))
}

export const destroy = () => {
  if (sheet) sheet.detach()
  if (container) container.parentNode.removeChild(container)
}

export const render = amount => {
  const styles = {}

  times(amount, i => {
    styles[`object-${i}`] = {
      position: 'absolute',
      width: 50,
      height: 50,
      borderRadius: '50%',
      background: getRandomColor(),
      transform: getRandomTransform,
      transition: 'transform 500ms'
    }
  })

  createStyleSheet(styles)

  ensureContainer()
  container.innerHTML = times(
    amount,
    i => `<div class="${sheet.classes[`object-${i}`]}"></div>`
  ).join('')
}

export const update = () => {
  if (sheet) sheet.update()
}
