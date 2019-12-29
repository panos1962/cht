///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// govHUB/apiClient.js -- govHUB JavaScript API (client module). Στο παρόν
// ορίζονται δομές και functions που αφορούν στο client side του govHUB
// API module. Πιο συγκεκριμένα, στο παρόν module ορίζονται δομές και
// functions που αναφέρονται σε προγράμματα τα οποία λειτουργούν μέσω
// του browser.
//
// Updated: 2019-12-27
// Updated: 2019-12-25
// Updated: 2019-12-24
// Updated: 2019-12-21
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraClient.js`);
module.exports = gh;

const gh = require('../../lib/govHUB/apiCore.js');
module.exports = gh;

///////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί function που επιστρέφει DOM element για το ανά χείρας φυσικό ή
// νομικό πρόσωπο, σε μορφή καρτέλας.

gh.prosopo.prototype.kartaDOM_SV = function() {
	let css = pd.css.karta;
	let dom = $('<div>').addClass(css.box);
	let data = $('<table>').appendTo(dom);

	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΑΦΜ')).
	append($('<td>').addClass(css.val).text(this.afm))).
	append($('<tr>').addClass(css.row).addClass(css.sec).
	append($('<td>').addClass(css.col).text('ΔΟΥ')).
	append($('<td>').addClass(css.val).text(this.doiGet())));

	if (this.isEponimia())
	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΕΠΩΝΥΜΙΑ')).
	append($('<td>').addClass(css.val).text(this.eponimia)));

	else
	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΕΠΩΝΥΜΟ')).
	append($('<td>').addClass(css.val).text(this.eponimo))).
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΟΝΟΜΑ')).
	append($('<td>').addClass(css.val).text(this.onoma))).
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΠΑΤΡΩΝΥΜΟ')).
	append($('<td>').addClass(css.val).text(this.patronimo))).
	append($('<tr>').addClass(css.row).addClass(css.sec).
	append($('<td>').addClass(css.col).text('ΜΗΤΡΩΝΥΜΟ')).
	append($('<td>').addClass(css.val).text(this.mitronimo))).
	append($('<tr>').addClass(css.row).addClass(css.sec).
	append($('<td>').addClass(css.col).text('ΓΕΝΝΗΣΗ')).
	append($('<td>').addClass(css.val).
	text(pd.date2date(this.genisi, 'YMD', '%D-%M-%Y'))));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function που ακολουθεί επιστρέφει DOM element που αφορά σε κάτοχο
// οχήματος. Συνήθως αυτά τα DOM elements συνοδεύουν το DOM element τού
// οχήματος, αλλά μπορούν να χρησιμοποιηθούν και αυτόνομα.

gh.katoxos.prototype.kartaDOM_SV = function() {
	let css = pd.css.karta;
	let dom = $('<div>').addClass(css.box);
	let data = $('<table>').appendTo(dom);

	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΑΦΜ')).
	append($('<td>').addClass(css.val).text(this.afm)));

	if (this.pososto != 100)
	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΣΥΝΙΔΙΟΚΤΗΣΙΑ')).
	append($('<td>').addClass(css.val + ' sinidioktisia').
		text(this.pososto + '%')));

	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΕΠΩΝΥΜΟ')).
	append($('<td>').addClass(css.val).text(this.eponimo))).
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΟΝΟΜΑ')).
	append($('<td>').addClass(css.val).text(this.onoma))).
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΠΑΤΡΩΝΥΜΟ')).
	append($('<td>').addClass(css.val).text(this.patronimo)));

	// Όσον αφορά στη διεύθυνση προτιμούμε να ενοποιήσουμε τα πεδία
	// της διεύθυνσης, του ταχυδρομικού κώδικα και της περιοχής σε ένα
	// μόνο στοιχείο το οποίο να περιέχει όλα τα στοιχεία διεύθυνσης.

	let diefHTML = this.diefHTML();

	if (diefHTML)
	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΔΙΕΥΘΥΝΣΗ')).
	append($('<td>').addClass(css.val).html(diefHTML)));

	return dom;
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

gh.oxima.prototype.kartaDOM_SV = function() {
	let css = pd.css.karta;
	let dom = $('<div>');
	let sub = $('<div>').addClass(css.box).appendTo(dom);
	let data = $('<table>').appendTo(sub);

	let kclass = css.val;

	if (this.katastasi !== 'ΚΙΝΗΣΗ')
	kclass += ' oxiKinisi';

	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΠΙΝΑΚΙΔΑ')).
	append($('<td>').addClass(css.val).text(this.pinakida))).
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΜΑΡΚΑ')).
	append($('<td>').addClass(css.val).text(this.marka))).
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΧΡΩΜΑ')).
	append($('<td>').addClass(css.val).text(this.xroma))).
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΚΑΤΑΣΤΑΣΗ')).
	append($('<td>').addClass(kclass).text(this.katastasi)));

	this.katoxosWalk((k) => {
		dom.append(k.kartaDOM());
	});

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@
