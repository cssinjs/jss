const context = require.context('./packages/jss/tests', true, /\.js$/)
context.keys().forEach(context)
