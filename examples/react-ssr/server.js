require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
})

const express = require('express')
const path = require('path')
const ssr = require('./ssr').default

const app = express()

const port = 4000

app.use(express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
  res.send(ssr())
})

app.listen(port, () => console.log(`server is listening at http://localhost:${port}`))
