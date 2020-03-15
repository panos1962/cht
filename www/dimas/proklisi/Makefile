#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2020-03-06
# Created: 2020-01-22
#
###############################################################################@

PANDORA = ../../../mnt/pandora
PANDORA_CSS = $(PANDORA)/www/lib/pandora.css

CSS = main.css
BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

.PHONY: all
all: $(CSS) $(BUNDLEJS)

$(CSS): main.styl $(PANDORA_CSS)
	stylus --print main.styl >$@

$(PANDORA_CSS):
	:

$(BUNDLEJS): \
	$(PANDORA)/lib/pandoraCore.js \
	$(PANDORA)/lib/pandoraClient.js \
	$(PANDORA)/www/lib/pandoraPaleta.js \
	main.js isodos.js oxima.js kirosi.js klisi.js menu.js \
	../../../lib/dimasClient.js \
	../../../lib/dimasCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLE)
