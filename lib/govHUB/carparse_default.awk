#!/usr/bin/env awk

BEGIN {
	OFS = "\t"

	kodikos_tag = "ΚΩΔΙΚΟΣ"
	pososto_tag = "ΠΟΣΟΣΤΟ"
	afm_tag = "ΑΦΜ"
	eponimo_tag = "ΕΠΩΝΥΜΟ"
	eponimo2_tag = "ΕΠΩΝΥΜΟ2"
	odos_tag = "ΟΔΟΣ"
	arithmos_tag = "ΑΡΙΘΜΟΣ"
	error_tag = "ERROR"
}

NF < 1 {
	next
}

$1 == kodikos_tag {
	print_klisi()
	reset_klisi()
}

is_error() {
	next
}

$1 == pososto_tag {
	if ($2 != 100) {
		error_set("διαπιστώθηκε συνιδιοκτησία")
		next
	}
}

{
	klisi[$1] = $2
}

END {
	print_klisi()
}

function print_klisi() {
	if (oxi_kodikos())
	return

	if (is_error())
	return pd_errmsg(klisi[kodikos_tag] ": " klisi[error_tag])

	if (oxi_katoxos())
	return pd_errmsg(klisi[kodikos_tag] ": δεν βρέθηκαν στοιχεία κατόχου")

	print \
	klisi[kodikos_tag], \
	klisi["ΠΙΝΑΚΙΔΑ"], \
	klisi[afm_tag], \
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

function is_error() {
	return (error_tag in klisi)
}

function oxi_kodikos() {
	return !(kodikos_tag in klisi)
}

function oxi_katoxos(		eponimo) {
	if (!(pososto_tag in klisi))
	return 1

	if (!(afm_tag in klisi))
	return 1

	klisi[eponimo_tag] = onoma_push(klisi[eponimo_tag], klisi[eponimo2_tag])
	return !(klisi[eponimo_tag])
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
