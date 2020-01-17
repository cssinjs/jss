import random from 'lodash/random'
import Stats from 'stats.js'

export const getRandomColor = () => '#' + Math.floor(Math.random() * 0x1000000).toString(16)

export const getRandomTransform = () => {
  var x = random(0, window.innerWidth)
  var y = random(0, window.innerHeight)
  return `translate3d(${x}px, ${y}px, 0)`
}

const stats = (() => {
  const stats = new Stats()
  stats.showPanel(0)
  stats.dom.style.top = '80px'
  stats.dom.style.left = '10px'
  document.body.appendChild(stats.dom)
  return stats
})()

export const tick = (() => {
  const delay = 100
  let lastTime = Date.now()

  return function tick(callback) {
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
