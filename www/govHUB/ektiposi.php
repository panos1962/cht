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
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// www/govHUB/ektiposi/ektiposi.js —— Πρόγραμμα οδήγησης σελίδας εκτύπωσης
// αποτελεσμάτων αναζήτησης στοιχείων οχημάτων, κατόχων οχημάτων, φυσικών
// και νομικών προσώπων μέσω της πλατφόρμας "govHUB".
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2020-01-31
// Created: 2020-01-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once("../lib/cht.php");
require_once("../../mnt/pandora/lib/pandoraClient.php");

pandora::
document_head([
	"title" => "Εκτύπωση",
	"css" => "ektiposi",
	"favicon" => "../images/favicon-96x96.png",
])::
document_body()::
document_close([
	"script" => "ektiposi",
]);
?>
