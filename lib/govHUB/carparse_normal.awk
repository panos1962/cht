#!/usr/bin/env awk

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
###############################################################################@
#
# Το παρόν φίλτρο εκτυπώνει κανονικοποιημένα στοιχεία οχημάτων/κατόχων. Ο όρος
# «κανονικοποιημένα» σημαίνει ότι αν κάποιο όχημα βρεθεί να έχει περισσότερους
# από έναν κατόχους, τότε θα εκτυπωθούν τόσες γραμμές όσες και οι κάτοχοι, με
# τα στοιχεία του οχήματος να επαναλαμβάνονται σε κάθε γραμμή. Αντίθετα, αν
# κάποιο όχημα δεν διαθέτει κατόχους, τότε θα εκτυπωθεί μια γραμμή με τα
# στοιχεία του οχήματος και κενά στοιχεία κατόχου.
#
# Ωστόσο, το πρόγραμμα by default εκτυπώνει δεδομένα μόνο για τα οχήματα τα
# οποία διαθέτουν ακριβώς έναν ιδιοκτήτη. Για να εκτυπώσουμε (κανονικοποιημένα)
# δεδομένα για οχήματα που διαθέτους περισσότερους από έναν κατόχους, θα πρέπει
# η παράμετρος "multi" να είναι true, ενώ για να εκτυπώσουμε δεδομένα για
# οχήματα που δεν διαθέτουν κατόχους, θα πρέπει η παράμετρος "none" να είναι
# true.
#
###############################################################################@

BEGIN {
	OFS = "\t"

	# Το πρόγραμμα διαβάζει key/value pairs. Τα keys είναι συγκεκριμένα
	# και τα αντιστοιχίζουμε σε (global) μεταβλητές.

	vehicle_tag = "VEHICLE"
	id_tag = "ID"
	date_tag = "DATE"
	errcode_tag = "ERRCODE"
	error_tag = "ERROR"

	# Το array "katoxos_tag" δεικτοδοτείται με τα keys που αφορούν στα
	# στοιχεία κατόχου. π.χ. ΑΦΜ, επώνυμο, όνομα, διεύθυνση κλπ.

	katoxos_tag[afm_tag = "ΑΦΜ"]
	katoxos_tag[pososto_tag = "ΠΟΣΟΣΤΟ"]
	katoxos_tag[eponimia_tag = "ΕΠΩΝΥΜΙΑ"]
	katoxos_tag[morfi_tag = "ΜΟΡΦΗ"]
	katoxos_tag[eponimo_tag = "ΕΠΩΝΥΜΟ"]
	katoxos_tag[onoma_tag = "ΟΝΟΜΑ"]
	katoxos_tag[patronimo_tag = "ΠΑΤΡΩΝΥΜΟ"]
	katoxos_tag[mitronimo_tag = "ΜΗΤΡΩΝΥΜΟ"]
	katoxos_tag[odos_tag = "ΟΔΟΣ"]
	katoxos_tag[arithmos_tag = "ΑΡΙΘΜΟΣ"]
	katoxos_tag[tk_tag = "ΤΚ"]
	katoxos_tag[perioxi_tag = "ΠΕΡΙΟΧΗ"]
}

# Η πρώτη γραμμή που διαβάζουμε καθορίζει και το tag αλλαγής οχήματος. Πιο
# συγκεκριμένα, το tag της πρώτης γραμμής θα χρησιμοποιηθεί ως tag αλλαγής
# οχήματος. Συνήθως πρόκειται για τον αρ. κυκλοφορίας ή για τον κωδικό
# παράβασης.

NR == 1 {
	tag_alagis = $1
	oxima[$1] = $2
	next
}

$1 == tag_alagis {
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
# δεύτερη φορά, καλού-κακού κρατώ μόνο την πρώτη τιμή που εμφανίζεται για κάθε
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

	for (i = 1; i <= katoxos_count; i++) {
		eponimo_fix(i)
		arithmos_fix(i)
		katoxos_print(i)
	}
}

function eponimo_fix(i,		eponimo2, eponimo) {
	eponimo2 = katoxos[i][eponimo2_tag]
	if (!eponimo2)
	return

	eponimo = katoxos[i][eponimo_tag]

	if (eponimo)
	katoxos[i][eponimo_tag] = eponimo "-" eponimo2

	else
	katoxos[i][eponimo_tag] = eponimo2
}

function arithmos_fix(i) {
	if (!katoxos[i][arithmos_tag])
	delete katoxos[i][arithmos_tag]
}

function katoxos_print(i) {
	print \
	oxima[vehicle_tag], \
	oxima[id_tag], \
	oxima[date_tag], \
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

	# Αν δεν έχει δοθεί η option "--none", τότε σημαίνει ότι τα οχήματα
	# για τα οποία δεν βρέθηκαν στοιχεία κατόχου, δεν θα εκτυπωθούν.

	if (!none)
	return 1

	# Αν έχει δοθεί η option "--none" τότε θα εκτυπωθούν στοιχεία οχήματος
	# και για τα οχήματα που δεν έχουν στοιχεία κατόχων.

	katoxos_count = 1

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
