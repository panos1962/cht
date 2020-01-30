<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// www/cht/dimas/proklisi/index.php —— Αρχική σελίδα καταχώρησης και
// επεξεργασίας προ-κλήσεων.
// @FILE END
//
// @HISTORY BEGIN
// updated: 2020-01-29
// Created: 2020-01-22
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../../local/conf.php");
require_once(CHT_BASEDIR . "/lib/chtClient.php");
session_start();

pandora::
document_head([
	"css" => [
		"main",
		"klisi",
	],
])::
document_body()::
document_close();
?>
