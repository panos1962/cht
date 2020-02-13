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
// www/lib/exodos.php —— Πρόγραμμα εξόδου του χρήστη από τις εφαρμογές.
// @FILE END
//
// @FILE BEGIN
// Το παρόν πρόγραμμα διαγράφει τα session items που αφορούν στην επώνυμη
// χρήση των εφαρμογών. Ουσιαστικά πρόκειται για τα παρακάτω session items:
//
// CHT_SESSION_IDOS_XRISTI
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Δευτερεύον item που δείχνει το είδος του χρήστη. Πιο συγκεκριμένα, οι
// τιμές που μπορεί να έχει το εν λόγω item είναι:
//
//	dimas		Ο χρήστης έχει πιστοποιηθεί με τον κωδικό του ως
//			δημοτικός αστυνομικός, π.χ. "Α102", "Α53" κλπ.
//
//	ipalilos	Ο χρήστης έχει πιστοποιηθεί με τον αριθμό μητρώου που
//			έχει ως υπάλληλος στο μητρώο υπαλλήλων προσωπικού, π.χ.
//			"3307", "2922" "4953" κλπ.
//
//	user		Ο χρήστης έχει πιστοποιηθεί με τα συνθηματικά του ως
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

session_start();
cht::delete_ipografi();
unset($_SESSION[CHT_SESSION_IDOS_XRISTI]);
unset($_SESSION[PANDORA_SESSION_XRISTIS]);

exit(0);
?>
