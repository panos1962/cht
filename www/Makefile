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
	@(cd dimas && make)
	@(cd dimas/proklisi && make)
	@(cd dimas/blokaki && make)

test:
	@make all
	(cd govHUB && make test)
