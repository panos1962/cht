<?php
$debug = @$_GET["debug"];
$server = $_SERVER["HTTP_HOST"];
?>
<html>

<head>

<link rel="stylesheet" type="text/css" href="selida.css">
<?php if ($debug) { ?>
<link rel="stylesheet" type="text/css" href="selida.debug.css">
<?php } ?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>
Globals = {};
Globals.server = 'http://<?php print $server; ?>';
</script>
<script src="selida.js"></script>

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
Results
</div>

</body>
</html>
