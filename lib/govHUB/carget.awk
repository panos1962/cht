#!/usr/bin/env gawk

BEGIN {
	init()
}

NF < 1 {
	next
}

NF < min_cols {
	pd_errmsg($0 ": syntax error")
	next
}

{
	carget()
}

END {
exit(0)
}

function carget(	pinakida, imerominia, kodikos, cmd, data, s) {
	pinakida = $(pinakida_col)

	if (imerominia_col)
	imerominia = $(imerominia_col)

	else
	imerominia = simera

	if (kodikos_col)
	kodikos = $(kodikos_col)

	cmd = curlcmd \
	"auditProtocolNumber:" (protocol_number++) "," \
	"auditProtocolDate:\"" protocol_date "\"" \
	"},getVehicleInformationInputRecord:{" \
	"arithmosKykloforias:\"" pinakida "\"," \
	"requestDate:\"" imerominia "\"}}'"

	data = ""

	while ((cmd | getline s) > 0)
	data = data s

	close(cmd)

	# Αν δεν επεστράφησαν καθόλου δεδομένα, τότε σημαίνει ότι κάτι δεν
	# πήγε καλά και ως εκ τούτου εκτυπώνουμε την τρέχουσα input line
	# στο standar error.

	if (!data)
	return pd_errmsg($0 ": request failed (no data returned)")

	printf "{"

	if (kodikos_col)
	printf "\"id\":\"" $(kodikos_col) "\","

	printf \
		"\"date\":\"" imerominia "\"," \
		"\"vehicle\":" data

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

	if (kodikos_col == "")
	kodikos_col = 1

	if (!pinakida_col)
	pinakida_col = kodikos_col + 1

	if (imerominia_col == "")
	imerominia_col = pinakida_col + 1

	min_cols = kodikos_col

	if (pinakida_col > min_cols)
	min_cols = pinakida_col

	if (imerominia_col > min_cols)
	min_cols = imerominia_col

	simera = strftime("%Y-%m-%d")

	if (!protocol_date)
	protocol_date = simera

	if (!protocol_number)
	protocol_number = 1

	curlcmd = "curl --silent --request POST --url " url \
	" --header \"Accept: text/plain\"" \
	" --header \"Authorization: Bearer " token "\"" \
	" --header \"Content-Type: application/json\"" \
	" --data '{" \
	"auditRecord:{" \
	"auditUserId:\"" user_id "\"," \
	"auditUserIp:\"" user_ip "\"," \
	"auditTransactionId:1,"
}
