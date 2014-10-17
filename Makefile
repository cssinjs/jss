build:
	node_modules/.bin/browserify -e ./index.js -o dist/jss.js -s jss
	node_modules/.bin/browserify -e ./examples/commonjs/main.js -o ./examples/commonjs/build.js
	node_modules/.bin/uglifyjs < dist/jss.js > dist/jss.min.js --comments license

.PHONY: build
