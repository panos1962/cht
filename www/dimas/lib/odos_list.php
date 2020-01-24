<?php
require_once("../../../local/conf.php");
require_once(CHT_BASEDIR . "/lib/chtClient.php");
pandora::database();

$query = "SELECT `onomasia` FROM `dimas`.`odos` ORDER BY `onomasia`";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_NUM))
print trim($row[0]) . PHP_EOL;
?>
