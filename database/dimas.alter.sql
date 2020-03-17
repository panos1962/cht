USE `dimas`
;

SET default_storage_engine = INNODB
;

\! echo "\nCreating tables…"

\! echo "Table paralogos…"

DROP TABLE IF EXISTS `paralogos`
;

CREATE TABLE `paralogos` (
	`paravidos`	VARCHAR(64) NOT NULL COMMENT 'Κωδικός παράβασης',
	`logos`		TINYINT NOT NULL COMMENT 'Αύξων αριθμός λόγου παράβασης',
	`perigrafi`	VARCHAR(1024) NOT NULL COMMENT 'Περιγραφή λόγου παράβασης',
	`anenergos`	DATE NULL DEFAULT NULL COMMENT 'Ημερομηνία απενεργοποίησης',

	PRIMARY KEY (
		`paravidos`,
		`logos`
	) USING BTREE
)

COMMENT = 'Πίνακας επιμέρους λόγων παράβασης' 
;

COMMIT WORK
;

\! echo "\nCreating relations…"

ALTER TABLE `paralogos` ADD FOREIGN KEY (
	`paravidos`
) REFERENCES `paravidos` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

\! echo "\nInserting data…"

\! echo 'Table `paralogos`…'

LOAD DATA LOCAL INFILE 'local/database/dimas/paralogos.tsv'
INTO TABLE `paralogos` (
	`paravidos`,
	`logos`,
	`perigrafi`,
	`anenergos`
);

COMMIT WORK
;
