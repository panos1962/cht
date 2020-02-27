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

	dimas_proklicol["kodikos"] = "proklisi"
	dimas_proklicol["imerominia"] = "proklisi"
	dimas_proklicol["ipalilos"] = "proklisi"
	dimas_proklicol["onoma"] = "proklisi"
	dimas_proklicol["filo"] = "proklisi"

	dimas_proklicol["paravasi"] = "paravasi"
	dimas_proklicol["diataxi"] = "paravasi"
	dimas_proklicol["lektiko"] = "paravasi"
	dimas_proklicol["topos"] = "paravasi"
	dimas_proklicol["geox"] = "paravasi"
	dimas_proklicol["geoy"] = "paravasi"

	dimas_proklicol["oxima"] = "oxima"
	dimas_proklicol["marka"] = "oxima"
	dimas_proklicol["xroma"] = "oxima"
	dimas_proklicol["tipos"] = "oxima"

	dimas_proklicol["afm"] = "ipoxreos"
	dimas_proklicol["onomasia"] = "ipoxreos"
	dimas_proklicol["dief"] = "ipoxreos"
	dimas_proklicol["tk"] = "ipoxreos"
	dimas_proklicol["perioxi"] = "ipoxreos"

	dimas_proklicol["pinakides"] = "kirosi"
	dimas_proklicol["adia"] = "kirosi"
	dimas_proklicol["diploma"] = "kirosi"
	dimas_proklicol["prostimo"] = "kirosi"

	dimas_proklicol["info"] = "misc"
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
}
