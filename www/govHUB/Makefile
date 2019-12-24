all: bundle.js
TINYIFY =
TINYIFY = -p /usr/local/lib/node_modules/tinyify

bundle.js: selida.js ../../lib/govHUB/apiClient.js ../../lib/govHUB/apiCore.js
	browserify $(TINYIFY) -o $@ $^
