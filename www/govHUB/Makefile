all: bundle.js
TINYIFY = -p /usr/local/lib/node_modules/tinyify
TINYIFY =

all:
	rm -f bundle.js
	make bundle.js

bundle.js: \
	selida.js
	browserify $(TINYIFY) -o $@ $^
