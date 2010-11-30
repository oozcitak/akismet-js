dev: clean
	@echo 'Building...'
	@test `which coffee` || echo 'You need to have CoffeeScript installed.'
	@coffee -c -o lib src/*.coffee

publish: dev
	@test `which npm` || echo 'You need to have npm installed.'
	npm publish

test: dev
	@test `which node` || echo 'You need to have node.js installed.'
	@coffee -c -o lib spec/*.coffee
	@node ./lib/test.js

clean:
	@echo 'Cleaning build'
	@rm -fr lib/

