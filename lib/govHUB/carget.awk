BEGIN {
	FS = "\t"

	cmd = "node " script
	end_mark = "__END__"
}

{
	print $0 |& cmd
	fflush()

	while ((cmd |& getline x) > 0) {
		if (x == end_mark)
		break

		print x
	}
}
