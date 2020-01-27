import conf from './components/conf'
import Calendar from './components/calendar'

const calendar = new Calendar(conf).create()
document.body.appendChild(calendar.element)
calendar.renderDay([
  {
    start: 30,
    end: 150
  },
  {
    start: 540,
    end: 600
  },
  {
    start: 560,
    end: 620
  },
  {
    start: 610,
    end: 670
  }
])
