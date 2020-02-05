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
// www/dimas/proklisi/copyright.php —— Πρόκειται το Copyright statement που
// αφορά στο πρόγραμμα δημιουργίας, επεξεργασίας και καταχώρησης προ-κλήσεων,
// δηλαδή προγραφών βεβαίωσης παραβάσεων ΚΟΚ.
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-02-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../../local/conf.php");
require_once(CHT_BASEDIR . "/lib/chtClient.php");

pandora::
document_head([
	"css" => FALSE,
	"jQuery" => FALSE,
]);

?>
<style>
body {
	width: 800px;
	padding: 32px;

	text-align: justify;
	line-height: 150%;

	font-family: "Georgia", serif;
}

#copyright {
	padding: 16px;

	border-style: solid;
	border-width: 1px;
	border-color: #cacaca;
	border-radius: 10px;
	box-shadow: 4px 4px 12px #d6d6d6;
}

h4 {
	margin: 8px 0px;
}
</style>
<?php

pandora::
document_body();

?>
<div id="copyright">
<h4>
Copyright statement
</h4>
<p>
Το πρόγραμμα δημιουργίας, επεξεργασίας και υποβολής
&ldquo;προ&ndash;κλήσεων&bdquo;
αναπτύχθηκε το 2019 από προγραμματιστές του Τμήματος Μηχανογραφικής
Υποστήριξης του Δήμου Θεσσαλονίκης. Ο πηγαίος κώδικας των προγραμμάτων
συντηρείται και βελτιώνεται από τους προγραμματιστές του ΤΜΥ του Δ.Θ. και
είναι ανοικτός και ελεύθερος για οποιαδήποτε μη εμπορική χρήση,
ωστόσο την ευθύνη της εγκατάστασης και της καλής λειτουργίας
της εφαρμογής σε sites ξένα προς το Δήμο Θεσσαλονίκης την έχουν οι
φορείς που ενδεχομένως να επιλέξουν να χρησιμοποιήσουν τα συγκεκριμένα
προγράμματα είτε αυτόνομα είτε ως προσαρτήματα τρίτων πληροφοριακών
συστημάτων.
</p>
</div>
<?php

pandora::
document_close([
	"jspass" => FALSE,
	"script" => FALSE,
]);

?>
