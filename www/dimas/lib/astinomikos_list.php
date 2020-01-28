<?php
if (!defined("CHT_BASEDIR"))
require_once("../../../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtClient.php");
pandora::database();

$query = "SELECT `kodikos`, `onomateponimo` " .
	"FROM `dimas`.`astinomikos` " .
	"ORDER BY `onomateponimo`, `kodikos`";
$result = pandora::query($query);

$sep = "";

while ($row = $result->fetch_array(MYSQLI_NUM))
print trim($row[0]) . $sep . trim($row[1]) . PHP_EOL;
?>
