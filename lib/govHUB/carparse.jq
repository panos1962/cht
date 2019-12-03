#!/usr/bin/env jq

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
###############################################################################@
#
# Το παρόν πρόγραμμα επεξεργάζεται στοιχεία οχημάτων/κατόχων τα οποία έχουν
# παραληφθεί ως JSON objects από το πρόγραμμα "GH/carget" και εκτυπώνει στο
# output τα ίδια στοιχεία επιπεδοποιημένα. Πτώτη γραμμή στην εκτύπωση είναι
# ο αρ. κυκλοφορίας του οχήματος, ακολουθεί κάποιο id (κωδικός παράβασης,
# αριθμός αιτήματος κλπ), η ημερομηνία, και ακολουθούν τα στοιχεία κατόχου.
#
###############################################################################@

("VEHICLE\t" + (select((.[0][0] == "vehicle") and
	(.[0][1] == "getVehicleInformationOutputRecord") and
	(.[0][2] == "arithmosKykloforias"))|.[1])),
("ID\t" + (select(.[0][0] == "id")|.[1])),
("DATE\t" + (select(.[0][0] == "date")|.[1])),
(select((.[0][0] == "vehicle") and
	(.[0][1] == "getVehicleInformationOutputRecord") and
	(.[0][2] == "katoxoiList"))|
	("ΑΦΜ\t" + ((select(.[0][4] == "afm")|.[1])|tostring)),
	("ΠΟΣΟΣΤΟ\t" + ((select(.[0][4] == "percent")|.[1])|tostring)),
	("ΔΟΥ\t" + (select(.[0][4] == "doy")|.[1])),
	("ΠΕΡΙΓΡΑΦΗ ΔΟΥ\t" + (select(.[0][4] == "doyDesc")|.[1])),
	("ΕΠΩΝΥΜΙΑ\t" + (select(.[0][4] == "appelation")|.[1])),
	("ΜΟΡΦΗ\t" + (select(.[0][4] == "legalStatusDesc")|.[1])),
	("ΕΠΩΝΥΜΟ\t" + (select(.[0][4] == "surname")|.[1])),
	("ΕΠΩΝΥΜΟ2\t" + (select(.[0][4] == "secondSurname")|.[1])),
	("ΟΝΟΜΑ\t" + (select(.[0][4] == "firstName")|.[1])),
	("ΠΑΤΡΩΝΥΜΟ\t" + (select(.[0][4] == "fathersFirstName")|.[1])),
	("ΜΗΤΡΩΝΥΜΟ\t" + (select(.[0][4] == "mothersFirstName")|.[1])),
	("ΟΔΟΣ\t" + (select(.[0][4] == "address")|.[1])),
	("ΑΡΙΘΜΟΣ\t" + (select(.[0][4] == "addressNo")|.[1])),
	("ΤΚ\t" + (select(.[0][4] == "parZipCode")|.[1])),
	("ΠΕΡΙΟΧΗ\t" + (select(.[0][4] == "parDescription")|.[1]))
),
("ERRCODE\t" + (select((.[0][0] == "vehicle") and
	(.[0][1] == "errorRecord") and
	(.[0][2] == "errorCode") and (.[1]))|.[1])),
("ERROR\t" + (select((.[0][0] == "vehicle") and
	(.[0][1] == "errorRecord") and
	(.[0][2] == "errorDescr") and (.[1]))|.[1]))
