BEGIN {
	if (!ENVIRON["CHT_BASEDIR"])
	ENVIRON["CHT_BASEDIR"] = "/var/opt/cht"

	cht_basedir = ENVIRON["CHT_BASEDIR"]
	post = "node " cht_basedir "/lib/govHUB/carget.js"
	end_mark = "__END__"
	err_mark = "__ERR__"

	print "{\"opts\":{" \
		"\"debug\":false," \
		"\"endMark\":\"" end_mark "\"," \
		"\"errMark\":\"" err_mark "\"" \
		"}}" |& post

	while ((post |& getline x) > 0) {
		if (x == end_mark)
		break

		if (x == err_mark)
		break
	}
}

{
	print $0 |& post
	fflush()

	rsp = ""

	while ((post |& getline x) > 0) {
		if (x == end_mark)
		break

		if (x == err_mark)
		break

		rsp = rsp x
	}

	if (x == err_mark) {
		print $0 ": generic error"
		next
	}

	print rsp
}
