#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2019-12-25
# Updated: 2019-12-16
#
###############################################################################@

.PHONY: all
all:
	@(cd www && make)

.PHONY: test
test:
	@make all
	#@(cd test && make test)
	@(cd www/govHUB && make test)

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
