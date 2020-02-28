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
## lib/dimas.awk —— Awk library δημοτικής αστυνομίας
## @FILE END
##
## @HISTORY BEGIN
## Created: 2020-02-26
## @HISTORY END
##
## @END
##
###############################################################################@


# Το παρόν αποτελεί SPAWK utility functions library για την τοπική database
# 'dimas'.

@load "spawk.so"

BEGIN {
	OFS = "\t"

	if (!cht_basedir)
	cht_basedir = ENVIRON["CHT_BASEDIR"]

	if (!dimas_dbconf_file)
	dimas_dbconf_file = cht_basedir "/private/dimasdb.cf"

	dimas_dbconf_fetch()

	spawk_verbose = 1
	spawk_sesami["dbname"] = dimas_dbconf["dbname"]
	spawk_sesami["dbuser"] = dimas_dbconf["dbuser"]
	spawk_sesami["dbpassword"] = dimas_dbconf["dbpass"]
	spawk_sesami["dbcharset"] = "utf8"

	# Βασικά στοιχεία πρό-κλησης

	dimas_proklicol["kodikos"]
	dimas_proklicol["imerominia"]
	dimas_proklicol["ipalilos"]
	dimas_proklicol["onoma"]
	dimas_proklicol["filo"]

	# Στοιχεία οχήματος

	dimas_proklicol["oxima"]
	dimas_proklicol["marka"]
	dimas_proklicol["xroma"]
	dimas_proklicol["tipos"]

	# Στοιχεία υπόχρεου

	dimas_proklicol["afm"]
	dimas_proklicol["onomasia"]
	dimas_proklicol["dief"]
	dimas_proklicol["tk"]
	dimas_proklicol["perioxi"]

	# Στοιχεία παράβασης

	dimas_proklicol["paravasi"]
	dimas_proklicol["diataxi"]
	dimas_proklicol["lektiko"]
	dimas_proklicol["topos"]
	dimas_proklicol["geox"]
	dimas_proklicol["geoy"]

	# Κυρώσεις και πρόστιμα

	dimas_proklicol["pinakides"]
	dimas_proklicol["adia"]
	dimas_proklicol["diploma"]
	dimas_proklicol["prostimo"]

	# Διάφορα άλλα στοιχεία

	dimas_proklicol["info"]
}

function dimas_dbconf_fetch(		s, a, f) {
	delete dimas_dbconf
	close(dimas_dbconf_file)

	while ((getline s <dimas_dbconf_file) > 0) {
		if (split(s, a, "=") != 2)
		continue

		if (sub("^\"", "", a[2]))
		sub("\"$", "", a[2])

		dimas_dbconf[a[1]] = a[2]
	}

	if (close(dimas_dbconf_file))
	pd_fatal(dimas_dbconf_file ": cannot read '" \
		dimas_dbconf_file "' configuration file")
}

function dimas_astinomikos_fetch(			query, row) {
	query = "SELECT `kodikos`, `onomateponimo`, `filo` " \
		"FROM `dimas`.`ipalilos` " \
		"WHERE `katigoria` = " spawk_escape("ΔΗΜΟΤΙΚΗ ΑΣΤΥΝΟΜΙΑ")

	if (spawk_submit(query, "ASSOC") != 3)
	pd_fatal("cannot locate `dimas`.`ipalilos`")

	while (spawk_fetchrow(row)) {
		dimas_astinomikos[row["kodikos"]]["onomateponimo"] = row["onomateponimo"]
		dimas_astinomikos[row["kodikos"]]["filo"] = row["filo"]
	}
}

function dimas_proklisi_fetch(proklisi,			kodikos, query) {
	kodikos = proklisi["kodikos"] + 0

	query = "SELECT * FROM `dimas`.`proklisi` " \
		"WHERE `kodikos` = " kodikos

	if (spawk_submit(query, "ASSOC") != 3)
	pd_fatal(kodikos ": cannot locate `dimas`.`proklisi`")

	if (!spawk_fetchone(proklisi)) {
		proklisi["kodikos"] = kodikos
		return 0
	}

	if ((proklisi["kodikos"] += 0) != kodikos) {
		proklisi["kodikos"] = kodikos
		return 0
	}

	return 1
}

function dimas_proklidata_fetch(proklisi,		query, row) {
	delete proklisi["proklidata"]

	query = "SELECT * FROM `dimas`.`proklidata` " \
		"WHERE `proklisi` = " proklisi["kodikos"]

	if (spawk_submit(query, "ASSOC") != 3)
	pd_fatal(kodikos ": cannot locate `dimas`.`proklidata`")

	while (spawk_fetchrow(row))
	proklisi["proklidata"][row["katigoria"]][row["idos"]] = row["timi"]

	# Αν η πρό-κληση στερείται στοιχείων προσθέτουμε το array "proklidata"

	if (!("proklidata" in proklisi))
	proklisi["proklidata"][""]
}
