#!/usr/bin/env bash

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2019-12-25
# Updated: 2019-12-17
#
###############################################################################@
#
# GovHUB Tutorial -- Αναζήτηση στοιχείων φυσικών και νομικών προσώπων με βάση
# το ΑΦΜ από την ΓΓΠΣ μέσω του προγράμματος "afmget.js".
#
# Στο παρόν script παρουσιάζουμε τον τρόπο χρήσης του προγράμματος "arfmet.js"
# με το οποίο αναζητούμε στοιχεία φυσικών και νομικών προσώπων από την ΓΓΠΣ.
# Το πρόγραμμα, by default, δέχεται JSON objects στα οποία πρέπει να περιέχεται
# property "afm" με τιμή το ΑΦΜ του φυσικού ή νομικού προσώπου που αναζητούμε.
#
###############################################################################@

[ -z "${PANDORA_BASEDIR}" ] &&
PANDORA_BASEDIR="/var/opt/pandora"

. "${PANDORA_BASEDIR}/lib/pandora.sh"

[ -z "${CHT_BASEDIR}" ] &&
CHT_BASEDIR="/var/opt/cht"

pd_ttymsg "Default:"
"${CHT_BASEDIR}/bin/GH" afmget -v default[1].data

pd_ttymsg "Custom (test1):"
"${CHT_BASEDIR}/bin/GH" afmget -v -s test1.js test1[12].data
