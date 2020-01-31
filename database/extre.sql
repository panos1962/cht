-------------------------------------------------------------------------------@
--
-- @BEGIN
--
-- @COPYRIGHT BEGIN
-- Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
-- @COPYRIGHT END
--
-- @FILETYPE BEGIN
-- SQL
-- @FILETYPE END
--
-- @FILE BEGIN
-- database/extre.sql —— Δημιουργία database "extre"
-- @FILE END
--
-- @DESCRIPTION BEGIN
-- Το παρόν SQL script δημιουργεί την database "extre" που περιλαμβάνει
-- κυρίως τα extre που παραλαμβάνουμε από την τράπεζα (ΠΕΙΡΑΙΩΣ).
-- @DESCRIPTION END
--
-- @HISTORY BEGIN
-- Updated: 2020-01-30
-- Updated: 2020-01-29
-- Updated: 2020-01-28
-- Created: 2020-01-19
-- @HISTORY END
--
-- @END
-------------------------------------------------------------------------------@

\! echo "\nDatabase '[[DATABASE]]'" >[[MONITOR]]

-------------------------------------------------------------------------------@

\! echo "Creating database…" >[[MONITOR]]

-- Πρώτο βήμα είναι η διαγραφή της database εφόσον αυτή υπάρχει ήδη.

DROP DATABASE IF EXISTS `[[DATABASE]]`
;

-- Με το παρόν κατασκευάζουμε την database.

CREATE DATABASE `[[DATABASE]]`
DEFAULT CHARSET = utf8
DEFAULT COLLATE = utf8_general_ci
;

-- Καθιστούμε τρέχουσα την database που μόλις κατασκευάσαμε.

USE `[[DATABASE]]`
;

-- Καθορίζουμε την default storage engine για τους πίνακες που θα δημιουργηθούν.

SET default_storage_engine = INNODB
;

-------------------------------------------------------------------------------@

-- Ο πίνακας "esodo" περιέχει τις κατηγορίες των εσόδων όπως αυτές εμφανίζονται
-- στην ταυτότητα οφειλής.

CREATE TABLE `esodo` (
	-- Ο κωδικός κατηγορίας εσόδου ακολουθεί το format "ΕΕΥΥ", όπου "ΕΕ"
	-- είναι ένας διψήφιος κωδικός που υποδηλώνει το είδος εσόδου, π.χ.
	-- ΤΑΠ, ακαθάριστα έσοδα κλπ, και "ΥΥ" είναι η πηγή/υπηρεσία εσόδου.
	--
	--	2301	ΤΑΠ από βεβαίωση περί μη οφειλής
	--	2302	ΤΑΠ από διόρθωση τετραγωνικών μέτρων ακινήτου
	--	2701	Ακκαθάριστα έσοδα ΚΥΕ

	`kodikos`	CHARACTER(4) NOT NULL COMMENT 'κωδικός κατηγορίας εσόδου',
	`perigrafi`	VARCHAR(60)  NOT NULL COMMENT 'περιγραφή εσόδου',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE
)

COMMENT = 'Πίνακας κατηγοριών εσόδων'
;

-- Ο πίνακας "extre" περιέχει μια εγγραφή για κάθε extre αρχείο που ανεβάζουμε
-- στο σύστημα.

CREATE TABLE `extre` (
	`kodikos`	INTEGER AUTO_INCREMENT NOT NULL COMMENT 'κωδικός extre',
	`imerominia`	DATETIME NOT NULL COMMENT 'ημερομηνία υποβολής',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`imerominia`
	) USING BTREE
)

COMMENT = 'Πίνακας αρχείων extre'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! echo "Granting permissions…" >[[MONITOR]]

GRANT SELECT, INSERT, UPDATE, DELETE
ON `[[DATABASE]]`.* TO '[[USERNAME]]'@'localhost'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

USE `extre`;

\! echo "\nInserting data…" >[[MONITOR]]

\! echo 'Table `esodo`…' >[[MONITOR]]

INSERT INTO `esodo` (
	`kodikos`,
	`perigrafi`
) VALUES
('2301', 'ΤΑΠ από βεβαίωση περί μη οφειλής'),
('2302', 'ΤΑΠ από διόρθωση τετραγωνικών μέτρων ακινήτου'),
('2701', 'Ακκαθάριστα έσοδα ΚΥΕ')
;

COMMIT WORK
;

-------------------------------------------------------------------------------@
