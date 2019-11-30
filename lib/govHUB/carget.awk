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
	curl_exec($(id_col), $(license_col), $(date_col))
}

END {
	if (row_sep)
	print "\n]"
}

function curl_exec(id, license, date,		cmd, data, x) {
	if (!date)
	date = simera

	cmd = curlcmd \
	"auditProtocolNumber:" (protocol_number++) "," \
	"auditProtocolDate:\"" protocol_date "\"" \
	"},getVehicleInformationInputRecord:{" \
	"arithmosKykloforias:\"" license "\"," \
	"requestDate:\"" date "\"}}'"

	data = ""

	while ((cmd | getline x) > 0)
	data = data x

	close(cmd)

	if (!data)
	return pd_errmsg($0 ": request failed")

	if (!row_sep)
	row_sep = "[\n"

	printf row_sep "{" \
		"\"id\":\"" $(id_col) "\"," \
		"\"date\":\"" date "\"," \
		"\"vehicle\":" data

	printf "}"
	fflush()

	row_sep = ",\n"
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

	if (!id_col)
	id_col = 1

	if (!license_col)
	license_col = id_col + 1

	if (!date_col)
	date_col = license_col + 1

	min_cols = id_col

	if (license_col > min_cols)
	min_cols = license_col

	if (date_col > min_cols)
	min_cols = date_col

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

function syntax_error() {
	if (NF < 1)
	return 1

	if (NF > 2)
	return 1

	return 0
}
