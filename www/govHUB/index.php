<?php
///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Η ανά χείρας σελίδα παρέχει στον χρήστη τη δυνατότητα αναζήτησης στοιχείων
// μέσω της πλατφόρμας "govHUB" για:
//
//	Οχήματα και κατόχους οχημάτων με βάση τον αριθμό κυκλοφορίας οχήματος.
//
//	Φυσικά και νομικά πρόσωπα με βάση το ΑΦΜ.
//
// Η σελίδα είναι λειτουργική μόνον εφόσον υπάρχει ενεργός node server που να
// δέχεται κλήσεις σε συγκεκριμένο port (11123).
//
// Updated: 2019-12-26
//
///////////////////////////////////////////////////////////////////////////////@

$debug = @$_GET["debug"];
$pandora = "http://" . $_SERVER["HTTP_HOST"] . "/pandora";
?>
<html>

<head>
<link rel="icon" type="image/png" href="../images/favicon-96x96.png">
<link rel="stylesheet" type="text/css" href="<?php
	print $pandora;
?>/lib/pandora.css">
<link rel="stylesheet" type="text/css" href="selida.css">
<?php
if ($debug) {
?>
<link rel="stylesheet" type="text/css" href="selida.debug.css">
<?php
}
?>
<?php require("../lib/standard.php"); ?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script src="bundle.js"></script>
</head>
<body>

<div id="inputRegion">
<form>
<table>
<tr>
<td>
<div class="pedio">
<label class="prompt" for="pinakida">Αρ. Κυκλοφορίας</label>
<input id="pinakida" type="text" name="pinakida">
</div>
<br>
<div class="pedio">
<label class="prompt" for="imerominia">Ημερομηνία</label>
<input id="imerominia" type="text" name="imerominia">
</div>
<br>
<div class="pedio">
<label class="prompt" for="afm">ΑΦΜ</label>
<input id="afm" type="text" name="afm">
</div>
</td>
<td>
<div class="pedio">
<textarea id="mazika" name="mazika">
</textarea>
</div>
</td>
</table>
<div style="position:relative;">
<div id="panelLeft" class="panel">
<input id="ipovoli" type="submit" value="Υποβολή">
<input id="akiro" type="button" value="Άκυρο">
<input id="pause" type="button" value="Pause">
</div>
<div id="panelRight" class="panel">
<input id="clrForm" type="reset" value="Καθαρισμός φόρμας">
<input id="clrRslt" type="button" value="Καθαρισμός αποτελεσμάτων">
</div>
</div>
</form>
</div>

<div id="resultsRegion">
</div>

</body>
</html>
