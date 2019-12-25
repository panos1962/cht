BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify

all:
	make cleanup
	make $(BUNDLEJS)

$(BUNDLEJS): selida.js
	browserify $(BROWSERIFY_OPTS) -o $@ $^

cleanup:
	rm -f $(BUNDLEJS)
