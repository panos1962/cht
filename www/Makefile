#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2019-12-25
#
###############################################################################@

all:
	@(cd govHUB && make)

test:
	@make all
	(cd govHUB && make test)

cleanup:
	@(cd govHUB && make cleanup)
	@(cd tmp; rm -f *; ln -s ../../misc/index.html .;) 2>/dev/null; :
