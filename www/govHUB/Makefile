#!/usr/bin/env make -f

###############################################################################@
##
## @BEGIN
##
## @COPYRIGHT BEGIN
## Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
## @COPYRIGHT END
##
## @FILETYPE BEGIN
## makefile
## @FILETYPE END
##
## @HISTORY BEGIN
## Updated: 2020-01-11
## @HISTORY END
##
## @END
##
###############################################################################@

BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

.PHONY: all
all:
	@make $(BUNDLEJS)

.PHONY: test
test:
	@make cleanup
	@make all
	#@(google-chrome --new-window http://localhost/cht/govHUB/index.php)

$(BUNDLEJS): \
	../../../pandora/lib/pandoraClient.js \
	../../lib/govHUB/apiCore.js \
	../../lib/govHUB/apiClient.js \
	main.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLEJS)
