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

MAIN_CSS = main.css
PRINT_CSS = mainPrint.css
DEBUG_CSS = mainDebug.css
BUNDLE_JS = bundle.js

PARAGOGA = \
$(MAIN_CSS) \
$(PRINT_CSS) \
$(DEBUG_CSS) \
$(BUNDLE_JS)

BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

.PHONY: all
all: $(PARAGOGA)

$(MAIN_CSS): main.styl klisi.styl
	stylus --print main.styl >$@

$(PRINT_CSS): mainPrint.styl
	stylus --print mainPrint.styl >$@

$(DEBUG_CSS): mainDebug.styl klisiDebug.styl
	stylus --print mainDebug.styl >$@

$(BUNDLE_JS): \
	$(PANDORA)/lib/pandoraCore.js \
	$(PANDORA)/lib/pandoraClient.js \
	$(PANDORA)/www/lib/pandoraPaleta.js \
	main.js isodos.js oxima.js kirosi.js klisi.js menu.js \
	../../../lib/dimasClient.js \
	../../../lib/dimasCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

.PHONY: cleanup
cleanup:
	@rm -f $(PARAGOGA)
