BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

.PHONY: all
all:
	@make $(BUNDLEJS)

.PHONY: test
test:
	@make all
	@(google-chrome --new-window http://localhost/cht/govHUB/index.php)

$(BUNDLEJS): selida.js ../../lib/govHUB/apiClient.js ../../lib/govHUB/apiCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ selida.js

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLEJS)
