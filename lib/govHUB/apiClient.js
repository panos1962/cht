///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
// @COPYRIGHT BEGIN
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILE BEGIN
// lib/govHUB/apiClient.js —— govHUB JavaScript API (client module)
// @FILE END
//
// @DESCRIPTION BEGIN
// Στο παρόν ορίζονται δομές και functions που αφορούν στο client-side του
// govHUB API module. Πιο συγκεκριμένα, στο παρόν module ορίζονται δομές και
// functions που αναφέρονται σε προγράμματα τα οποία λειτουργούν μέσω
// του browser.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-01-11
// Updated: 2019-12-27
// Updated: 2019-12-25
// Updated: 2019-12-24
// Updated: 2019-12-21
// @HISTORY END
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";
console.log('>>>', 'lib/govHUB/apiClient.js');

const pd = require('../../mnt/pandora/lib/pandoraClient.js');
const gh = require('./apiCore.js');
module.exports = gh;

///////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί function που επιστρέφει DOM element για το ανά χείρας φυσικό ή
// νομικό πρόσωπο, σε μορφή καρτέλας.

gh.prosopo.prototype.kartaDOM = function() {
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

	if (this.isNomikoProsopo())
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

gh.prosopo.prototype.diefHTML = function() {
	let line1 = '';
	let line2 = '';
	let line3 = '';

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
	line1 = line1 + '<br>' + line2;

	else if (line2)
	line1 = line2;

	line2 = ((this.kratos && (this.kratos !== 'ΕΛΛΑΔΑ')) ?
		this.kratos : '');

	if (line1 && line2)
	return line1 + '<br>' + line2;

	if (line1)
	return line1;

	if (line2)
	return line2;

	return '';
};

// Ακολουθεί function που επιστρέφει DOM element για το ανά χείρας φυσικό ή
// νομικό πρόσωπο, σε μορφή γραμμής πίνακα με τα εξής πεδία:
//
//	ΑΦΜ		[ afm ]
//	Επωνυμία	[ eponimia ]
//	Επώνυμο		[ eponimo ]
//	Όνομα		[ onoma ]
//	Πατρώνυμο	[ patronimo ]
//	Ημ. Γέννησης	[ genisi ]
//	Τηλέφωνο	[ tilefono ]
//	Διεύθυνση	[ dief ]
//	ΤΚ		[ tk ]
//	Περιοχή/Πόλη	[ perioxi ]
//	Κράτος		[ kratos ]

gh.prosopo.prototype.gramiDOM = function(opts) {
	let css = pd.css.grami;
	let dom = $('<tr>').addClass(css.grami);

	if (opts.hasOwnProperty('ante'))
	pd.arrayWalk(opts.ante, (v) => {
		dom.
		append($('<td>').addClass(css.val).text(v));
	});

	dom.
	append($('<td>').addClass(css.val).text(this.afm)).
	append($('<td>').addClass(css.val).text(this.eponimia)).
	append($('<td>').addClass(css.val).text(this.morfi)).
	append($('<td>').addClass(css.val).text(this.eponimo)).
	append($('<td>').addClass(css.val).text(this.onoma)).
	append($('<td>').addClass(css.val).text(this.patronimo)).
	append($('<td>').addClass(css.val).
	text(pd.date2date(this.genisi, 'YMD', '%D-%M-%Y'))).
	append($('<td>').addClass(css.val).text(this.tilefono)).
	append($('<td>').addClass(css.val).text(this.dief)).
	append($('<td>').addClass(css.val).text(this.tk)).
	append($('<td>').addClass(css.val).text(this.perioxi)).
	append($('<td>').addClass(css.val).text(this.kratos));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function που ακολουθεί επιστρέφει DOM element που αφορά σε κάτοχο
// οχήματος. Συνήθως αυτά τα DOM elements συνοδεύουν το DOM element τού
// οχήματος, αλλά μπορούν να χρησιμοποιηθούν και αυτόνομα.

gh.katoxos.prototype.kartaDOM = function() {
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

	if (this.isNomikoProsopo())
	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΕΠΩΝΥΜΙΑ')).
	append($('<td>').addClass(css.val).text(this.eponimia))).
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΜΟΡΦΗ')).
	append($('<td>').addClass(css.val).text(this.morfi)));

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
	append($('<td>').addClass(css.val).text(this.patronimo)));

	// Όσον αφορά στη διεύθυνση προτιμούμε να ενοποιήσουμε τα πεδία
	// της διεύθυνσης, του ταχυδρομικού κώδικα και της περιοχής σε ένα
	// μόνο στοιχείο το οποίο να περιέχει όλα τα στοιχεία διεύθυνσης.

	let diefHTML = gh.prosopo.prototype.diefHTML.call(this);

	if (diefHTML)
	data.
	append($('<tr>').addClass(css.row).
	append($('<td>').addClass(css.col).text('ΔΙΕΥΘΥΝΣΗ')).
	append($('<td>').addClass(css.val).html(diefHTML)));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "html" επιστρέφει το όχημα ως DOM element προκειμένου να
// το εμφανίσουμε στην περιοχή αποτελεσμάτων της σελίδας. Επειδή τα οχήματα
// μπορούν να έχουν περισσότερους από έναν κατόχους, εμφανίζουμε αριστερά
// τα στοιχεία του οχήματος και δεξιά εμφανίζουμε τους κατόχους χρησιμοποιώντας
// έναν πίνακα με δύο στήλες.

gh.oxima.prototype.kartaDOM = function() {
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

// Ακολουθεί function που επιστρέφει DOM element για το ανά χείρας όχημα
// σε μορφή γραμμής πίνακα με τα εξής πεδία:
//
//	Πινακίδα	[ oxima.pinakida ]
//	Μάρκα		[ oxima.marka ]
//	Χρώμα		[ oxima.xroma ]
//	Τύπος		[ oxima.tipos ]
//	ΑΦΜ		[ katoxos.afm ]
//	Ποσοστό		[ katoxos.pososto ]
//	Επωνυμία	[ katoxos.eponimia ]
//	Μορφή		[ katoxos.morfi ]
//	Επώνυμο		[ katoxos.eponimo ]
//	Όνομα		[ katoxos.onoma ]
//	Πατρώνυμο	[ katoxos.patronimo ]
//	Ημ. Γέννησης	[ katoxos.genisi ]
//	Διεύθυνση	[ katoxos.dief ]
//	ΤΚ		[ katoxos.tk ]
//	Περιοχή/Πόλη	[ katoxos.perioxi ]
//
// Ως παράμετρο περνάμε το index του κατόχου που επιθυμούμε να εμφανιστεί.
// Αν δεν περάσουμε index κατόχου, τότε εκτυπώνεται ο πρώτος κάτοχος από
// αυτούς που κατέχουν το υψηλότερο ποσοστό συνιδιοκτησίας.

gh.oxima.prototype.gramiDOM = function(opts) {
	// Στην παράμετρο "opts" μπορούμε να καθορίσουμε διάφορες παραμέτρους
	// της γραμμής οχήματος που θέλουμε να εκτυπώσουμε. Πιο συγκεκριμένα,
	// μπορούμε να καθορίσουμε τις εξής παραμέτρους:
	//
	// katoxos
	// ‾‾‾‾‾‾‾
	// Είναι ο αύξων αριθμός κατόχου που θέλουμε να εκτυπωθεί. Αν δεν
	// καθοιστεί υποτίθεται ο πρώτος τη τάξει από τους κατόχους με το
	// υψηλότερο ποσοστό συνιδιοκτησίας.
	//
	// ante
	// ‾‾‾‾
	// Array με επιπλέον στήλες που θα εκτυπωθούν πριν από τις στήλες
	// του οχήματος.
	//
	// post
	// ‾‾‾‾
	// Array με επιπλέον στήλες που θα εκτυπωθούν μετά από τις στήλες
	// του οχήματος.

	if (!opts)
	opts = {};

	let css = pd.css.grami;
	let dom = $('<tr>').addClass(css.grami);

	if (opts.hasOwnProperty('ante'))
	pd.arrayWalk(opts.ante, (v) => {
		dom.
		append($('<td>').addClass(css.val).text(v));
	});

	dom.
	append($('<td>').addClass(css.val).text(this.pinakida)).
	append($('<td>').addClass(css.val).text(this.marka)).
	append($('<td>').addClass(css.val).text(this.xroma)).
	append($('<td>').addClass(css.val).text(this.tipos)).
	append($('<td>').addClass(css.val).text(this.katoxos.length));

	let k = opts.katoxos;

	if ((parseInt(k) != k) || (k < 1) || (k > this.katoxos.length))
	k = this.kiriosKatoxosGet();

	if (k === undefined)
	k = new gh.katoxos();

	else
	k = this.katoxos[k - 1];

	dom.
	append($('<td>').addClass(css.val).text(k.pososto)).
	append($('<td>').addClass(css.val).text(k.afm)).
	append($('<td>').addClass(css.val).text(k.eponimia)).
	append($('<td>').addClass(css.val).text(k.morfi)).
	append($('<td>').addClass(css.val).text(k.eponimo)).
	append($('<td>').addClass(css.val).text(k.onoma)).
	append($('<td>').addClass(css.val).text(k.patronimo)).
	append($('<td>').addClass(css.val).text(k.dief)).
	append($('<td>').addClass(css.val).text(k.tk)).
	append($('<td>').addClass(css.val).text(k.perioxi));

	if (opts.hasOwnProperty('post'))
	pd.arrayWalk(opts.post, (v) => {
		dom.
		append($('<td>').addClass(css.val).text(v));
	});

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@
