build:
	node_modules/browserify/bin/cmd.js -e ./index.js -o dist/jss.js -s jss
	node_modules/browserify/bin/cmd.js -e ./examples/commonjs/main.js -o ./examples/commonjs/build.js

.PHONY: build
