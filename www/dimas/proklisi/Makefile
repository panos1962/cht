#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Created: 2020-01-22
#
###############################################################################@

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
	main.js klisi.js isodos.js menu.js \
	../../../lib/dimasCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLE)
