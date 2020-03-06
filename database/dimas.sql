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

-- Ο πίνακας "ipalilos" περιέχει τους υπαλλήλους που είναι αρμόδιοι για τη
-- βεβαίωση παραβάσεων ΚΟΚ. Πρόκειται κυρίως για υπαλλήλους της Δημοτικής
-- Αστυνομίας, αλλά δεν αποκλείεται να προκύψουν και υπάλληλοι εκτός Δ.Α.
-- Οι δημοτικοί αστυνομικοί φέρουν κωδικούς της μορφής "Αn", όπου "n" είναι
-- κάποιος αριθμός, π.χ. "Α54", "Α175", "Α231" κλπ, ενώ τυχόν υπάλληλοι που
-- δεν ανήκουν στη Δημοτική Αστυνομία φέρουν άλλης μορφής κωδικούς για τους
-- οποίους δεν υπάρχουν σαφείς κανόνες (προς το παρόν), και πάντως όχι της
-- μορφής "Αn" που χαρακτηρίζει τους υπαλλήλους της Δημοτικής Αστυνομίας.

CREATE TABLE `ipalilos` (
	`kodikos`	VARCHAR(20) NOT NULL COMMENT 'Κωδικός υπαλλήλου',
	`onomateponimo`	VARCHAR(60) NOT NULL COMMENT 'Ονοματεπώνυμο',
	`filo`		ENUM (
		'ΑΝΔΡΑΣ',
		'ΓΥΝΑΙΚΑ'
	) NOT NULL COMMENT 'Φύλλο υπαλλήλου',
	`katigoria`	ENUM (
		'ΔΗΜΟΤΙΚΗ ΑΣΤΥΝΟΜΙΑ'
	) NULL DEFAULT NULL COMMENT 'Κατηγορία υπαλλήλου',
	`email`		VARCHAR(60) NULL DEFAULT NULL COMMENT 'Email address',
	`tilefono`	VARCHAR(30) NULL DEFAULT NULL COMMENT 'Τηλ. υπηρεσίας',
	`kinito`	VARCHAR(30) NULL DEFAULT NULL COMMENT 'Κινητό τηλέφωνο',

	-- Ακολουθούν πεδία που αφορούν στην αρίθμηση των κλήσεων από τον
	-- συγκεκριμένο υπάλληλο. Πράγματι, πριν βγεί ο υπάλληλος στο πεδίο,
	-- η διοικητική υποστήριξη της Δ.Α. καταχωρεί στον υπάλληλο τον αριθμό
	-- της πρώτης και της τελευταίας βεβαίωσης που δικαιούται να βεβαιώσει
	-- κατά τη βάρδιά του, π.χ. από 290701 έως 290800. Επίσης, τίθεται το
	-- πεδίο "klisilast" σε null που σημαίνει ότι ο υπάλληλος δεν έχει
	-- βεβαιώσει ακόμη κάποια από τις βεβαιώσεις του συγκεκριμένου χρονικού
	-- διαστήματος. Το εν λόγω πεδίο θα χρησιμοποιηθεί κατά την (αυτόματη)
	-- αρίθμηση των βεβαιώσεων καθώς κάθε φορά που ο αστυνομικός βεβαιώνει
	-- νέα παράβαση, το πεδίο αυτό αυξάνεται κατά ένα. Όσο η τιμή τού εν
	-- λόγω πεδίου παραμένει μικρότερη από την τιμή του πεδίου "klisieos",
	-- ο υπάλληλος μπορεί να βεβαιώνει παραβάσεις, ενώ αν η τιμή του πεδίου
	-- φτάσει την τιμή τού πεδίου "klisieos", τότε θα πρέπει να αιτηθεί νέο
	-- διάστημα αρίθμησης κλήσεων προκειμένου να συνεχίσει τις βεβαιώσεις.

	`klisiapo`	INTEGER UNSIGNED NULL DEFAULT NULL COMMENT 'Από κλήση',
	`klisieos`	INTEGER UNSIGNED NULL DEFAULT NULL COMMENT 'Έως κλήση',
	`klisilast`	INTEGER UNSIGNED NULL DEFAULT NULL COMMENT 'Τελευταία κλήση',

	`info`		VARCHAR(1024) NULL DEFAULT NULL COMMENT 'Πληροφορίες',
	`anenergos`	DATE NULL DEFAULT NULL COMMENT 'Ημερομηνία απενεργοποίησης',
	`password`	CHARACTER(40) NULL DEFAULT NULL COMMENT 'Password (SHA1)',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`onomateponimo`
	) USING BTREE
)

COMMENT = 'Πίνακας υπαλλήλων με δικαίωμα βεβαίωσης παραβάσεων ΚΟΚ'
;

-- Ο πίνακας "vardia" περιέχει περιόδους κατά τις οποίες ο υπάλληλος έχει
-- δικαίωμα βεβαίωσης παραβάσεων ΚΟΚ. Αν δεν υπάρχει καμία εγγραφή "vardia"
-- για κάποιον υπάλληλο, τότε θεωρείται ότι ο υπάλληλος έχει δικαίωμα
-- βεβαίωσης παραβάσεων ΚΟΚ οποιαδήποτε χρονική στιγμή, ενώ αντίθετα αν
-- υπάρχει έστω και μια εγγραφή "vardia" για τον συγκεκριμένο υπάλληλο,
-- ελέγχεται το δικαίωμα βεβαίωσης παραβάσεων ΚΟΚ του υπαλλήλου για τη
-- χρονική στιγμή κατά την οποία βεβαιώνει την παράβαση.

CREATE TABLE `vardia` (
	`ipalilos`	VARCHAR(16) NOT NULL COMMENT 'Κωδικός υπαλλήλου',

	-- Ακολουθεί το πεδίο "apo" που δείχνει τη χρονική στιγμή έναρξης
	-- της βάρδιας του υπαλλήλου. Αν η τιμή του πεδίου είναι null
	-- σημαίνει ότι δεν υπάρχει κάτω χρονικό όριο ελέγχου δικαιώματος
	-- βεβαίωσης παραβάσεων ΚΟΚ από τον συγκεκριμένο υπάλληλο.

	`apo`		DATETIME NULL DEFAULT NULL COMMENT 'Έναρξη βάρδιας',

	-- Ακολουθεί το πεδίο "eos" που δείχνει τη χρονική στιγμή λήξης
	-- της βάρδιας του υπαλλήλου. Αν η τιμή του πεδίου είναι null
	-- σημαίνει ότι δεν υπάρχει πάνω χρονικό όριο ελέγχου δικαιώματος
	-- βεβαίωσης παραβάσεων ΚΟΚ από τον συγκεκριμένο υπάλληλο.

	`eos`		DATETIME NULL DEFAULT NULL COMMENT 'Λήξη βάρδιας',

	INDEX (
		`ipalilos`,
		`apo`,
		`eos`
	) USING BTREE
)

COMMENT = 'Βάρδιες υπαλλήλων'
;

-- Ο πίνακας "odos" περιέχει ονόματα οδών, πλατειών κλπ, τα οποία μπορούν να
-- χρησιμοποιηθούν στην τοποσήμανση των παραβάσεων ΚΟΚ.

CREATE TABLE `odos` (
	`onomasia`	VARCHAR(128) NOT NULL COMMENT 'Ονομασία οδού',

	PRIMARY KEY (
		`onomasia`
	) USING BTREE
)

COMMENT = 'Πίνακας τοποσημάνσεων παραβάσεων ΚΟΚ'
;

-- Ο πίνακας "paravidos" περιέχει τα είδη των παραβάσεων ΚΟΚ που βεβαιώνουν
-- οι υπάλληλοι της Δημοτικής Αστυνομίας.

CREATE TABLE `paravidos` (
	-- Ο κωδικός έχει τη μορφή "ΕeΝnΑaΠp[n]" όπου "e" είναι το έτος, "n"
	-- είναι ο σχετικός νόμος, "a" είναι ο αριθμός άρθρου του σχετικού
	-- νόμου, "p" είναι ο αριθμός παραγράφου, και "n" είναι η περαιτέρω
	-- εξειδίκευση (περίπτωση), π.χ.
	--
	-- Ε1999Ν2696Α5Π8Θ	Ν.2696/1999, άρ. 5, παρ. 8, περ. "θ"
	-- Ε1999Ν2696Α15Π4	Ν.2696/1999, άρ. 16, παρ. 4
	
	`kodikos`	VARCHAR(64) NOT NULL COMMENT 'Κωδικός είδους παράβασης',

	-- Το πεδίο "apo" είναι η ημερομηνία έναρξης ισχύος του σχετικού
	-- νόμου. Αν είναι null τότε σημαίνει ότι η παράβαση ισχύει από
	-- πάντα.

	`apo`		DATE NULL DEFAULT NULL COMMENT 'Έναρξη ισχύος',

	-- Το πεδίο "eos" είναι η ημερομηνία λήξης ισχύος του σχετικού νόμου.

	`eos`		DATE NULL DEFAULT NULL COMMENT 'Λήξη ισχύος',

	`perigrafi`	VARCHAR(1024) NOT NULL COMMENT 'Περιγραφή παράβασης',

	-- Το πρόστιμο είναι το ποσό που βεβαιώνεται (σε λεπτά του ευρώ). Αν
	-- είναι null τότε σημαίνει ότι η παράβαση δεν επισύρει χρηματικό
	-- πρόστιμο.

	`prostimo`	MEDIUMINT UNSIGNED NULL DEFAULT NULL COMMENT 'Πρόστιμο',

	-- Ακολουθούν τα πεδία "pinakides", "adia" και "diploma" που δείχνουν
	-- για πόσες ημέρες θα αφαιρεθούν οι πινακίδες, η άδεια κυκλοφορίας
	-- και το δίπλωμα οδήγησης αντίστοιχα. Αν κάποιο από αυτά τα πεδία
	-- είναι null σημαίνει ότι η παράβαση δεν επισύρει την αντίστοιχη
	-- διοικητική κύρωση.

	`pinakides`	SMALLINT UNSIGNED NULL DEFAULT NULL COMMENT 'Πινακίδες',
	`adia`		SMALLINT UNSIGNED NULL DEFAULT NULL COMMENT 'Άδεια',
	`diploma`	SMALLINT UNSIGNED NULL DEFAULT NULL COMMENT 'Δίπλωμα',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE
)

COMMENT = 'Πίνακας ειδών παραβάσεων'
;

-- Ο πίνακας "proklisi" περιέχει τις βεβαιώσεις παραβάσεων ΚΟΚ σε πρώιμο
-- στάδιο, δηλαδή κατά τη στιγμή που τις βεβαιώνει και τις καταγράφει ο
-- αρμόδιος υπάλληλος.

CREATE TABLE `proklisi` (
	`kodikos`	INTEGER UNSIGNED NOT NULL COMMENT 'Κωδικός βεβαίωσης',
	`imerominia`	DATETIME NOT NULL COMMENT 'Ημερομηνία βεβαίωσης',
	`ipalilos`	VARCHAR(16) NOT NULL COMMENT 'Κωδικός υπαλλήλου',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`ipalilos`
	) USING HASH
)

COMMENT = 'Πίνακας προ-κλήσεων'
;

-- Ο πίνακας "proklidata" περιέχει τα στοιχεία της βεβαίωςη, π.χ. στοιχεία
-- παράβασης, στοιχεία οχήματος, στοιχεία υπόχρεου κλπ.

CREATE TABLE `proklidata` (
	`proklisi`	INTEGER UNSIGNED NOT NULL COMMENT 'Κωδικός βεβαίωσης',
	`katigoria`	ENUM (
		'ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ',
		'ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ',
		'ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ',
		'ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ',
		'ΔΙΑΦΟΡΑ ΑΛΛΑ ΣΤΟΙΧΕΙΑ'
	) NOT NULL COMMENT 'Κατηγορία στοιχείου βεβαίωσης',
	`idos`		ENUM (
		-- ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ
		'ΚΩΔΙΚΟΣ',
		'ΔΙΑΤΑΞΗ',
		'ΠΑΡΑΒΑΣΗ',
		'ΤΟΠΟΣ',
		'GEOX',
		'GEOY',

		-- ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ
		'ΑΡ. ΚΥΚΛΟΦΟΡΙΑΣ',
		'ΜΑΡΚΑ',
		'ΧΡΩΜΑ',
		'ΤΥΠΟΣ',
		'ΚΑΤΗΓΟΡΙΑ',

		-- ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ
		'ΑΦΜ',

		-- Φυσικό πρόσωπο
		'ΕΠΩΝΥΜΟ',
		'ΟΝΟΜΑ',
		'ΠΑΤΡΩΝΥΜΟ',

		-- Νομικό πρόσωπο
		'ΝΟΜΙΚΗ ΜΟΡΦΗ',
		'ΕΠΩΝΥΜΙΑ',

		-- Στοιχεία διεύθυνσης υπόχρεου
		'ΔΙΕΥΘΥΝΣΗ',
		'ΤΚ',
		'ΠΕΡΙΟΧΗ/ΠΟΛΗ',

		-- ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ
		'ΠΙΝΑΚΙΔΕΣ',
		'ΑΔΕΙΑ',
		'ΔΙΠΛΩΜΑ',
		'ΠΡΟΣΤΙΜΟ',

		-- ΔΙΑΦΟΡΑ ΑΛΛΑ ΣΤΟΙΧΕΙΑ
		'ΠΑΡΑΤΗΡΗΣΕΙΣ'
	) NOT NULL COMMENT 'Είδος στοιχείου βεβαίωσης',
	`timi`		VARCHAR(512) NOT NULL COMMENT 'Τιμή στοιχείου παράβασης',

	UNIQUE INDEX (
		`proklisi`,
		`katigoria`,
		`idos`
	) USING BTREE
)

COMMENT = 'Πίνακας επιμέρους στοιχείων προ-κλήσεων'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! echo "Creating relations…"

ALTER TABLE `proklidata` ADD FOREIGN KEY (
	`proklisi`
) REFERENCES `proklisi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
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

\! echo 'Table `ipalilos`…' >[[MONITOR]]

LOAD DATA LOCAL INFILE 'local/database/dimas/ipalilos.tsv'
INTO TABLE `ipalilos` (
	`kodikos`,
	`onomateponimo`,
	`filo`,
	`katigoria`,
	`password`,
	`klisiapo`,
	`klisieos`
);

COMMIT WORK
;

-------------------------------------------------------------------------------@
