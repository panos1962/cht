@include "pandora.awk"

BEGIN {
	FS = "\t"
	OFS = "\t"

	# Ο πίνακας "filo" αποκωδικοποιεί το πεδίο "FYLOFLAG" του
	# πίνακα "MISTERGAZ" του πίνακα εργαζομένων.

	filo["1"] = "ΑΝΔΡΑΣ"
	filo["2"] = "ΓΥΝΑΙΚΑ"

	# Ο πίνακας "prokat" αποκωδικοποιεί το πεδίο "KATIGERGAZFLAG" του
	# πίνακα "MISTERGAZ", το οποίο δείχνει την κατηγορία προσωπικού στην
	# οποία ανήκει ο εργαζόμενος. Επειδή όμως στις κατηγορίες προσωπικού
	# υπάρχουν και κατηγορίες που αφορούν σε αιρετούς, μετακλητούς κλπ,
	# παρέχεται και ο πίνακας "prokatexer" στο οποίο εντάσσουμε εκείνες
	# τις κατηγορίες που θέλουμε να εξαιρεθούν από το παρατηρητήριο.

	prokat["1"] = "ΜΟΝΙΜΟΣ"
	prokat["2"] = "ΕΚΤΑΚΤΟΣ"
	prokat["3"] = "ΣΥΜΒΑΣΗ ΕΡΓΟΥ"
	prokat["4"] = "ΑΙΡΕΤΟΣ"
	prokatexer["4"]
	prokat["5"] = "ΜΕΤΑΚΛΗΤΟΣ"
	prokat["6"] = "ΚΟΙΝΩΦΕΛΗΣ ΕΡΓΑΣΙΑ"
	prokat["7"] = "ΠΡΟΓΡΑΜΜΑ STAGE"

	# Πέρα από την γενική κατηγορία προσωπικού στην οποία είναι ενταγμένοι
	# οι εργαζόμενοι του Δήμου, υπάρχει και το πεδίο "MSH_CD" του πίνακα
	# "MISTERGAZ" που δείχνει τη σχέση εργασίας που διατηρεί ο εργαζόμενος
	# με τον Δήμο Θεσσαλονίκης.

	sxeser["1"] = "ΤΑΚΤΙΚΟ ΠΡΟΣΩΠΙΚΟ"
	sxeser["4.1"] = "ΑΟΡΙΣΤΟΥ ΧΡΟΝΟΥ ΜΕΡΙΚΗΣ ΑΠΑΣΧΟΛΗΣΗΣ"
	sxeser["4"] = "ΑΟΡΙΣΤΟΥ ΧΡΟΝΟΥ"
	sxeser["5"] = "ΟΡΙΣΜΕΝΟΥ ΧΡΟΝΟΥ"
	sxeser["6"] = "ΜΙΣΘΩΤΟΙ ΜΕΡΙΚΗΣ ΑΠΑΣΧΟΛΗΣΗΣ"
	sxeser["7.1"] = "ΣΥΜΒΑΣΗ ΕΡΓΟΥ ΜΕ ΜΠΛΟΚΑΚΙ"
	sxeser["8"] = "ΠΡΑΚΤΙΚΗ ΑΣΚΗΣΗ"
	sxeser["8.1"] = "ΠΡΑΚΤΙΚΗ ΑΣΚΗΣΗ"
	sxeser["13"] = "ΔΕΝ ΜΙΣΘΟΔΟΤΕΙΤΑΙ"
	sxeser["14"] = "ΕΜΜΙΣΘΟΣ ΔΙΚΗΓΟΡΟΣ"
	sxeser["16"] = "ΚΟΙΝΩΦΕΛΗΣ ΕΡΓΑΣΙΑ"
	sxeser["30"] = "ΔΙΑΘΕΣΙΜΟΤΗΤΑ"
	sxeser["31"] = "ΑΡΓΙΑ"

	# Ο πίνακας "epipekpe" αποκωδικοποιεί το επίπεδο εκπαίδευσης το
	# οποίο περιέχεται στο πεδίο "MMK_ID" του πίνακα "MISTERGAZ".

	epipekpe["1"] = "ΥΠΟΧΡΕΩΤΙΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["2"] = "ΔΕΥΤΕΡΟΒΑΘΜΙΑΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["10"] = "ΔΕΥΤΕΡΟΒΑΘΜΙΑΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["12"] = "ΔΕΥΤΕΡΟΒΑΘΜΙΑΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["15"] = "ΔΕΥΤΕΡΟΒΑΘΜΙΑΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["3"] = "ΤΕΧΝΟΛΟΓΙΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["9"] = "ΤΕΧΝΟΛΟΓΙΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["11"] = "ΤΕΧΝΟΛΟΓΙΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["14"] = "ΤΕΧΝΟΛΟΓΙΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["4"] = "ΠΑΝΕΠΙΣΤΗΜΙΑΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["7"] = "ΠΑΝΕΠΙΣΤΗΜΙΑΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["8"] = "ΠΑΝΕΠΙΣΤΗΜΙΑΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["13"] = "ΠΑΝΕΠΙΣΤΗΜΙΑΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["16"] = "ΠΑΝΕΠΙΣΤΗΜΙΑΚΗΣ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["5"] = "ΑΚΑΘΟΡΙΣΤΗ ΒΑΘΜΙΔΑ ΕΚΠΑΙΔΕΥΣΗΣ"
	epipekpe["6"] = "ΑΚΑΘΟΡΙΣΤΗ ΒΑΘΜΙΔΑ ΕΚΠΑΙΔΕΥΣΗΣ"

	# Το επίπεδο τίτλου σπουδών είναι καταχωρημένο στο πεδίο
	# "BATHMIDAFLAG" του πίνακα τίτλων σπουδών "MISTEPOUDB"
	# και δείχνει ακριβώς το επίπεδο του τίτλου σπουδών. Όσο
	# μεγαλύτερο είναι τόσο πιο σηματικός ο τίτλος.

	titepip["1"] = "ΝΥΧΤΕΡΙΝΟ"
	titepip["2"] = "ΤΕΧΝΙΚΗ ΣΧΟΛΗ"
	titepip["3"] = "ΙΕΚ"
	titepip["4"] = "ΤΕΙ"
	titepip["5"] = "ΑΕΙ"
	titepip["6"] = "ΜΕΤΑΠΤΥΧΙΑΚΟ"
	titepip["7"] = "ΔΙΔΑΚΤΟΡΙΚΟ"

	cur_etos = strftime("%Y")
	cur_minas = strftime("%m")
	cur_mera = strftime("%d")

	# Στην επόμενη γραμμή οι παύλες είναι utf-8 'U+2011'
	cur_date = cur_etos "‑" cur_minas "‑" cur_mera

	errcnt = 0

	ipalilos_reset()
	ipalilos_skip_set()
}

# Οι κενές γραμμές αγνοούνται από το πρόγραμμα.

NF < 1 {
	next
}

# Στην πρώτη θέση βρίσκεται το id του υπαλλήλου. Εξαίρεση αποτελούν βοηθητικά
# δεδομένα, όπου το id υπαλλήλου είναι μηδενικό. Σε αυτές τις περιπτώσεις τα
# δεδομένα χαρακτηρίζονται από το δεύτερο πεδίο ως εξής:
#
#	S: Κατηγορία και επίπεδο σπουδών

$1 == 0 {
	# Οι γραμμές που αφορούν στους τίτλους σπουδών χαρακτηρίζονται από
	# το γράμμα "S" στη δεύτερη θέση.

	if ($2 == "S")
	parse_spoudes()

	else
	error($0 ": άγνωστος τύπος γραμμής βοηθητικών δεδομένων")

	next
}

# Οι γραμμές τύπου "A" περιέχουν τα στοιχεία του εργαζομένου (κωδικός,
# επώνυμο, όνομα κλπ).

$2 == "A" {
	# Κάθε φορά που συναντάμε νέο εργαζόμενο, εκτυπώνουμε τα στοιχεία
	# που αφορούν στον προηγούμενο εργαζόμενο και «μηδενίζουμε» τις
	# δομές καταχώρησης στοιχείων εργαζομένου προκειμένου να υποδεχθούμε
	# τα στοιχεία του νέου εργαζομένου.

	print_ipalilos()
	ipalilos_reset()

	if (NF != 12) {
		error($0 ": syntax error (NF = " NF " <> 10)")
		ipalilos_skip_set()
		next
	}

	parse_ipalilos()
	next
}

# Αν έχει παρουσιαστεί κάποιο σφάλμα κατά την ανάγνωση των δεδομένων του
# τρέχοντος εργαζομένου, τότε αγνοούμε την ανά χείρας γραμμή καθώς δεν θα
# εκτυπώσουμε στοιχεία για τον τρέχοντα (λανθασμένο) εργαζόμενο.

ipalilos_is_skip() {
	next
}

# Οι γραμμές τύπου "B" αφορούν σε επαναπροσλήψεις των εργαζομένων. Κάθε
# γραμμή αφορά σε μια επαναπρόσληψη, ωστόσο το τρίτο πεδίο περιέχει την
# ημερομηνία επαναπρόσληψης προκειμένου να αποφύγουμε τυχόν διπλοπερασμένες
# επαναπροσλήψεις.

$2 == "B" {
	if (NF != 3) {
		error($0 ": syntax error (NF = " NF " <> 1)")
		ipalilos_skip_set()
		next
	}

	# Στο πεδίο "proslipsi" κρατάμε την τελευταία ημερομηνία
	# επαναπρόσληψης προκειμένου να αποφύγουμε τις διπλοεγγραφές.

	if (ipalilos["proslipsi"] == $3)
	next

	ipalilos["proslicnt"]++
	ipalilos["proslipsi"] = $3
	next
}

# Οι γραμμές τύπου "C" αφορούν σε τίτλους σπουδών του τρέχοντος υπαλλήλου.
# Η διαχείριση των τίτλων σπουδών είναι κάπως περίπλοκη οπότε την αναθέτουμε
# σε εξειδικευμένη function η οποία επιστρέφει μηδέν αν δεν συναντήσει
# προβλήματα, αλλιώς επιστρέφει μη μηδενική τιμή και μαρκάρει με σφάλμα
# τον τρέχοντα εργαζόμενο.

$2 == "C" {
	if (process_titlos())
	ipalilos_skip_set()
}

END {
	# Δεν πρέπει να λησμονήσουμε στο τέλος της ανάγνωσης των δεδομένων
	# να εκτυπώνουμε τα στοιχεία του τελευταίου εργαζομένου.

	print_ipalilos()

	if (errcnt)
	pd_errmsg(errcnt " error" (errcnt > 1 ? "s" : "") " encoutered")
}

###############################################################################@

# Η function "parse_spoudes" διαχειρίζεται γραμμές δεδομένων που αφορούν στους
# τίτλους σπουδών. Οι τίτλοι σπουδών υπάρχουν στον πίνακα "MISTSPOUDB", ωστόσο
# δεν τους διαβάζουμε online από την database, αλλά τους διαβάζουμε από αρχείο
# στο οποίο έχουμε προσθέσει πληροφορία σχετική με την «κατηγορία σπουδών» για
# κάθε τίτλο χωριστά. Αυτό σημαίνει ότι κάθε φορά που εισάγονται νέοι τίτλοι
# σπουδών στην database θα πρέπει οι τίτλοι αυτοί να εισάγονται και στο αρχείο.

function parse_spoudes() {
	if (NF != 6)
	return error($0 ": syntax error (NF = " NF " <> 6)")

	spidos[$4] = $3
	spepipedo[$4] = $6 + 0
	next
}

function process_titlos(		val, lev) {
	if (NF != 3)
	return error($0 ": syntax error (NF = " NF " <> 1)")

	val = $3 + 0

	if (val != $3)
	return error($0 ": " $3 ": απαράδεκτος κωδικός τίτλου σπουδών")

	if (!(val in spidos))
	return error($0 ": " val ": άγνωστος τίτλος σπουδών")

	lev = spepipedo[val]

	if (!(lev in titepip))
	return error($0 ": " val ": άγνωστο επίπεδο τίτλου σπουδών")

	# Η επιλογή είδους σπουδών είναι κάπως περίπλοκη διαδικασία
	# οπότε την αναθέτουμε σε ειδική function.

	process_spoudes(spidos[val], lev)

	if (lev > ipalilos["epipedo"]) {
		ipalilos["epipedo"] = lev
		ipalilos["titlos"] = titepip[lev]
	}

	return 0
}

# Η function "process_spoudes" δέχεται το είδος και το επίπεδο σπουδών και
# ενημερώνει τα αντίστοιχα πεδία του τρέχοντος υπαλλήλου.

function process_spoudes(spoudes, epipedo) {
	# Αν ο ανά χείρας τίτλος δεν έχει ενταχθεί σε κάποια συγκεκριμένη
	# κατηγορία σπουδών, τότε δεν χρειάζεται να ασχοληθούμε περαιτέρω.

	if (!spoudes)
	return

	# Αν δεν έχει ήδη συμπληρωθεί είδος σπουδών στον τρέχοντα εργαζόμενο,
	# χρησιμοποιούμε το ανά χείρας είδος σπουδών.

	if (!ipalilos["spoudes"])
	return (ipalilos["spoudes"] = spoudes)

	# Οι 
	if (epipedo > 5)
	return

	if (ipalilos["epipedo"] > epipedo)
	return

	ipalilos["spoudes"] = spoudes
}

function parse_ipalilos(			val, nf, errs) {
	# id υπαλλήλου ########################################################@

	val = $(++nf) + 0

	if (val == $nf)
	ipalilos["id"] = val

	else
	errs += error($0 ": " $nf ": απαράδεκτο ID υπαλλήλου")

	# record-id ("A") #####################################################@

	$(++nf)

	# κωδικός υπαλλήλου ###################################################@

	val = $(++nf) + 0

	if (val == $nf)
	ipalilos["kodikos"] = val

	else
	errs += error($0 ": " $nf ": απαράδεκτος κωδικός υπαλλήλου")

	# επώνυμο, όνομα,  πατρώνυμο ##########################################@

	ipalilos["eponimo"] = $(++nf)
	ipalilos["onoma"] = $(++nf)
	ipalilos["patronimo"] = $(++nf)

	# φύλλο ###############################################################@

	val = $(++nf)

	if (val in filo)
	ipalilos["filo"] = filo[val]

	else
	errs += error($0 ": " $nf ": απαράδεκτο φύλλο υπαλλήλου")

	# έτος γέννησης #######################################################@

	val = pd_dt2dt($(++nf), "YMD", "Y-M-D")

	if (val == $nf) {
		# Στην επόμενη γραμμή η παύλα είναι utf-8 'U+2011'
		gsub(/[^0-9]+/, "‑", val)
		ipalilos["genisi"] = val
	}

	else
	errs += error($0 ": " $nf ": απαράδεκτη ημερομηνία γέννησης υπαλλήλου")

	# κατηγορία προσωπικού ################################################@

	val = $(++nf)

	if (val in prokatexer)
	return 1

	if (val in prokat)
	ipalilos["prokat"] = prokat[val]

	else
	errs += error($0 ": " $nf ": απαράδεκτη κατηγορία προσωπικού")

	# σχέση εργασίας ######################################################@

	val = $(++nf)

	if (val in sxeser)
	ipalilos["sxeser"] = sxeser[val]

	else
	errs += error($0 ": " $nf ": απαράδεκτη σχέση εργασίας")

	# επίπεδο εκπαίδευσης #################################################@

	val = $(++nf)

	if (val in epipekpe)
	ipalilos["epipekpe"] = epipekpe[val]

	else
	errs += error($0 ": " val ": απαράδεκτο επίπεδο σπουδών")

	# κατάσταση υπαλλήλου (ενεργός/ανενεργός) #############################@

	val = $(++nf)

	if (val != 1)
	errs += error($0 ": " val ": απαράδεκτη κατάσταση υπαλλήλου")

	return errs
}

function print_ipalilos() {
	if (ipalilos_is_skip())
	return

	printf \
	cur_date \
	OFS ipalilos["kodikos"]

	if (fulldata)
	printf \
	OFS ipalilos["eponimo"] \
	OFS ipalilos["onoma"] \
	OFS ipalilos["patronimo"]

	printf \
	OFS ipalilos["filo"] \
	OFS ipalilos["genisi"] \
	OFS ilikia(ipalilos["genisi"]) \
	OFS ipalilos["prokat"] \
	OFS ipalilos["sxeser"] \
	OFS ipalilos["proslicnt"] + 0 \
	OFS ipalilos["epipekpe"] \
	OFS ipalilos["titlos"] \
	OFS ipalilos["spoudes"] \
	"\n"
}

function ipalilos_reset() {
	delete ipalilos
}

function ipalilos_skip_set() {
	ipalilos["skip"]
}

function ipalilos_is_skip() {
	return ("skip" in ipalilos)
}

function ilikia(genisi,		ymd, dif) {
	split(genisi, ymd, /[^0-9]+/)

	dif = cur_etos - ymd[1]

	if (dif < 30)
	return "<30"

	if (dif > 50)
	return ">50"

	if (dif == 30) {
		if (ymd[2] < cur_minas)
		return "<30"

		if (ymd[2] > cur_minas)
		return "30-50"

		if (ymd[3] < cur_mera)
		return "<30"

		return "30-50"
	}

	if (dif == 50) {
		if (ymd[2] < cur_minas)
		return "30-50"

		if (ymd[2] > cur_minas)
		return ">50"

		if (ymd[3] < cur_mera)
		return "30-50"

		return ">50"
	}

	return "30-50"
}

function error(s) {
	pd_errmsg(s)
	errcnt++

	return 1
}
