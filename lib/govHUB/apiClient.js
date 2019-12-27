///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Updated: 2019-12-27
// Updated: 2019-12-25
// Updated: 2019-12-24
// Updated: 2019-12-21
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const gh = require('../../lib/govHUB/apiCore.js');
module.exports = gh;

///////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί function που επιστρέφει DOM element για το ανά χείρας φυσικό ή
// νομικό πρόσωπο, προκειμένου να το παρουσιάσουμε στο χώρο αποτελεσμάτων.

gh.prosopo.prototype.html = function() {
	return $('<div>').addClass('resultBox resultProsopo').
		append($('<table>').
		append($('<tr>').
		append($('<td>').addClass('column').text('ΑΦΜ')).
		append($('<td>').addClass('value').text(this.afm))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΕΠΩΝΥΜΟ')).
		append($('<td>').addClass('value').text(this.eponimo))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΟΝΟΜΑ')).
		append($('<td>').addClass('value').text(this.onoma))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΠΑΤΡΩΝΥΜΟ')).
		append($('<td>').addClass('value').text(this.patronimo))));
};

///////////////////////////////////////////////////////////////////////////////@

// Η function που ακολουθεί επιστρέφει DOM element που αφορά σε κάτοχο
// οχήματος. Συνήθως αυτά τα DOM elements συνοδεύουν το DOM element τού
// οχήματος, αλλά μπορούν να χρησιμοποιηθούν και αυτόνομα.

gh.katoxos.prototype.html = function() {
	let html = $('<div>').addClass('resultBox resultKatoxos');
	let data = $('<table>').appendTo(html);

	data.
	append($('<tr>').
	append($('<td>').addClass('column').text('ΑΦΜ')).
	append($('<td>').addClass('value').text(this.afm)));

	if (this.pososto != 100)
	data.
	append($('<tr>').
	append($('<td>').addClass('column').text('ΣΥΝΙΔΙΟΚΤΗΣΙΑ')).
	append($('<td>').addClass('value').text(this.pososto + '%')));

	data.
	append($('<tr>').
	append($('<td>').addClass('column').text('ΕΠΩΝΥΜΟ')).
	append($('<td>').addClass('value').text(this.eponimo))).
	append($('<tr>').
	append($('<td>').addClass('column').text('ΟΝΟΜΑ')).
	append($('<td>').addClass('value').text(this.onoma))).
	append($('<tr>').
	append($('<td>').addClass('column').text('ΠΑΤΡΩΝΥΜΟ')).
	append($('<td>').addClass('value').text(this.patronimo)));

	// Όσον αφορά στη διεύθυνση προτιμούμε να ενοποιήσουμε τα πεδία
	// της διεύθυνσης, του ταχυδρομικού κώδικα και της περιοχής σε ένα
	// μόνο στοιχείο το οποίο να περιέχει όλα τα στοιχεία διεύθυνσης.

	let diefHTML = this.diefHTML();

	if (diefHTML)
	data.
	append($('<tr>').
	append($('<td>').addClass('column').text('ΔΙΕΥΘΥΝΣΗ')).
	append($('<td>').addClass('value').html(diefHTML)));

	return html;
};

gh.katoxos.prototype.diefHTML = function() {
	let line1 = '';
	let line2 = '';

	if (this.dief)
	line1 = this.dief;

	if (this.perioxi)
	line2 = this.perioxi;

	if (this.tk) {
		let attr = '<span class="colinval">';

		if (line2)
		line2 += attr + ', ';

		else
		line2 = attr;

		line2 += 'ΤΚ&nbsp;</span>' + this.tk;
	}

	if (line1 && line2)
	return line1 + '<br>' + line2;

	if (line1)
	return line1;

	if (line2)
	return line2;

	return '';
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "html" επιστρέφει το όχημα ως DOM element προκειμένου να
// το εμφανίσουμε στην περιοχή αποτελεσμάτων της σελίδας. Επειδή τα οχήματα
// μπορούν να έχουν περισσότερους από έναν κατόχους, εμφανίζουμε αριστερά
// τα στοιχεία του οχήματος και δεξιά εμφανίζουμε τους κατόχους χρησιμοποιώντας
// έναν πίνακα με δύο στήλες.

gh.oxima.prototype.html = function() {
	let html = $('<table>');
	let line = $('<tr>').css('vertical-align', 'top').appendTo(html);
	let cell = $('<td>').appendTo(line);

	// Στην πρώτη στήλη εμφανίζουμε τα στοιχεία οχήματος.

	cell.append($('<div>').addClass('resultBox resultOxima').
		append($('<table>').
		append($('<tr>').
		append($('<td>').addClass('column').text('ΠΙΝΑΚΙΔΑ')).
		append($('<td>').addClass('value').text(this.pinakida))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΜΑΡΚΑ')).
		append($('<td>').addClass('value').text(this.marka))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΧΡΩΜΑ')).
		append($('<td>').addClass('value').text(this.xroma)))));

	line.
	append(cell = $('<td>'));

	// Στη δεύτερη στήλη εμφανίζουμε τους κατόχους του οχήματος.

	this.katoxosWalk((k) => {
		cell.append(k.html());
	});

	return html;
};

///////////////////////////////////////////////////////////////////////////////@
