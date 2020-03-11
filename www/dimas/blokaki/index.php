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
// www/cht/dimas/blokaki/index.php —— Προκαθορισμός αριθμών βεβαίωσης
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-03-11
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
		"../../lib/cht",
	],
])::
document_body()::
document_close();

?>
