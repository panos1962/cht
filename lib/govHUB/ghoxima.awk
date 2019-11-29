#!/usr/bin/env gawk

BEGIN {
	FS = ":"
	curl_build()

	if (!protocol_date)
	protocol_date = simera

	if (!protocol_number)
	protocol_number = 1
}

NF < 1 {
	next
}

NF > 2 {
	pd_errmsg($0 ": syntax error")
	next
}

{
	curl_exec($1, $2)
}

function curl_exec(oxima, imerominia,		cmd) {
	if (!imerominia)
	imerominia = simera

	cmd = curlcmd \
	"auditProtocolNumber:" (protocol_number++) "," \
	"auditProtocolDate:\"" protocol_date "\"" \
	"},getVehicleInformationInputRecord:{" \
	"arithmosKykloforias:\"" oxima "\"," \
	"requestDate:\"" imerominia "\"}}'"

	if (system(cmd))
	pd_errmsg($0 ": request failed")

	fflush()
}

function curl_build(		errs) {
	if (!url)
	errs += pd_errmsg("missing url")

	if (!token)
	errs += pd_errmsg("missing token")

	if (errs)
	exit(1)

	curlcmd = "curl --request POST --url " url \
	" --header \"Accept: text/plain\"" \
	" --header \"Authorization: Bearer " token "\"" \
	" --header \"Content-Type: application/json\"" \
	" --data '{" \
	"auditRecord:{" \
	"auditUserId:\"" user_id "\"," \
	"auditUserIp:\"" user_ip "\"," \
	"auditTransactionId:1," \
}

function syntax_error() {
	if (NF < 1)
	return 1

	if (NF > 2)
	return 1

	return 0
}
