#!/usr/bin/env awk

BEGIN {
	OFS = "\t"

	vehicle_tag = "VEHICLE"
	id_tag = "ID"
	errcode_tag = "ERRCODE"
	error_tag = "ERROR"

	katoxos_tag[afm_tag = "ΑΦΜ"]
	katoxos_tag[pososto_tag = "ΠΟΣΟΣΤΟ"]
	katoxos_tag[eponimia_tag = "ΕΠΩΝΥΜΙΑ"]
	katoxos_tag[morfi_tag = "ΜΟΡΦΗ"]
	katoxos_tag[eponimo_tag = "ΕΠΩΝΥΜΟ"]
	katoxos_tag[eponimo2_tag = "ΕΠΩΝΥΜΟ2"]
	katoxos_tag[odos_tag = "ΟΔΟΣ"]
	katoxos_tag[arithmos_tag = "ΑΡΙΘΜΟΣ"]
	katoxos_tag[tk_tag = "ΤΚ"]
	katoxos_tag[perioxi_tag = "ΠΕΡΙΟΧΗ"]
}

$1 == vehicle_tag {
	print_oxima()
	reset_oxima()
}

# Το πεδίο του ΑΦΜ κατόχου είναι το πρώτο πεδίο κάθε κατόχου. Ως εκ τούτου
# το χρησιμοποιούμε για να αυξήσουμε τον δείκτη κατόχου.

$1 == afm_tag {
	katoxos_count++
}

# Αν πρόκειται για στοιχείο κατόχου, τότε το κρατώ ως στοιχείο τού
# τρέχοντος κατόχου.

$1 in katoxos_tag {
	katoxos[katoxos_count][$1] = $2
	next
}

# Τα πεδία του οχήματος πρέπει να εμφανίζονται στο input μια μόνο φορά. Επειδή
# το πεδίο "ERROR" -για λόγους που δεν έχω αποσαφηνίσει ακόμη- εμφανίζεται και
# δεύτερη φορά, καλού κακού κρατώ μόνο την πρώτη τιμή που εμφανίζεται για κάθε
# πεδίο του οχήματος.

!($1 in oxima) {
	oxima[$1] = $2
}

END {
	print_oxima()
}

function print_oxima(		i) {
	if (no_vehicle())
	return

	if (no_katoxos())
	return errmsg("Δεν υπάρχουν στοιχεία κατόχου")

	if (multi_katoxos())
	return errmsg("Διαπιστώθηκε συνιδιοκτησία")

	if (is_error())
	return

	for (i = 1; i <= katoxos_count; i++)
	print \
	oxima[vehicle_tag], \
	oxima[id_tag], \
	katoxos[i][afm_tag], \
	katoxos[i][pososto_tag], \
	katoxos[i][eponimia_tag], \
	katoxos[i][morfi_tag], \
	katoxos[i][eponimo_tag], \
	katoxos[i][onoma_tag], \
	katoxos[i][patronimo_tag], \
	katoxos[i][mitronimo_tag], \
	katoxos[i][odos_tag], \
	katoxos[i][arithmos_tag], \
	katoxos[i][tk_tag], \
	katoxos[i][perioxi_tag]
}

function reset_oxima() {
	delete oxima
	delete katoxos
	katoxos_count = 0
}

function is_error(		msg) {
	if (oxima[errcode_tag])
	msg = oxima[errcode_tag]

	if (oxima[error_tag]) {
		if (msg)
		msg = msg ": "

		msg = msg oxima[error_tag]
	}

	if (msg)
	return errmsg(msg)

	return 0
}

function no_vehicle() {
	return !(vehicle_tag in oxima)
}

function no_katoxos(		i) {
	if (katoxos_count)
	return 0

	if (!none)
	return 1

	for (i in katoxos_tag)
	katoxos[1][i] = ""

	if (oxima[errcode_tag] == "VH_WITHOUT_OWNER") {
		oxima[errcode_tag] = ""
		oxima[error_tag] = ""
	}

	return 0
}

function multi_katoxos() {
	if (katoxos_count < 2)
	return 0

	if (multi)
	return 0

	return 1
}

function errmsg(msg) {
	msg = oxima[vehicle_tag] ": " msg

	if (id_tag in oxima)
	msg = oxima[id_tag] ": " msg

	pd_errmsg(msg)
	return 1
}
