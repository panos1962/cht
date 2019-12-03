#!/usr/bin/env awk

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
###############################################################################@
#
# Το παρόν awk script διαβάζει γραμμές που περιέχουν tab separated fields
# μεταξύ των οποίων εμπεριέχονται αρ. κυκλοφορίας οχήματος και ημερομηνία,
# και επιχειρεί να πάρει από την πλατφόρμα "govHUB" τα στοιχεία κατόχου τού
# συγκεκριμένου οχήματος για τη συγκεκριμένη ημερομηνία. Η εν λόγω πλατφόρμα
# επιστρέφει τα δεδομένα ως JSON object, το οποίο εκτυπώνεται αυτούσιο στο
# output.
#
###############################################################################@

BEGIN {
	init()
}

# Το πρόγραμμα μπορεί να δέχεται κενές γραμμές τις οποίες απλώς αγνοεί.

NF < 1 {
	next
}

# Ελέγχουμε αν υπάρχουν οι απαραίτητες στήλες στην είσοδο. Οι στήλες αυτές
# αναφέρονται σε στοιχεία που είναι χρήσιμα στην αναζήτηση. Ως υποχρεωτικό
# στοιχείο λογίζεται μόνο ο αριθμός κυκλοφορίας οχήματος.

NF < min_cols {
	pd_errmsg($0 ": syntax error")
	next
}

# Το input έχει ελεγχθεί κατά το δυνατόν, οπότε μπορούμε να προχωρήσουμε
# στην αναζήτηση των στοιχείων του οχήματος.

{
	carget()
}

# Η function "carget" επιτελεί την αναζήτηση στοιχείων οχημάτων/κατόχων
# αποστέλλοντας τον αρ. κυκλοφορίας, την ημερομηνία παράβασης κλπ.

function carget(	vehicle, imerominia, kodikos, cmd, rsp, s) {
	vehicle = $(vehicle_col)

	if (imerominia_col)
	imerominia = $(imerominia_col)

	else
	imerominia = simera

	if (kodikos_col)
	kodikos = $(kodikos_col)

	# Το πρόγραμμα ζητά, εκτός των άλλων στοιχείων, έναν αριθμό
	# πρωτοκόλλου αιτήματος και την ημερομηνία της αίτησης. Αυτά
	# τα στοιχεία είναι τα "protocol_number" και "protocol_date".

	cmd = curlcmd \
	"auditProtocolNumber:" (protocol_number++) "," \
	"auditProtocolDate:\"" protocol_date "\"" \
	"},getVehicleInformationInputRecord:{" \
	"arithmosKykloforias:\"" vehicle "\"," \
	"requestDate:\"" imerominia "\"}}'"

	# Τα δεδομένα θα παραληφθούν γραμμή-γραμμή και θα αποθηκευτούν σε
	# ένα ενιαίο string.

	rsp = ""

	while ((cmd | getline s) > 0) {
		if (rsp)
		rsp = rsp "\n"

		rsp = rsp s
	}

	close(cmd)

	# Αν δεν επεστράφησαν καθόλου δεδομένα, τότε σημαίνει ότι κάτι δεν
	# πήγε καλά και ως εκ τούτου εκτυπώνουμε την τρέχουσα input line
	# στο standar error.

	if (!rsp)
	return pd_errmsg($0 ": request failed (no data returned)")

	# Εγκιβωτίζουμε το επιστραφέν JSON object σε άλλο μεγαλύτερο, στο
	# οποίο προσθέτουμε ως properties τον κωδικό παράβασης ("id"), και
	# την ημερομηνία παράβασης ("date").

	printf "{"

	printf \
	"\"vehicle\":" rsp "," \
	"\"date\":\"" imerominia "\","

	if (kodikos_col)
	printf "\"id\":\"" $(kodikos_col) "\""

	print "}"

	fflush()
}

function init(			errs) {
	if (!url)
	errs += pd_errmsg("missing url")

	if (!token)
	errs += pd_errmsg("missing token")

	if (errs)
	exit(1)

	if (!sep)
	FS = "\t"

	if (ofs)
	OFS = ofs

	else
	OFS = FS

	if (!vehicle_col)
	vehicle_col = 1

	# Η παράμετρος "min_cols" είναι το ελάχιστο πλήθος στηλών που πρέπει
	# να υπάρχουν στο input, σύμφωνα με τις στήλες που έχουμε καθορίσει
	# για τον αρ. κυκλοφορίας, την ημερομηνία, και τον κωδικός παράβασης.

	min_cols = vehicle_cols

	if (!imerominia_col)
	imerominia_col = 0

	else if (imerominia_col > min_cols)
	min_cols = imerominia_col

	if (!kodikos_col)
	kodikos_col = 0

	else if (kodikos_col > min_cols)
	min_cols = kodikos_col

	simera = strftime("%Y-%m-%d")

	if (!protocol_date)
	protocol_date = simera

	if (!protocol_number)
	protocol_number = 1

	# Το πρώτο κομμάτι της εντολής "curl" μέσω της οποίας θα ζητηθούν τα
	# στοιχεία οχήματος/κατόχων, είναι κοινό για όλα τα αιτήματα που θα
	# υποβάλουμε.

	curlcmd = "curl" \
	" --silent" \
	" --request POST" \
	" --url " url \
	" --header \"Accept: text/plain\"" \
	" --header \"Authorization: Bearer " token "\"" \
	" --header \"Content-Type: application/json\"" \
	" --data '{" \
	"auditRecord:{" \
	"auditUserId:\"" user_id "\"," \
	"auditUserIp:\"" user_ip "\"," \
	"auditTransactionId:1,"
}
