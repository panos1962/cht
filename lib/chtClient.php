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
// lib/chtClient.php —— Standard PHP library (client module)
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν module μπορούμε να το εισάγουμε (require) στην αρχή οποιουδήποτε
// PHP client-side προγράμματος.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-01-24
// Updated: 2020-01-16
// Created: 2020-01-12
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

print getcwd();
exit(0);
if (!defined("CHT_BASEDIR"))
require_once("../local/conf.php");

if (!class_exists("pandora"))
require_once(PANDORA_BASEDIR . "/lib/pandoraClient.php");

require_once(CHT_BASEDIR . "/lib/chtCore.php");

class cht extends chtCore {
	public static $www = NULL;

	public static function init() {
		if (isset(self::$www))
		return __CLASS__;

		self::$www = pandora::$host . "/cht";
		return __CLASS__;
	}

	public static function www($s = NULL) {
		return (isset($s) ? self::$www . "/" . $s : self::$www);
	}

	public static function www_print($s) {
		print self::www($s);
		return __CLASS__;
	}
}

cht::init();
define("CHT_WWW", cht::$www);
?>
