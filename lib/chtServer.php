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
// lib/chtServer.php —— Standard PHP library (server module)
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν module μπορούμε να το εισάγουμε (require) στην αρχή οποιουδήποτε
// PHP server-side προγράμματος.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-01-12
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("chtCore.php");

class cht extends cht_core {
	private static $init_called = FALSE;

	public static function init() {
		if (self::$init_called)
		return;
	}
}

cht::init();

?>
