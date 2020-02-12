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
// @DESCRIPTION BEGIN
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
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-02-07
// Updated: 2020-01-30
// Updated: 2020-01-29
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

Prosvasi::
cleanup()::
check();

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
		self::dimiourgia_ipografis();

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

	public static function cleanup() {
		self::diagrafi_ipografis();
		unset($_SESSION[CHT_SESSION_IDOS_XRISTI]);
		unset($_SESSION[CHT_SESSION_IPOGRAFI_XRISTI]);
		unset($_SESSION[PANDORA_SESSION_XRISTIS]);

		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@
	//
	// Για λόγους ασφάλειας τα αρχεία εικόνας των υπογραφών δεν μπορούν να
	// να βρίσκονται σε directories προσβάσιμα από το διαδίκτυο. Τα εν λόγω
	// αρχεία εικόνας βρίσκονται αποθηκευμένα στα directories:
	//
	//	cht/local/[[idos]]/ipografi
	//
	// όπου "[[idos]]" είναι το είδος του χρήστη που κάνει επώνυμη χρήση
	// της εφαρμογής, δηλαδή "dimas", "ipalilos" ή "xristis".
	//
	// Κατά την είσοδο του χρήστη στην εφαρμογή δημιουργούνται κάποια
	// session items ένα εκ των οοποίων αφορά την υπογραφή τού χρήστη.
	// Πιο συγκεκριμένα, αν υπάρχει αρχείο εικόνας το οποίο αφορά τον
	// χρήστη (είδος χρήστη και κωδικός/login) τότε δημιουργείται link
	// του εν λόγω αρχείου στο directory:
	//
	//	cht/www/tmp/ipografi
	//
	// με προσωρινή ονομασία η οποία κρατείται στο session item:
	//
	//	CHT_SESSION_IPOGRAFI_XRISTI
	//
	///////////////////////////////////////////////////////////////////////@

	// Η function "diagrafi_ipografis" διαγράφει τυχόν υπάρχον προσωρινό
	// link αρχείου εικόνας υπογραφής χρήστη.

	private static function diagrafi_ipografis() {
		$ipografi = pandora::session_get(CHT_SESSION_IPOGRAFI_XRISTI);

		if (!isset($ipografi))
		return __CLASS__;

		@unlink(CHT_BASEDIR . "/www/tmp/ipografi/" . $ipografi);
		return __CLASS__;
	}

	private static function dimiourgia_ipografis() {
		unset($_SESSION[CHT_SESSION_IPOGRAFI_XRISTI]);

		$idos = pandora::session_get(CHT_SESSION_IDOS_XRISTI);

		if (!isset($idos))
		return __CLASS__;

		$xristis = pandora::session_get(PANDORA_SESSION_XRISTIS);

		if (!isset($xristis))
		return __CLASS__;

		$tmpdir = CHT_BASEDIR . "/www/tmp/ipografi";
		$ipografi = tempnam($tmpdir, "ipografi");

		if ($ipografi === FALSE)
		return __CLASS__;

		$ipografi = basename($ipografi);
		$ifargopi = CHT_BASEDIR . "/local/" . $idos .
			"/ipografi/" . $xristis . ".png";

		if (symlink($ifargopi, $tmpdir . "/" . $ipografi . ".png"))
		$_SESSION[CHT_SESSION_IPOGRAFI_XRISTI] = $ipografi;

		@unlink($tmpdir . "/" . $ipografi);
		return __CLASS__;
	}
}

?>
