<?php
header('Content-Type: text/plain; charset=utf-8');

if (array_key_exists("imerominia", $_POST))
$imerominia = $_POST["imerominia"];

if (!$imerominia)
$imerominia = date('d-m-Y');

if (array_key_exists("count", $_POST))
$count = $_POST["count"];

$query = "ALTER SESSION SET NLS_DATE_FORMAT = 'dd-mm-yyyy'
;

SELECT
KLHTKLHSEIS.ID,
SUBSTR(KLHTVEHICLESHD.LICENCENUM, 1, 12),
KLHTKLHSEIS.KLHDTE

FROM
KLHTKLHSEIS
LEFT OUTER JOIN KLHTVEHICLESHD
ON KLHTKLHSEIS.KVH_ID = KLHTVEHICLESHD.ID

WHERE KLHTKLHSEIS.COM_ID = 61
AND KLHTKLHSEIS.CUH_ID IS NULL
AND KLHTKLHSEIS.AKIROFLAG = 0
AND KLHTKLHSEIS.KLHDTE = '" . $imerominia . "'
AND ROWNUM <= " . $count . "

ORDER BY
KLHTKLHSEIS.KLHDTE DESC,
KLHTKLHSEIS.ID DESC
;";

$tmp = tempnam("/tmp", "kok");
file_put_contents($tmp, $query);
system("../../bin/opsoisql --batch --colsep=',' " . $tmp);
unlink($tmp);
?>
