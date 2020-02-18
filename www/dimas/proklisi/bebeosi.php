<?php
require_once("../../../local/conf.php");
require_once("../../../lib/chtClient.php");
session_start();
pandora::database();

$xristis = pandora::xristis_get();

if (!isset($xristis))
exit('Ακαθόριστος χρήστης');

if (cht::xristis_no_dimas())
exit('Αναρμόδιος χρήστης');

$ipalilos = new Ipalilos($xristis);

if (!isset($ipalilos->kodikos))
exit('Άγνωστος χρήστης');

$klisi = $ipalilos->epomeni_klisi();

if (!isset($klisi))
exit('Μη διαθέσιμος αριθμός βεβαίωσης');

print $klisi;
exit(0);
?>
