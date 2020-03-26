SET LINESIZE 2000

-- Επιλογή όλων των ενεργών υπαλλήλων

SELECT
"ID",
'A',
"KODIKOS",
TRIM("EPONYMO"),
TRIM("ONOMA"),
TRIM("PATRONYMO"),
"FYLOFLAG",
"HMGENDATE",
"KATIGERGAZFLAG",
TRIM("MSH_CD"),
"MMK_ID",
"KATASTASHFLAG"

FROM "MISTERGAZ"

WHERE "COM_ID" = 61
AND "KATASTASHFLAG" <> 0

ORDER BY
"EPONYMO",
"ONOMA",
"PATRONYMO",
"KODIKOS"

;

-- Επιλογή όλων των επαναπροσλήψεων

SELECT
"MEZ_ID",
'B',
"BEGINDATE"

FROM "MISTMETABERGAZ"

WHERE "COM_ID" = 61
AND "MRM_ID" = 123
AND "MEZ_ID" IN (
	SELECT "ID"
	FROM "MISTERGAZ"
	WHERE "KATASTASHFLAG" <> 0
)
;

-- Επιλογή όλων των τίτλων σπουδών

SELECT
"MEZ_ID",
'C',
"MSB_ID"

FROM "MISTSPOUDES"

WHERE "COM_ID" = 61
AND "MEZ_ID" IN (
	SELECT "ID"
	FROM "MISTERGAZ"
	WHERE "KATASTASHFLAG" <> 0
)
;
