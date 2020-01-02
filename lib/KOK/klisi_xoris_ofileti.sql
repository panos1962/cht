-------------------------------------------------------------------------------@
--
-- Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
--
-- Με το παρόν SQL script επιλέγουμε παραβάσεις ΚΟΚ από το ΟΠΣΟΥ, οι οποίες
-- δεν έχουν οφειλέτη (και δεν έχουν ακυρωθεί).
--
-- Updated: 2020-01-02
--
-------------------------------------------------------------------------------@

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
AND KLHTKLHSEIS.KLHDTE BETWEEN '__APO__' AND '__EOS__'
--AND ROWNUM < 10000

ORDER BY
KLHTKLHSEIS.KLHDTE DESC,
KLHTKLHSEIS.ID DESC
;
