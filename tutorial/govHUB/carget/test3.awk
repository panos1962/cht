#!/ude/bin/env awk

BEGIN {
	FS = "\t"
}

NF == 2 {
	print "{\"oxima\":\"" $1 "\",\"date\":\"" $2 "\"}"
}
