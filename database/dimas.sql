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
-- database/dimas.sql —— Δημιουργία database "dimas"
-- @FILE END
--
-- @DESCRIPTION BEGIN
-- Το παρόν SQL script δημιουργεί την database "dimas" που περιλαμβάνει
-- δεδομένα που αφορούν τη Δημοτική Αστυνομία.
-- @DESCRIPTION END
--
-- @HISTORY BEGIN
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

-- Ο πίνακας "odos" περιέχει ονόματα οδών, πλατειών κλπ, τα οποία μπορούν να
-- χρησιμοποιηθούν στην τοποσήμανση των παραβάσεων ΚΟΚ.

CREATE TABLE `odos` (
	`onomasia`	VARCHAR(128) NOT NULL COMMENT 'ονομασία οδού',

	PRIMARY KEY (
		`onomasia`
	) USING BTREE
)

COMMENT = 'Πίνακας τοποσημάνσεων παραβάσεων ΚΟΚ'
;

-- Ο πίνακας "paravidos" περιέχει τα είδη των παραβάσεων που μπορεί να
-- βεβαιώσει η Δημοτική Αστυνομία.

CREATE TABLE `paravidos` (
	-- Ο κωδικός έχει τη μορφή "ΑaaΠpp[nn]" όπου "aa" είναι ο αριθμός
	-- άρθρου του σχετικού νόμου, "pp" είναι ο αριθμός παραγράφου, και
	-- "nn" είναι η περαιτέρω εξειδίκευση (περίπτωση), π.χ.
	--
	-- Α5Π8Θ	άρθρο 5, παράγραφος 8, περίπτωση "θ"
	-- Α15Π4	άρθρο 16, παράγραφος 4
	
	`kodikos`	VARCHAR(16) NOT NULL COMMENT 'κωδικός παράβασης',

	-- Το πεδίο "apo" είναι η ημερομηνία έναρξης ισχύος της σχετικής
	-- παράβασης. Αν είναι null τότε σημαίνει ότι η παράβαση ισχύει
	-- από πάντα.

	`apo`		DATE NULL DEFAULT NULL COMMENT 'έναρξη ισχύος',

	-- Το πεδίο "eos" είναι η ημερομηνία λήξης ισχύος της σχετικής
	-- παράβασης, αν π.χ. το πεδίο "eos" έχει τιμή "01/02/2019" σημαίνει
	-- ότι η παράβαση είναι σε ισχύ μέχρι 31/01/2019.

	`eos`		DATE NULL DEFAULT NULL COMMENT 'λήξη ισχύος',

	`perigrafi`	VARCHAR(128) NOT NULL COMMENT 'περιγραφή παράβασης',

	-- Το πρόστιμο είναι το ποσό που βεβαιώνεται (σε λεπτά του ευρώ). Αν
	-- είναι null τότε σημαίνει ότι η παράβαση δεν επισύρει χρηματικό
	-- πρόστιμο.

	`prostimo`	MEDIUMINT UNSIGNED NULL DEFAULT NULL COMMENT 'πρόστιμο',

	-- Ακολουθούν τα πεδία "pinakides", "adia" και "diploma" που δείχνουν
	-- για πόσες ημέρες θα αφαιρεθούν οι πινακίδες, η άδεια κυκλοφορίας
	-- και το δίπλωμα οδήγησης αντίστοιχα. Αν κάποιο από αυτά τα πεδία
	-- είναι null σημαίνει ότι η παράβαση δεν επισύρει την αντίστοιχη
	-- διοικητική κύρωση.

	`pinakides`	SMALLINT UNSIGNED NULL DEFAULT NULL COMMENT 'πινακίδες',
	`adia`		SMALLINT UNSIGNED NULL DEFAULT NULL COMMENT 'άδεια',
	`diploma`	SMALLINT UNSIGNED NULL DEFAULT NULL COMMENT 'δίπλωμα',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE
)

COMMENT = 'Πίνακας ειδών παραβάσεων'
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

\! echo "\nInserting data…" >[[MONITOR]]

\! echo 'Table `odos`…' >[[MONITOR]]

LOAD DATA LOCAL INFILE 'local/database/dimas/odos.tsv'
INTO TABLE `odos` (
	`onomasia`
);

\! echo 'Table `paravidos`…' >[[MONITOR]]

LOAD DATA LOCAL INFILE 'local/database/dimas/paravidos.tsv'
INTO TABLE `paravidos` (
	`kodikos`,
	`perigrafi`,
	`prostimo`,
	`pinakides`,
	`adia`,
	`diploma`
);
