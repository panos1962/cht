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
// Updated: 2020-01-16
// Created: 2020-01-12
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

if (!class_exists("pandoraCore"))
require_once("../mnt/pandora/lib/pandoraCore.php");

class chtCore {
	public static $basedir = NULL;

	public static function init_core() {
		if (self::$basedir)
		return;

		self::$basedir = getenv("CHT_BASEDIR");

		if (!self::$basedir)
		self::$basedir = "/var/opt/cht";
	}
}

chtCore::init_core();
define("CHT_BASEDIR", chtCore::$basedir);
?>
