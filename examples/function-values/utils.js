import random from 'lodash/random'
import Stats from 'stats.js'

export const getRandomColor = () => `#${Math.floor(Math.random() * 0x1000000).toString(16)}`

export const getRandomTransform = () => {
  const x = random(0, window.innerWidth)
  const y = random(0, window.innerHeight)
  return `translate3d(${x}px, ${y}px, 0)`
}

const stats = (() => {
  const statsInstance = new Stats()
  statsInstance.showPanel(0)
  statsInstance.dom.style.top = '80px'
  statsInstance.dom.style.left = '10px'
  document.body.appendChild(statsInstance.dom)
  return statsInstance
})()

export const tick = (() => {
  const delay = 100
  let lastTime = Date.now()

  return callback => {
    const now = Date.now()
    stats.begin()
    if (now - lastTime > delay) {
      callback()
      lastTime = now
    }
    stats.end()
    requestAnimationFrame(tick.bind(null, callback))
  }
})()
