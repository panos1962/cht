#!/usr/bin/env awk

BEGIN {
	FS = "\t"
}

{
	sub(/ *$/, "")
}
