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
// www/lib/prosvasi.php —— Πρόγραμμα εισόδου του χρήστη προκειμένου να κάνει
// επώνυμη χρήση των εφαρμογών.
// @FILE END
//
// @FILE BEGIN
// Το παρόν πρόγραμμα δημιουργεί session items που αφορούν στην επώνυμη χρήση
// των εφαρμογών. Ουσιαστικά πρόκειται για τα παρακάτω session items:
//
// CHT_SESSION_IDOS_XRISTI
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Δευτερεύον item που δείχνει το είδος του χρήστη. Πιο συγκεκριμένα, οι
// τιμές που μπορεί να έχει το εν λόγω item είναι:
//
//	dimas		Ο χρήστης πιστοποιείται με τον κωδικό του ως δημοτικός
//			αστυνομικός, π.χ. "Α102", "Α53" κλπ.
//
//	ipalilos	Ο χρήστης πιστοποιείται με τον αριθμό μητρώου που έχει
//			ως υπάλληλος στο μητρώο υπαλλήλων προσωπικού, π.χ.
//			"3307", "2922" "4953" κλπ.
//
//	user		Ο χρήστης πιστοποιείται με τα συνθηματικά του ως
//			εξωυπηρεσιακός παράγων (αιρετός, ειδικός συνεργάτης
//			κλπ) π.χ. "zervas", "avar12", "mitrou2@acme.gr" κλπ.
//
// PANDORA_SESSION_XRISTIS
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Το βασικό item που δείχνει ότι γίνεται επώνυμη χρήση των προγραμμάτων.
// Η τιμή που φέρει το item ερμηνεύεται ανάλογα με το είδος του χρήστη.
//
// @HISTORY BEGIN
// updated: 2020-01-30
// updated: 2020-01-29
// Created: 2020-01-22
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@
if (!defined("CHT_BASEDIR"))
require_once("../../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtClient.php");
pandora::database();

session_start();
unset($_SESSION[CHT_SESSION_IDOS_XRISTI]);
unset($_SESSION[PANDORA_SESSION_XRISTIS]);

Prosvasi::check();

class Prosvasi {
	private static $idos = NULL;
	private static $login = NULL;
	private static $kodikos = NULL;

	public static function check() {
		self::$idos = $_POST["idos"];
		self::$login = $_POST["login"];
		self::$kodikos = $_POST["kodikos"];

		switch (self::$idos) {
		case "dimas":
			$row = Prosvasi::check_dimas();
			break;
		default:
			exit(2);
		}

		if (!$row) {
			print "Access denied!" . PHP_EOL;
			exit(0);
		}

		$_SESSION[CHT_SESSION_IDOS_XRISTI] = self::$idos;
		$_SESSION[PANDORA_SESSION_XRISTIS] = self::$login;

		exit(0);
	}

	private static function check_dimas() {
		$slogin = pandora::sql_string(self::$login);
		$skodikos = sha1(self::$kodikos);

		$query = "SELECT `onomateponimo` " .
			"FROM `dimas`.`ipalilos` " .
			"WHERE (`kodikos` = " . $slogin . ") " .
			"AND (`password` = '" . $skodikos  ."') " .
			"AND (`anenergos` IS NULL) " .
			"LIMIT 1";
		return pandora::first_row($query, MYSQLI_NUM);
	}
}

?>
