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
		"oxima,marka,xroma,katigoria,katastasi," \
		"afm,onomasia,dief,tk,perioxi," \
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
	proklisi["katigoria"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΚΑΤΗΓΟΡΙΑ"]
	proklisi["katastasi"] = proklisi["proklidata"]["ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ"]["ΚΑΤΑΣΤΑΣΗ"]

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

function list_columns(		list, desc, sect, count) {
	delete list
	delete desc
	delete sect
	count = 0

	list[count++] = "kodikos"
	desc["kodikos"] = "Αριθμός βεβαίωσης"
	sect["kodikos"] = "Στοιχεία βεβαίωσης"

	list[count++] = "imerominia"
	desc["imerominia"] = "Ημερομηνία βεβαίωσης"
	sect["imerominia"] = "Στοιχεία βεβαίωσης"

	list[count++] = "ipalilos"
	desc["ipalilos"] = "Κωδικός υπαλλήλου"
	sect["ipalilos"] = "Στοιχεία βεβαίωσης"

	list[count++] = "onoma"
	desc["onoma"] = "Ονοματεπώνυμο υπαλλήλου"
	sect["onoma"] = "Στοιχεία βεβαίωσης"

	list[count++] = "filo"
	desc["filo"] = "Φύλο υπαλληλου"
	sect["filo"] = "Στοιχεία βεβαίωσης"

	list[count++] = "oxima"
	desc["oxima"] = "Αριθμός κυκλοφορίας"
	sect["oxima"] = "Στοιχεία οχήματος"

	list[count++] = "marka"
	desc["marka"] = "Μάρκα οχήματος"
	sect["marka"] = "Στοιχεία οχήματος"

	list[count++] = "xroma"
	desc["xroma"] = "Χρώμα οχήματος"
	sect["xroma"] = "Στοιχεία οχήματος"

	list[count++] = "tipos"
	desc["tipos"] = "Τύπος οχήματος"
	sect["tipos"] = "Στοιχεία οχήματος"

	list[count++] = "tipos"
	desc["katigoria"] = "Κατηγορία οχήματος"
	sect["katigoria"] = "Στοιχεία οχήματος"

	list[count++] = "tipos"
	desc["katastasi"] = "Κατάσταση οχήματος"
	sect["katastasi"] = "Στοιχεία οχήματος"

	list[count++] = "afm"
	desc["afm"] = "ΑΦΜ υποχρέου"
	sect["afm"] = "Στοιχεία υπόχρεου"

	list[count++] = "onomasia"
	desc["onomasia"] = "Ονοματεπώνυμο / Επωνυμία"
	sect["onomasia"] = "Στοιχεία υπόχρεου"

	list[count++] = "dief"
	desc["dief"] = "Διεύθυνση υποχρέου"
	sect["dief"] = "Στοιχεία υπόχρεου"

	list[count++] = "tk"
	desc["tk"] = "Ταχ. κωδικός υποχρέου"
	sect["tk"] = "Στοιχεία υπόχρεου"

	list[count++] = "perioxi"
	desc["perioxi"] = "Πόλη / Περιοχή"
	sect["perioxi"] = "Στοιχεία υπόχρεου"

	list[count++] = "paravasi"
	desc["paravasi"] = "Κωδικός παράβασης"
	sect["paravasi"] = "Στοιχεία πράβασης"

	list[count++] = "diataxi"
	desc["diataxi"] = "Διάταξη παράβασης"
	sect["diataxi"] = "Στοιχεία πράβασης"

	list[count++] = "lektiko"
	desc["lektiko"] = "Λεκτικό παράβασης"
	sect["lektiko"] = "Στοιχεία πράβασης"

	list[count++] = "topos"
	desc["topos"] = "Τοποθεσία παράβασης"
	sect["topos"] = "Στοιχεία πράβασης"

	list[count++] = "geox"
	desc["geox"] = "Γεωγραφικό πλάτος (latitude)"
	sect["geox"] = "Στοιχεία πράβασης"

	list[count++] = "geoy"
	desc["geoy"] = "Γεωγραφικό μήκος (longitude)"
	sect["geoy"] = "Στοιχεία πράβασης"

	list[count++] = "pinakides"
	desc["pinakides"] = "Αφαίρεση πινακίδων (ημέρες)"
	sect["pinakides"] = "Κυρώσεις & πρόστιμα"

	list[count++] = "adia"
	desc["adia"] = "Αφαίρεση αδείας (ημέρες)"
	sect["adia"] = "Κυρώσεις & πρόστιμα"

	list[count++] = "diploma"
	desc["diploma"] = "Αφαίρεση διπλώματος (ημέρες)"
	sect["diploma"] = "Κυρώσεις & πρόστιμα"

	list[count++] = "prostimo"
	desc["prostimo"] = "Πρόστιμο (σε λεπτά του ευρώ)"
	sect["prostimo"] = "Κυρώσεις & πρόστιμα"

	list[count++] = "info"
	desc["info"] = "Παρατηρήσεις"
	sect["info"] = "Άλλα στοιχεία"

	if (listcol == "list")
	return list_list(list, count)

	if (listcol == "full")
	return list_full(list, sect, desc, count)

	list_light(list, sect, desc, count)
}

function list_full(list, sect, desc, count,		i, prev, l) {
	for (i = 0; i < count; i++) {
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

function list_light(list, sect, desc, count,		i) {
	for (i = 0; i < count; i++)
	printf("%-10s %-20s %s\n", list[i], sect[list[i]], desc[list[i]])
}

function list_list(list, count,		i) {
	if (count < 1)
	return

	printf list[0]

	for (i = 1; i < count; i++)
	printf "," list[i]

	print ""
}
