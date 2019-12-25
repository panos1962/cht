BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify

.PHONY: all
all:
	@make $(BUNDLEJS)

.PHONY: test
test:
	@make all
	@(google-chrome --new-window http://localhost/cht/govHUB/index.php)

$(BUNDLEJS): selida.js
	browserify $(BROWSERIFY_OPTS) -o $@ $^

.PHONY: clanup
cleanup:
	@rm -f $(BUNDLEJS)
