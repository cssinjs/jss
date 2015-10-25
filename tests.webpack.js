var context = require.context('./test', true, /\.js$/)
context.keys().forEach(context)
