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
// Updated: 2020-03-06
// Updated: 2020-01-29
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
		"oxima",
		"klisi",
		"../../lib/cht",
	],
])::
document_body();

cht::set_govHUB_conf();
pandora::document_close();

?>
