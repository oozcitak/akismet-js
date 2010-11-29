dev: clean
	@echo 'Building...'
	@test `which coffee` || echo 'You need to have CoffeeScript installed.'
	@coffee -c -o lib src/*.coffee

clean:
	@echo 'Cleaning build'
	@rm -fr lib/

