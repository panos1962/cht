<?php
///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Created: 2020-01-06
//
///////////////////////////////////////////////////////////////////////////////@

//header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header("Content-Type: text/plain; charset=utf-8");

try {
	@$count = count($_POST["data"]);
}

catch (Exception $e) {
	exit(0);
}

if (!$count)
exit(0);

$tmpdir = getcwd() . "/tmp";
$onoma = tempnam($tmpdir, sha1(uniqid()));

if (!$onoma)
exit(0);

$ifile = $onoma;
$fp = fopen($ifile, "w");

foreach ($_POST["data"] as $val) {
	foreach($val as $i => $x) {
		if ($i > 0)
		fwrite($fp, "\t");

		fwrite($fp, $x);
	}

	fwrite($fp, "\n");
}

fclose($fp);

$ofile = $onoma . ".xlsx";

system("ssconvert " .
	"--data-dir='tmp' " .
	"--import-type='Gnumeric_stf:stf_csvtab' " .
	"--export-type='Gnumeric_Excel:xlsx' " .
	$ifile . " " . $ofile . " >/dev/null 2>&1");
unlink($ifile);
print basename($ofile);
exit(0);
?>
