#!/usr/bin/env bash

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
###############################################################################@
#
# GovHUB Tutorial -- Αναζήτηση στοιχείων οχημάτων/κατόχων από την πλατφόρμα
# "govHUB" μέσω του προγράμματος "carget.js" με σύγχρονο και ασύγχρονο τρόπο.
#
# Στο παρόν script παρουσιάζουμε τον τρόπο χρήσης του προγράμματος "carget.js"
# με το οποίο αναζητούμε στοιχεία οχημάτων/κατόχων από την πλατφόρμα "govHUB".
# Το πρόγραμμα, by default, δέχεται JSON objects στα οποία πρέπει να περιέχεται
# property "oxima" με τιμή τον αριθμό κυκλοφορίας οχήματος. 
#
###############################################################################@

[ -x "${CHT_BASEDIR}" ] &&
CHT_BASEDIR="/var/opt/cht"

echo "Default:" >/dev/tty
#"${CHT_BASEDIR}/bin/GH" carget -v default[12].data

#echo "Custom (test1):" >/dev/tty
#"${CHT_BASEDIR}/bin/GH" carget -v -s test1.js test1[12].data

echo "Custom (test2):" >/dev/tty
"${CHT_BASEDIR}/bin/GH" carget -v -s test2.js test2[2].data
