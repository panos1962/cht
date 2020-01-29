#!/usr/bin/env make -f

###############################################################################@
#
# @BEGIN
#
# @COPYRIGHT BEGIN
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
# @COPYRIGHT END
#
# @FILETYPE BEGIN
# makefile
# @FILETYPE END
#
# @FILE BEGIN
# Makefile —— main makefile
# @FILE END
#
# @HISTORY BEGIN
# Updated: 2020-01-09
# Updated: 2019-12-25
# Updated: 2019-12-16
# @HISTORY END
#
# @END
#
###############################################################################@

.PHONY: all
all:
	@(cd www && make)

.PHONY: test
test:
	@make all
	@(cd local && bash test.sh)

.PHONY: git
git:
	make -s status
	make -s commit
	make -s push
	echo '#####################################################'
	make -s status
	make -s commit
	make -s push

.PHONY: status
status:
	@git status .

.PHONY: diff
diff:
	@git diff .

.PHONY: show
show:
	@git add --dry-run .

.PHONY: add
add:
	@git add --verbose .

.PHONY: commit
commit:
	@git commit --message "modifications" .; :

.PHONY: push
push:
	@git push

.PHONY: pull
pull:
	@git pull

.PHONY: cleanup
cleanup:
	@misc/cleanup.sh
