const pkg = require('../package.json')

module.exports = function () {
  return {
    visitor: {
      Identifier: {
        enter: (path) => {
          if (path.isIdentifier({name: '__VERSION__'})) {
            path.replaceWithSourceString("'" + pkg.version + "'")
          }
        },
      },
    },
  };
};
