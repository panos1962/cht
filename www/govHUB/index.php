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
?>
<html>

<head>
<link rel="icon" type="image/png" href="../images/favicon-96x96.png">
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
<script src="bundle.js"></script>
</head>
<body>

<div id="inputRegion">
<form>
<div class="pedio">
<label class="prompt" for="pinakida">Αρ. Κυκλοφορίας</label>
<input id="pinakida" type="text" name="pinakida">
</div>
<br>
<div class="pedio">
<label class="prompt" for="afm">ΑΦΜ</label>
<input id="afm" type="text" name="afm">
</div>
<br>
<div class="panel">
<input id="ipovoli" type="submit" value="Υποβολή">
<input id="katharismos" type="reset" value="Καθαρισμός">
<input id="akiro" type="button" value="Άκυρο">
</div>
</form>
</div>

<div id="resultsRegion">
</div>

</body>
</html>
