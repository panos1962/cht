#!/usr/bin/env awk

BEGIN {
	OFS = "\t"

	kodikos_tag = "ΚΩΔΙΚΟΣ"
	pososto_tag = "ΠΟΣΟΣΤΟ"
	afm_tag = "ΑΦΜ"
	eponimia_tag = "ΕΠΩΝΥΜΙΑ"
	morfi_tag = "ΜΟΡΦΗ"
	eponimo_tag = "ΕΠΩΝΥΜΟ"
	eponimo2_tag = "ΕΠΩΝΥΜΟ2"
	odos_tag = "ΟΔΟΣ"
	arithmos_tag = "ΑΡΙΘΜΟΣ"
	errcode_tag = "ERRCODE"
	error_tag = "ERROR"
}

NF < 1 {
	next
}

$1 == kodikos_tag {
	print_klisi()
	reset_klisi()
}

$1 == pososto_tag {
	if ($2 != 100) {
		error_set("Διαπιστώθηκε συνιδιοκτησία")
		next
	}
}

!($1 in klisi) {
	klisi[$1] = $2
}

END {
	print_klisi()
}

function print_klisi() {
	if (oxi_kodikos())
	return

	if (is_error())
	return

	if (oxi_katoxos())
	return pd_errmsg(klisi[kodikos_tag] ": δεν βρέθηκαν στοιχεία κατόχου")

	print \
	klisi[kodikos_tag], \
	klisi["ΠΙΝΑΚΙΔΑ"], \
	klisi[afm_tag], \
	klisi[eponimia_tag], \
	klisi[morfi_tag], \
	klisi[eponimo_tag], \
	klisi[onoma_tag], \
	klisi["ΠΑΤΡΩΝΥΜΟ"], \
	klisi["ΜΗΤΡΩΝΥΜΟ"], \
	odos_fix(), \
	klisi["ΤΚ"], \
	klisi["ΠΕΡΙΟΧΗ"]
}

function reset_klisi() {
	delete klisi
}

function error_set(error) {
	klisi[error_tag] = error
}

function is_error(		ante, msg) {
	ante = klisi[kodikos_tag] ": "

	if (klisi[error_tag]) {
		msg = ante klisi[error_tag]
		ante = " "
	}

	if (klisi[errcode_tag])
	msg = msg ante "(" klisi[errcode_tag] ")"
		
	if (!msg)
	return 0

	pd_errmsg(msg)
	return 1
}

function oxi_kodikos() {
	return !(kodikos_tag in klisi)
}

function oxi_katoxos(		katoxos) {
	if (!(pososto_tag in klisi))
	return 1

	if (!(afm_tag in klisi))
	return 1

	klisi[eponimo_tag] = onoma_push(klisi[eponimo_tag], klisi[eponimo2_tag])
	delete klisi[eponimo2_tag]

	if (klisi[eponimia_tag])
	return 0

	if (klisi[eponimo_tag])
	return 0

	return 1
}

function odos_fix() {
	if (klisi[arithmos_tag])
	return klisi[odos_tag] " " klisi[arithmos_tag]

	return klisi[odos_tag]
}

function onoma_push(s, t) {
	if (!t)
	return s

	if (!s)
	return t

	return s "-" t
}
