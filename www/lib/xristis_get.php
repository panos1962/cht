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
// www/lib/xristis_get.php —— Επιστρέφει τα στοιχεία του χρήστη όπως αυτά
// έχουν αποτυπωθεί στο τρέχον session.
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-02-07
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

session_start();

if (!defined("CHT_BASEDIR"))
require_once("../../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtClient.php");
pandora::database();

$xristis = [];

$xristis["idos"] = pandora::session_get(CHT_SESSION_IDOS_XRISTI);

if (!isset($xristis["idos"]))
return_xristis($xristis);

$xristis["kodikos"] = pandora::session_get(PANDORA_SESSION_XRISTIS);

if (!isset($xristis["kodikos"]))
return_xristis($xristis);

switch ($xristis["idos"]) {
case "dimas":
	$query = "SELECT `onomateponimo` FROM `dimas`.`ipalilos` " .
		"WHERE `kodikos` = " . pandora::sql_string($xristis["kodikos"]);
	break;
default:
	return_xristis($xristis);
}

$row = pandora::first_row($query, MYSQLI_NUM);

if (!$row)
return_xristis($xristis);

$xristis["onomateponimo"] = $row[0];
return_xristis($xristis);

function return_xristis($xristis) {
	print json_encode($xristis, JSON_UNESCAPED_UNICODE);
	exit(0);
}

?>
