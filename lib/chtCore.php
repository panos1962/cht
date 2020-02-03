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
// Updated: 2020-02-03
// Updated: 2020-01-30
// Updated: 2020-01-29
// Updated: 2020-01-16
// Created: 2020-01-12
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

if (!class_exists("pandoraCore"))
require_once(PANDORA_BASEDIR . "/lib/pandoraCore.php");

class chtCore {
	public static $init_ok = FALSE;

	public static function init_core() {
		if (self::$init_ok)
		return;

		self::$init_ok = TRUE;
	}
}

class Astinomikos {
	public $kodikos = NULL;
	public $onomateponimo = NULL;

	public function __construct($kodikos = NULL) {
		$this->kodikos = NULL;
		$this->onomateponimo = NULL;
		$this->anenergos = NULL;
		$this->klisiapo = NULL;
		$this->klisieos = NULL;
		$this->klisilast = NULL;

		if (isset($kodikos))
		$this->fromdb($kodikos);
	}

	public function fromdb($kodikos) {
		$query = "SELECT * FROM `dimas`.`astinomikos` " .
			"WHERE `kodikos` = " . pandora::sql_string($kodikos);
		$row = pandora::first_row($query, MYSQLI_ASSOC);

		if (!$row)
		return $this;

		$this->kodikos = (int)($row["kodikos"]);
		$this->onomateponimo = $row["onomateponimo"];
		$this->anenergos = $row["anenergos"];

		if (isset($row["klisiapo"]))
		$this->klisiapo = (int)($row["klisiapo"]);

		if (isset($row["klisieos"]))
		$this->klisieos = (int)($row["klisieos"]);

		if (isset($row["klisilast"]))
		$this->klisilast = (int)($row["klisilast"]);

		return $this;
	}

	public function epomeni_klisi() {
		$klisi = isset($this->klisilast) ?
			$this->klisilast + 1 : $this->klisiapo;

		if (!isset($klisi))
		return NULL;

		if (!isset($this->klisieos))
		return $klisi;

		if ($klisi > $this->klisieos)
		return NULL;

		return $klisi;
	}
}

chtCore::init_core();
?>
