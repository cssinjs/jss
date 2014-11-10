build:
	node_modules/.bin/xpkg .
	node_modules/.bin/browserify -e ./index.js -o dist/jss.js -s jss
	node_modules/.bin/browserify -e ./examples/commonjs/main.js -o ./examples/commonjs/build.js
	node_modules/.bin/browserify -e ./examples/topcoat/main.js -o ./examples/topcoat/build.js
	node_modules/.bin/uglifyjs < dist/jss.js > dist/jss.min.js --comments license

push:
	git push origin master
	git push origin master:gh-pages
	git push --tags

publish: push
	npm pu

.PHONY: build push publish
