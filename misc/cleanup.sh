#!/usr/bin/env bash

###############################################################################@
#
# @COPY: Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# @FILE: misc/cleanup.sh —— Διαγραφή παράγωγων και περιττών αρχείων
#
# Με το παρόν επιχειρείται καθαρισμός του τοπικού αποθετηρίου από παράγωγα και
# περιττά αρχεία. Παράγωγα αρχεία λογίζονται αυτά που κατασκευάζονται από άλλα
# αρχεία, ενώ περιττά είναι τα προσωρινά αρχεία και άλλα πρόχειρα αρχεία που
# ενδεχομένως να έχουν παραμείνει στο αποθετήριο.
#
# Created: 2020-01-07
#
###############################################################################@

. "${PANDORA_BASEDIR:=/var/opt/pandora}/lib/pandora.sh"

pd_usagemsg=

[ $# -ne 0 ] &&
pd_usage

bundlejs_cleanup() {
	find . -type f -name 'bundle.js' -exec rm -f {} \;
}

tmpfiles_cleanup() {
	find tmp \
	-not -path tmp \
	-not -ipath tmp/readme.md \
	-not -path tmp/index.html \
	-exec rm -rf {} \;
}

bundlejs_cleanup
tmpfiles_cleanup
