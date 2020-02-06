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

if (!defined("CHT_BASEDIR"))
require_once("../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtCore.php");

if (!class_exists("pandora"))
require_once(PANDORA_BASEDIR . "/lib/pandoraClient.php");

define("CHT_SESSION_IDOS_XRISTI", "cht_idos_xristi");

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

	public static function idos_xristi_get() {
		return pandora::session_get(CHT_SESSION_IDOS_XRISTI);
	}

	public static function xristis_is_dimas() {
		return (cht::idos_xristi_get() === "dimas");
	}

	public static function xristis_no_dimas() {
		return !cht::xristis_is_dimas();
	}

	public static function xristis_is_ipalilos() {
		return (cht::idos_xristi_get() === "ipalilos");
	}

	public static function xristis_is_user() {
		return (cht::idos_xristi_get() === "user");
	}
}

cht::init();
define("CHT_WWW", cht::$www);
?>
