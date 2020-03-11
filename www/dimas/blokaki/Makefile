#!/usr/bin/env make -f

PANDORA = ../../../mnt/pandora
BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

.PHONY: all
all: $(BUNDLEJS)

$(BUNDLEJS): \
	$(PANDORA)/lib/pandoraCore.js \
	$(PANDORA)/lib/pandoraClient.js \
	$(PANDORA)/www/lib/pandoraPaleta.js \
	main.js \
	../../../lib/dimasClient.js \
	../../../lib/dimasCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLE)
