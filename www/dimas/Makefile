#!/usr/bin/env make -f

PANDORA = ../../mnt/pandora
PANDORA_CSS = ../../mnt/pandora/www/lib/pandora.css

CSS = main.css
BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

.PHONY: all
all: $(BUNDLEJS) $(CSS)

$(CSS): main.styl $(PANDORA_CSS)
	stylus --print main.styl >$@

$(BUNDLEJS): \
	$(PANDORA)/lib/pandoraCore.js \
	$(PANDORA)/lib/pandoraClient.js \
	$(PANDORA)/www/lib/pandoraPaleta.js \
	main.js \
	../../lib/dimasClient.js \
	../../lib/dimasCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLE)
