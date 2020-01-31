<?php
///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Created: 2020-01-05
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
	"script" => "ektiposi",
])::
document_body()::
document_close();
?>
