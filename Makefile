.PHONY: status
status:
	@git status .

.PHONY: show
show:
	@git add --dry-run .

.PHONY: add
add:
	@git add --verbose .

.PHONY: commit
commit:
	@git commit --message "modifications" .

.PHONY: push
push:
	@git push

.PHONY: pull
pull:
	@git pull

.PHONY: test
test:
	./lib/govHUB/carparse local/KOK/kata_mina_20191201/2017??.json
