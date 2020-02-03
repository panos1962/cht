<?php
require_once("../../../local/conf.php");
require_once("../../../lib/chtClient.php");
session_start();
pandora::database();

$xristis = pandora::xristis_get();

if (!isset($xristis))
exit(0);

if (cht::xristis_no_dimas())
exit(0);

$astinomikos = new Astinomikos($xristis);

if (!isset($astinomikos->kodikos))
exit(0);

$klisi = $astinomikos->epomeni_klisi();

if (!isset($klisi))
exit(0);

print $klisi;
exit(0);
?>
