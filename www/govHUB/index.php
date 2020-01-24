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
// www/govHUB/index.php —— Αρχική σελίδα πακέτου "pandora" (dummy)
// @FILE END
//
// @DESCRIPTION BEGIN
// Η ανά χείρας σελίδα παρέχει στον χρήστη τη δυνατότητα αναζήτησης στοιχείων
// μέσω της πλατφόρμας "govHUB" για:
//
//	⚫ Οχήματα και κατόχους με βάση τον αριθμό κυκλοφορίας οχήματος.
//	⚫ Φυσικά και νομικά πρόσωπα με βάση το ΑΦΜ.
//
// Η σελίδα είναι λειτουργική μόνον εφόσον υπάρχει ενεργός node server που να
// δέχεται κλήσεις σε συγκεκριμένο port (default 8001).
// 
// Options
// ‾‾‾‾‾‾‾
// Το network port στο οποίο «ακούει» ο server μπορεί να καθοριστεί στο URL
// μέσω της παραμέτρου "port".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-01-16
// Updated: 2020-01-11
// Updated: 2020-01-01
// Updated: 2019-12-26
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(CHT_BASEDIR . "/lib/chtClient.php");

pandora::
document_head()::
document_body();
?>
<div id="inputRegion">
<form class="pandoraForma">
<table>
<tr>
<td>
<?php
GovHUB::section_oxima();
GovHUB::section_imerominia();
GovHUB::section_opsoi();
GovHUB::section_prosopo();
?>
</td>
<td>
<div class="pedio">
<label class="prompt promptAuto" for="formatDesc">Format</label>
<select id="formatDesc"></select>
<input id="format" type="text">
</div>
<br>
<div class="pedio">
<textarea id="mazika"></textarea>
</div>
</td>
<tr>
<td colspan="2">
<div class="pedio">
<label id="trexonLabel" class="prompt" for="trexon"></label>
<div id="trexon"></div>
</div>
</td>
</table>
<div style="position:relative;">
<div id="panelLeft" class="panel">
<input id="ipovoli" type="submit" value="Υποβολή">
<input id="akirosi" type="button" value="Ακύρωση">
<input id="pafsi" type="button" value="">
<input id="ektiposi" type="button" value="Εκτύπωση">
</div>
<div id="panelRight" class="panel">
<input id="opsoiGet" type="button">
<input id="clrForm" type="reset" value="Καθαρισμός κριτηρίων">
<input id="clrRslt" type="button" value="Καθαρισμός αποτελεσμάτων">
</div>
</div>
</form>
</div>

<div id="resultsRegion">
</div>
<?php
pandora::document_close();

class GovHUB {
	public static function section_oxima() {
		if (!pandora::parameter_yes("oxima"))
		return;
?>
<div class="pedio">
<label class="prompt" for="pinakida">Αρ. Κυκλοφορίας</label>
<input id="pinakida" type="text">
</div>
<br>
<?php
	}

	public static function section_imerominia() {
?>
<div class="pedio">
<label class="prompt" for="imerominia">Ημερομηνία</label>
<input id="imerominia" type="text" placeholder="ΗΗ-ΜΜ-ΕΕΕΕ">
</div>
<br>
<?php
	}

	public static function section_opsoi() {
		if (!pandora::parameter_yes("opsoi"))
		return;
?>
<div class="pedio">
<label class="prompt" for="opsoi">Από ΟΠΣΟΥ</label>
<input id="opsoi" type="checkbox">
<label class="prompt promptAuto" for="opsoiCount">Πλήθος</label>
<input id="opsoiCount" type="text">
</div>
<br>
<?php
	}

	public static function section_prosopo() {
		if (!pandora::parameter_yes("prosopo"))
		return;
?>
<div class="pedio">
<label class="prompt" for="afm">ΑΦΜ</label>
<input id="afm" type="text">
</div>
<br>
<?php
	}
}
