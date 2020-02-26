#!/usr/bin/env awk

###############################################################################@
##
## @BEGIN
##
## @COPYRIGHT BEGIN
## Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
## @COPYRIGHT END
##
## @FILETYPE BEGIN
## awk
## @FILETYPE END
##
## @FILE BEGIN
## lib/proklisiexpand.awk —— Διαβάζει κωδικούς προ-κλήσεων και εκτυπώνει πλήρη
## στοιχεία προ-κλήσεων.
## @FILE END
##
## @DESCRIPTION BEGIN
## Το πρόγραμμα διαβάζει κωδικούς προ-κλήσεων από το input και εκτυπώνει πλήρη
## στοιχεία των προ-κλήσεων αυτών στο output. By default οι κωδικοί προ-κλήσεων
## στο input πρέπει να βρίσκονται στην πρώτη στήλη, αλλά μπορούμε να καθορίσουμε
## άλλη στήλη μέσω της μεταβλητής "kcol".
## @DESCRIPTION END
##
## @HISTORY BEGIN
## Created: 2020-02-26
## @HISTORY END
##
## @END
##
###############################################################################@


BEGIN {
	if (colsep != "")
	FS = colsep

	dimas_astinomikos_fetch()
}

blank_line() {
	next
}

syntax_error() {
	next
}

{
	if (process_proklisi(proklisi))
	print_proklisi(proklisi, proklisi["proklidata"])
}

function blank_line() {
	return ($0 ~ "^[ \t]*$")
}

function syntax_error(		kodikos) {
	if (NF < kcol) {
		print $0 ": ανεπαρκές πλήθος στηλών" >"/dev/stderr"
		synterr++
		return 1
	}

	kodikos = $kcol

	if (pd_integerck(kodikos, 1, 999999999)) {
		print kodikos ": απαράδεκτος κωδικός πρό-κλησης" >"/dev/stderr"
		synterr++
		return 1
	}

	return 0
}

function process_proklisi(proklisi) {
	delete proklisi
	proklisi["kodikos"] = $kcol + 0

	if(!dimas_proklisi_fetch(proklisi)) {
		print $kcol ": δεν εντοπίστηκε πρό-κληση"
		notfound++
		return 0
	}

	dimas_proklidata_fetch(proklisi)
	return 1
}

function print_proklisi(proklisi, proklidata) {
	print \
	proklisi["kodikos"], \
	proklisi["imerominia"], \
	proklisi["ipalilos"], \
	dimas_astinomikos[proklisi["ipalilos"]]["onomateponimo"], \
	proklidata["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΑΡ. ΚΥΚΛΟΦΟΡΙΑΣ"], \
	proklidata["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΜΑΡΚΑ"], \
	proklidata["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΧΡΩΜΑ"], \
	proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΑΦΜ"], \
	onomasia(proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]),
	proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΔΙΕΥΘΥΝΣΗ"], \
	proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΤΚ"], \
	proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΠΕΡΙΟΧΗ/ΠΟΛΗ"],
	proklidata["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΠΡΟΣΤΙΜΟ"]
}

function onomasia(data,			s) {
	if (data["ΕΠΩΝΥΜΙΑ"])
	return data["ΕΠΝΩΝΥΜΙΑ"]

	s = data["ΕΠΩΝΥΜΟ"] " " data["ΟΝΟΜΑ"]

	if (data["ΠΑΤΡΩΝΥΜΟ"])
	s = s " (" substr(data["ΠΑΤΡΩΝΥΜΟ"], 1, 3) ")"

	return s
}
