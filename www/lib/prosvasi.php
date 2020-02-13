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
// PANDORA_SESSION_XRISTIS
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Το βασικό item που δείχνει ότι γίνεται επώνυμη χρήση των προγραμμάτων.
// Η τιμή που φέρει το item ερμηνεύεται ανάλογα με το είδος του χρήστη.
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
// CHT_SESSION_IPOGRAFI_XRISTI
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Δευτερεύον item που περιέχει το όνομα του (προσωρινού) αρχείου εικόνας με
// την υπογραφή του χρήστη. Πρόκειται για link στο αρχείο εικόνας τύπου PNG
// με τη φυσική υπογραφή του χρήστη, που βρίσκεται στο directory:
//
//	cht/local/dimas/ipografi
//
// Το εν λόγω όνομα προσωρινού αρχείου αφορά σε symbolic link προς το αρχείο
// εικόνας φυσικής υπογραφής του χρήστη· το εν λόγω link δημιουργείται σε
// προσβάσιμο directory, σε αντίθεση με το directory των φυσικών αρχείων
// εικόνας. Ο λόγος που δεν τοποθετούμε τα αρχεία εικόνας φυσικών υπογραφών
// εξαρχής σε προσβάσιμο directory είναι καθαρά η ασφάλεια των αρχείων αυτών.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-02-13
// Updated: 2020-02-12
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

Prosvasi::
init()::
cleanup()::
check();

class Prosvasi {
	private static $idos = NULL;
	private static $login = NULL;
	private static $kodikos = NULL;

	public static function init() {
		session_start();
		pandora::database();

		return __CLASS__;
	}

	public static function cleanup() {
		cht::delete_ipografi();
		unset($_SESSION[CHT_SESSION_IDOS_XRISTI]);
		unset($_SESSION[PANDORA_SESSION_XRISTIS]);

		return __CLASS__;
	}

	public static function check() {
		self::$idos = $_POST["idos"];
		self::$login = $_POST["login"];
		self::$kodikos = $_POST["kodikos"];

		$response = [];

		switch (self::$idos) {
		case "dimas":
			$row = Prosvasi::check_dimas();
			break;
		default:
			$response["error"] = "Παρουσιάστηκε σφάλμα";
			print json_encode($response);
			exit(0);
		}

		if (!$row) {
			$response["error"] = "Access denied!";
			print json_encode($response);
			exit(0);
		}

		$_SESSION[CHT_SESSION_IDOS_XRISTI] = self::$idos;
		$_SESSION[PANDORA_SESSION_XRISTIS] = self::$login;
		cht::expose_ipografi();

		$ipografi = pandora::session_get(CHT_SESSION_IPOGRAFI_XRISTI);

		if ($ipografi)
		$response["ipografi"] = $ipografi;

		print json_encode($response);
		exit(0);
	}

	private static function check_dimas() {
		$slogin = pandora::sql_string(self::$login);
		$skodikos = sha1(self::$kodikos);

		$query = "SELECT `onomateponimo` FROM `dimas`.`ipalilos` " .
			"WHERE (`kodikos` = " . $slogin . ") " .
			"AND (`password` = '" . $skodikos  ."') " .
			"AND (`anenergos` IS NULL) LIMIT 1";
		return pandora::first_row($query, MYSQLI_NUM);
	}
}

?>
