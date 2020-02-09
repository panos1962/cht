///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// www/lib/dimasCore.js —— "Dimas" JavaScript core module
// @FILE END
//
// @DESCRIPTION BEGIN
// Δομές και functions που αφορούν στο υποσύστημα της Δημοτικής Αστυνομίας.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-01-26
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const Dimas = {};
module.exports = Dimas;

const pd = require("../mnt/pandora/lib/pandoraCore.js");

///////////////////////////////////////////////////////////////////////////////@

// Ορίζουμε την κλάση "Dimas.paravidos" που απεικονίζει είδη παραβάσεων που
// εμπίπτουν στην αρμοδιότητα της Δημοτικής Αστυνομίας. Οι παραβάσεις αυτές
// είναι κωδικοποιημένες και εμπεριέχονται στον πίνακα "paravidos" της
// database "dimas". Ως κωδικός χρησιμοποιείται ένα string που περιλαμβάνει
// το άρθρο, την παράγραφο και την περίπτωση της παράβασης όπως αναφέρονται
// στον σχετικό νόμο.

Dimas.paravidos = function(obj) {
	pd.objectInit(this, obj);
};

// Η μέθοδος "fromParavidosList" είναι χρήσιμη κατά τη δημιουργία "paravidos"
// αντικειμένων με βάση τα στοιχεία που επιστρέφονται από το PHP πρόγραμμα
// "www/dimas/lib/paravidos_list.php" το οποίο επιστρέφει όλα τα τρέχοντα
// είδη παραβάσεων που εμπίπτουν στην αρμοδιότητα της Δημοτικής Αστυνομίας.
// Το εν λόγω πρόγραμμα επιστρέφει τις παραβάσεις σε JSON format, ένα είδος
// σε κάθε γραμμή, επομένως περνάμε το περιεχόμενο της κάθε γραμμής στη
// μέθοδο "fromParavidosList" και με χρήση της eval μετατρέπουμε τη γραμμή
// αυτή στο επιθυμητό είδος παράβασης ως "Dimas.paravidos" object.

Dimas.paravidos.fromParavidosList = function(s) {
	return eval('new Dimas.paravidos(' + s + ');');
};

// Η διάταξη ενός είδους παράβασης προκύπτει από τον κωδικό ο οποίος ακολουθεί
// το format "ΑaaΠpp[xx]" όπου "aa" είναι ο αριθμός άρθρου, "pp" ο αριθμός
// παραγράφου και "xx" η περίπτωση της παράβασης, όπως αναφέρεται στον σχετικό
// νόμο.

Dimas.paravidos.prototype.diataxiGet = function() {
	// Την πρώτη φορά που θα υπολογίσουμε το πεδίο της διάταξης, κρατάμε
	// τη διάταξη στο πεδίο "diataxi" ώστε τις επόμενες φορές να είναι
	// πιο γρήγορη η διαδικασία, συνεπώς εάν υπάρχει ήδη συμπληρωμένο
	// πεδίο διάταξης, επιστρέφουμε την τιμή τού εν λόγω πεδίου.

	if (this.hasOwnProperty('diataxi'))
	return this.diataxi;

	let diataxi = '';
	let kodikos = this.kodikos.split('');

	if (!kodikos.length)
	return (this.diataxi = diataxi);

	// Αν το πεδίο του κωδικού δεν ακολουθεί το σωστό format, τότε
	// δεν μπορούμε να υπολογίσουμε το πεδίο της διάταξης και επομένως
	// επιστρέφουμε το κενό string.

	if (kodikos.shift() !== 'Α')
	return (this.diataxi = diataxi);

	let c;
	let s = '';

	while (((c = kodikos.shift()) !== undefined) && c.match(/[0-9]/))
	s += c;

	if (!s)
	return (this.diataxi = diataxi);

	diataxi = 'Ν.2696/99, άρ. ' + s;

	if (c !== 'Π')
	return (this.diataxi = diataxi);

	if (!kodikos.length)
	return (this.diataxi = diataxi);

	s = '';

	while (((c = kodikos.shift()) !== undefined) && c.match(/[0-9]/))
	s += c;

	if (!s)
	return (this.diataxi = diataxi);

	diataxi += ', παρ. ' + s;

	if (!c)
	return (this.diataxi = diataxi);

	if ((c === 'Ρ') && kodikos.length)
	s = '(P-';

	else
	s = 'περ. ' + c;

	while (c = kodikos.shift())
	s += c;

	diataxi += ', ' + s + ')';
	return (this.diataxi = diataxi);
};

Dimas.paravidos.prototype.plirisPerigrafiGet = function() {
	let s = this.kodikos + this.perigrafi;

	return s;
};

Dimas.paravidos.misthosiTipos = [
	'ΜΙΣΘΩΜΕΝΟ',
	'ΤΑΞΙ',
	'ΑΓΟΡΑΙΟ',
	'ΔΗΜΟΣΙΑΣ ΧΡΗΣΗΣ',
];

Dimas.paravidos.dikikloTipos = [
	'ΔΙΚΥΚΛΟ',
];

Dimas.paravidos.misthosiList = {};
Dimas.paravidos.dikikloList = {};

Dimas.paravidos.oximaTipos = [];
Dimas.paravidos.oximaTiposList = {};

pd.arrayWalk(Dimas.paravidos.misthosiTipos, (x, i) => {
	Dimas.paravidos.misthosiList[x] = i;
	Dimas.paravidos.oximaTipos.push(x);
	Dimas.paravidos.oximaTiposList[x] = i;
});

pd.arrayWalk(Dimas.paravidos.dikikloTipos, (x, i) => {
	Dimas.paravidos.dikikloList[x] = i;
	Dimas.paravidos.oximaTipos.push(x);
	Dimas.paravidos.oximaTiposList[x] = i;
});

Dimas.paravidos.prototype.kirosiGet = function(kirosi, tipos) {
	if (tipos === undefined)
	return this[kirosi];

	if (Dimas.paravidos.misthosiList.hasOwnProperty(tipos)) {
		switch (kirosi) {
		case 'prostimo':
			return this[kirosi] * 2;
		case 'diploma':
			return this[kirosi];
		}

		return undefined;
	}

	if (Dimas.paravidos.dikikloList.hasOwnProperty(tipos)) {
		switch (kirosi) {
		case 'prostimo':
			if (this.kodikos.match(/^Α34Π/))
			return parseInt(this[kirosi] / 2);
		}

		return this[kirosi];
	}

	return this[kirosi];
};

///////////////////////////////////////////////////////////////////////////////@

// Ορίζουμε την κλάση "Dimas.ipalilos" που απεικονίζει τους δηομτικούς
// αστυνομικούς.

Dimas.ipalilos = function(obj) {
	pd.objectInit(this, obj);
};

Dimas.ipalilos.fromAstinomikosList = function(s) {
	let a = s.split(//);

	return new Dimas.ipalilos({
		"kodikos": a[0],
		"onomateponimo": a[1],
	});
};
