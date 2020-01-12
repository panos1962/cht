<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// lib/chtCore.php —— Standard PHP library (core module)
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν module μπορούμε να το εισάγουμε (require) στην αρχή οποιουδήποτε
// PHP προγράμματος.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-01-12
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

// Ορίζουμε το singleton "cht" προκειμένου να εντάξουμε σε αυτό όλα τα global
// objects (functions, variables κλπ) του πακέτου "cht".

class cht_core {
	public static $pandora_basedir = NULL;
	public static $pandora_host = NULL;

	private static $init_called = FALSE;

	public static function init_core() {
		if (self::$init_called)
		return;

		self::$init_called = TRUE;
		self::$pandora_basedir = getenv("PANDORA_BASEDIR");

		if (!self::$pandora_basedir)
		self::$pandora_basedir = "/var/opt/pandora";
	}
}

cht_core::init_core();
define("PANDORA_BASEDIR", cht_core::$pandora_basedir);
define("PANDORA_HOST", "http://localhost/pandora");

?>
