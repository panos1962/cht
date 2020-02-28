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
## @DESCRIPTION END
##
## @HISTORY BEGIN
## Updated: 2020-02-28
## Updated: 2020-02-27
## Created: 2020-02-26
## @HISTORY END
##
## @END
##
###############################################################################@

BEGIN {
	if (listcol)
	exit(list_columns())

	if (colsep != "")
	FS = colsep

	if (ofs)
	OFS = ofs

	dimas_astinomikos_fetch()
	parse_output_columns()

	if (ikothen_epilogi())
	exit(0)
}

blank_line() {
	next
}

syntax_error() {
	next
}

{
	process_proklisi(proklisi, $kcol)
}

function parse_output_columns(			n, a, i) {
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

function process_proklisi(proklisi, kodikos,		i, s) {
	delete proklisi
	proklisi["kodikos"] = kodikos + 0

	if(!dimas_proklisi_fetch(proklisi)) {
		print kodikos ": δεν εντοπίστηκε πρό-κληση"
		notfound++
		return
	}

	dimas_proklidata_fetch(proklisi)

	proklisi["onoma"] = dimas_astinomikos[proklisi["ipalilos"]]["onomateponimo"]
	proklisi["filo"] = dimas_astinomikos[proklisi["ipalilos"]]["filo"]

	proklisi["oxima"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΑΡ. ΚΥΚΛΟΦΟΡΙΑΣ"]
	proklisi["marka"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΜΑΡΚΑ"]
	proklisi["xroma"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΧΡΩΜΑ"]
	proklisi["tipos"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΤΥΠΟΣ"]

	proklisi["afm"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΑΦΜ"]
	proklisi["onomasia"] = onomasia(proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"])
	proklisi["dief"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΔΙΕΥΘΥΝΣΗ"]
	proklisi["tk"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΤΚ"]
	proklisi["perioxi"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ"]["ΠΕΡΙΟΧΗ/ΠΟΛΗ"]

	proklisi["paravasi"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["ΚΩΔΙΚΟΣ"]
	proklisi["diataxi"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["ΔΙΑΤΑΞΗ"]
	proklisi["lektiko"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["ΠΑΡΑΒΑΣΗ"]
	proklisi["topos"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["ΤΟΠΟΣ"]
	proklisi["geox"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["GEOX"]
	proklisi["geoy"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ"]["GEOY"]

	proklisi["pinakides"] = proklisi["proklidata"]["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΠΙΝΑΚΙΔΕΣ"]
	proklisi["adia"] = proklisi["proklidata"]["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΑΔΕΙΑ"]
	proklisi["diploma"] = proklisi["proklidata"]["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΔΙΠΛΩΜΑ"]
	proklisi["prostimo"] = proklisi["proklidata"]["ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ"]["ΠΡΟΣΤΙΜΟ"]

	if (ante) {
		print ante
		ante = ""
	}

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

function ikothen_epilogi(		query, cont, n, a, i, row, proklisi) {
	query = ""
	cont = " WHERE"

	if (apo) {
		if (apo !~ / /)
		apo = apo " 00:00:00"

		query = query cont " (`imerominia` >= " spawk_escape(apo) ")"
		cont = " AND"
	}

	if (eos) {
		if (eos !~ / /)
		eos = eos " 23:59:59"

		query = query cont " (`imerominia` <= " spawk_escape(eos) ")"
		cont = " AND"
	}


	if (imerominia) {
		n = split(imerominia, a, "[, ]")

		for (i = 1; i < n; i++) {
			query = query cont " (`imerominia` BETWEEN " \
				spawk_escape(a[i] " 00:00:00") " AND " \
				spawk_escape(a[i] " 23:59:59") ")"
			cont = " OR"
		}
	}

	if (!query)
	return 0

	query = "SELECT `kodikos` FROM `dimas`.`proklisi`" \
		query " ORDER BY `kodikos` " order

	if (spawk_submit(query, "NUM") != 3)
	pd_fatal("SPAWK: submit query failed")

	while (spawk_fetchrow(row))
	process_proklisi(proklisi, row[1])

	return(1)
}

function list_columns(		nf, list, desc, sect, i, prev, l) {
	list[nf++] = "kodikos"
	list[nf++] = "imerominia"
	list[nf++] = "ipalilos"
	list[nf++] = "onoma"
	list[nf++] = "filo"

	list[nf++] = "oxima"
	list[nf++] = "marka"
	list[nf++] = "xroma"
	list[nf++] = "tipos"

	list[nf++] = "afm"
	list[nf++] = "onomasia"
	list[nf++] = "dief"
	list[nf++] = "tk"
	list[nf++] = "perioxi"

	list[nf++] = "paravasi"
	list[nf++] = "diataxi"
	list[nf++] = "lektiko"
	list[nf++] = "topos"
	list[nf++] = "geox"
	list[nf++] = "geoy"

	list[nf++] = "pinakides"
	list[nf++] = "adia"
	list[nf++] = "diploma"
	list[nf++] = "prostimo"

	list[nf++] = "info"

	#######################################################################@

	desc["kodikos"] = "Αριθμός βεβαίωσης"
	desc["imerominia"] = "Ημερομηνία βεβαίωσης"
	desc["ipalilos"] = "Κωδικός υπαλλήλου"
	desc["onoma"] = "Ονοματεπώνυμο υπαλλήλου"
	desc["filo"] = "Φύλο υπαλληλου"

	desc["oxima"] = "Αριθμός κυκλοφορίας"
	desc["marka"] = "Μάρκα οχήματος"
	desc["xroma"] = "Χρώμα οχήματος"
	desc["tipos"] = "Τύπος οχήματος"

	desc["afm"] = "ΑΦΜ υποχρέου"
	desc["onomasia"] = "Ονοματεπώνυμο / Επωνυμία"
	desc["dief"] = "Διεύθυνση υποχρέου"
	desc["tk"] = "Ταχ. κωδικός υποχρέου"
	desc["perioxi"] = "Πόλη / Περιοχή"

	desc["paravasi"] = "Κωδικός παράβασης"
	desc["diataxi"] = "Διάταξη παράβασης"
	desc["lektiko"] = "Λεκτικό παράβασης"
	desc["topos"] = "Τοποθεσία παράβασης"
	desc["geox"] = "Γεωγραφικό πλάτος (latitude)"
	desc["geoy"] = "Γεωγραφικό μήκος (longitude)"

	desc["pinakides"] = "Αφαίρεση πινακίδων (ημέρες)"
	desc["adia"] = "Αφαίρεση αδείας (ημέρες)"
	desc["diploma"] = "Αφαίρεση διπλώματος (ημέρες)"
	desc["prostimo"] = "Πρόστιμο (σε λεπτά του ευρώ)"

	desc["info"] = "Παρατηρήσεις"

	#######################################################################@

	sect["kodikos"] = "Στοιχεία βεβαίωσης"
	sect["imerominia"] = "Στοιχεία βεβαίωσης"
	sect["ipalilos"] = "Στοιχεία βεβαίωσης"
	sect["onoma"] = "Στοιχεία βεβαίωσης"
	sect["filo"] = "Στοιχεία βεβαίωσης"

	sect["oxima"] = "Στοιχεία οχήματος"
	sect["marka"] = "Στοιχεία οχήματος"
	sect["xroma"] = "Στοιχεία οχήματος"
	sect["tipos"] = "Στοιχεία οχήματος"

	sect["afm"] = "Στοιχεία υπόχρεου"
	sect["onomasia"] = "Στοιχεία υπόχρεου"
	sect["dief"] = "Στοιχεία υπόχρεου"
	sect["tk"] = "Στοιχεία υπόχρεου"
	sect["perioxi"] = "Στοιχεία υπόχρεου"

	sect["paravasi"] = "Στοιχεία πράβασης"
	sect["diataxi"] = "Στοιχεία πράβασης"
	sect["lektiko"] = "Στοιχεία πράβασης"
	sect["topos"] = "Στοιχεία πράβασης"
	sect["geox"] = "Στοιχεία πράβασης"
	sect["geoy"] = "Στοιχεία πράβασης"

	sect["pinakides"] = "Κυρώσεις & πρόστιμα"
	sect["adia"] = "Κυρώσεις & πρόστιμα"
	sect["diploma"] = "Κυρώσεις & πρόστιμα"
	sect["prostimo"] = "Κυρώσεις & πρόστιμα"

	sect["info"] = "Άλλα στοιχεία"

	if (listcol == "rep") {
		for (i = 0; i < nf; i++)
		printf("%-10s %-20s %s\n", list[i], sect[list[i]], desc[list[i]])

		return
	}

	if (listcol == "list") {
		printf list[0]

		for (i = 1; i < nf; i++)
		printf "," list[i]

		print ""
		return
	}

	for (i = 0; i < nf; i++) {
		if (sect[list[i]] != prev) {
			if (prev)
			print ""

			prev = sect[list[i]]
			print prev

			for (l = length(prev); l > 0; l--)
			printf "*"

			print ""
		}

		printf("%-10s %s\n", list[i], desc[list[i]])
	}
}
