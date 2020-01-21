<?php
require_once('../lib/cht.php');
pandora::
database();

$query = "SELECT `onomasia` FROM `dimas`.`odos` ORDER BY `onomasia`";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_NUM))
print trim($row[0]) . PHP_EOL;
?>
