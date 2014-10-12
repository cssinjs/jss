build:
	node_modules/browserify/bin/cmd.js -e ./lib/index.js -o dist/jss.js -s jss

.PHONY: build
