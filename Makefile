#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Last updated: 2019-12-16
#
###############################################################################@

TEST = echo '{"oxima":"ΝΒΝ9596"}' | node ./lib/govHUB/carget.js
TEST = ( cd tutorial/govHUB/carget && bash test.sh )

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

.PHONY: test
test:
	$(TEST)
