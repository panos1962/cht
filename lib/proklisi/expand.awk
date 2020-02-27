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

	if (ofs)
	OFS = ofs

	process_output_columns()
	dimas_astinomikos_fetch()
}

{
	print "asad", "asasdasd"
next
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

function process_output_columns(			n, a, i) {
	if (!cols)
	cols = "kodikos,imerominia,ipalilos,onoma,paravasi,topos," \
		"oxima,marka,xroma,tipos,afm,onomasia,dief,tk,perioxi," \
		"pinakides,adia,diploma,prostimo,"

	n = split(cols, a, ",")

	for (i = 1; i < n; i++)
	olist[ncols++] = a[i]
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

function print_proklisi(proklisi, proklidata,		i, s) {
	if (ncols <= 0)
	return

	proklisi["onoma"] = dimas_astinomikos[proklisi["ipalilos"]]["onomateponimo"]
	proklisi["filo"] = dimas_astinomikos[proklisi["ipalilos"]]["filo"]

	proklisi["oxima"] = proklidata["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΑΡ. ΚΥΚΛΟΦΟΡΙΑΣ"]
	proklisi["marka"] = proklidata["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΜΑΡΚΑ"]
	proklisi["xroma"] = proklidata["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΧΡΩΜΑ"]
	proklisi["tipos"] = proklidata["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΤΥΠΟΣ"]

	proklisi["afm"] = proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΑΦΜ"]
	proklisi["onomasia"] = onomasia(proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"])
	proklisi["dief"] = proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΔΙΕΥΘΥΝΣΗ"]
	proklisi["tk"] = proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΤΚ"]
	proklisi["perioxi"] = proklidata["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΠΕΡΙΟΧΗ/ΠΟΛΗ"]

	proklisi["paravasi"] = proklidata["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["ΚΩΔΙΚΟΣ"]
	proklisi["diataxi"] = proklidata["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["ΔΙΑΤΑΞΗ"]
	proklisi["lektiko"] = proklidata["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["ΠΑΡΑΒΑΣΗ"]
	proklisi["topos"] = proklidata["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["ΤΟΠΟΣ"]
	proklisi["geox"] = proklidata["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["GEOX"]
	proklisi["geoy"] = proklidata["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["GEOY"]

	proklisi["pinakides"] = proklidata["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΠΙΝΑΚΙΔΕΣ"]
	proklisi["adia"] = proklidata["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΑΔΕΙΑ"]
	proklisi["diploma"] = proklidata["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΔΙΠΛΩΜΑ"]
	proklisi["prostimo"] = proklidata["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΠΡΟΣΤΙΜΟ"]

	printf colval(proklisi, olist[0])

	for (i = 1; i < ncols; i++)
	printf OFS colval(proklisi, olist[i])

	print ""
}

function colval(proklisi, col) {
	return (col in proklisi ? proklisi[col] : col)
}

function onomasia(data,			s) {
	if (data["ΕΠΩΝΥΜΙΑ"])
	return data["ΕΠΩΝΥΜΙΑ"]

	s = data["ΕΠΩΝΥΜΟ"] " " data["ΟΝΟΜΑ"]

	if (data["ΠΑΤΡΩΝΥΜΟ"])
	s = s " (" substr(data["ΠΑΤΡΩΝΥΜΟ"], 1, 3) ")"

	return s
}
