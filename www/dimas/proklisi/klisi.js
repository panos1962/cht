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
// www/dimas/proklisi/klisi.js —— Δημιουργία, επεξεργασία, προεπισκόπηση και
// υποβολή προ-κλήσεων παραβάσεων ΚΟΚ.
// @FILE END
//
// @DESCRIPTION BEGIN
// Στο παρόν module υπάρχουν δομές και functions που εξυπηρετούν τη δημιουργία
// φύλλου βεβαίωσης παράβασης ΚΟΚ, δηλαδή του αποκόμματος που εναποθέτει σε
// εμφανές σημείο του οχήματος ο δημοτικός αστυνομικός. Αυτά τα αποκόμματα
// συνήθως έχουν βαθύ ροζ χρώμα κατά την κλασική (χειροκίνητη) διαδικασία ο
// δημοτικός αστυνομικός συνέτασσε χειρόγραφα τη βεβαίωση στο καρνέ του και
// κατόπιν αποσπούσε το ένα από τα δύο αντίγραφα.
//
// Με τη χρήση των PDAs αυτό έχει αλλάξει και ο δημοτικός αστυνομικός συντάσσει
// ψηφιακά τη βεβαίωση της παράβασης και κατόπιν την ελέγχει και την υποβάλλει
// στην κεντρική database της Δημοτικής Αστυνομίας. Από εκεί η βεβαίωση μπορεί
// εύκολα να καταχωρηθεί στο ΟΠΣΟΥ, ενώ διευκολύνονται και άλλες διαδικασίες
// όπως παρακολούθηση ενστάσεων, παράδοση και επιστροφή πινακίδων, άδειας
// κυκλοφορίας και διπλώματος οδήγησης κλπ.
//
// Το παρόν δεν έχει δημιουργηθεί ως αυτόνομο JavaScript module αλλά αποτελεί
// παρακολούθημα της βασικής σελίδας δημιουργίας, επεξεργασίας και υποβολής
// προ-κλήσεων "www/dimas/proklisi/main.js" και ο κύριος λόγος διαχωρισμού
// είναι η ευκολότερη διαχείριση των προγραμμάτων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-02-10
// Updated: 2020-02-06
// Updated: 2020-02-03
// Updated: 2020-01-30
// Updated: 2020-01-29
// Updated: 2020-01-27
// Updated: 2020-01-25
// Created: 2020-01-24
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd = require('../../../mnt/pandora/lib/pandoraClient.js');
const gh = require('../../../lib/govHUB/apiCore.js');

module.exports = function(Proklisi) {
///////////////////////////////////////////////////////////////////////////////@

// Η κλάση "Proklisi.klisi" αφορά σε προ-κλήσεις παραβάσεων ΚΟΚ, τουτέστιν
// βεβαιώσεις παραβάσεων ΚΟΚ σε πρώιμο στάδιο. Βεβαίωση παράβασης ΚΟΚ σε
// πρώιμο στάδιο είναι η αρχική διαπίστωση της παράβασης επί του πεδίου και
// η καταγραφή από τον δημοτικό αστυνομικό, ή άλλον αρμόδιο υπάλληλο, των
// στοιχείων της παράβασης σε καρνέ κλήσεων, σε PDA ή άλλο μέσο καταγραφής.
// Οι προ-κλήσεις αφού καταγραφούν και ελεγχθούν, υπογράφονται από τον
// συντάκτη και υποβάλλονται προς καταχώρηση αρχικά σε πρόχειρη database
// και όπου αφού ελεγχθούν ως προς την τεχνική τους ορθότητα και αρτιότητα,
// μεταφέρονται στην database του ΟΠΣΟΥ. Από την καταχώρηση των προ-κλήσεων
// στο ΟΠΣΟΥ και μετά, οι προ-κλήσεις μπορούν να κρατούνται χωρίς να έχουν
// κάποια επίσημη υπόσταση, ωστόσο μπορούν να αποτελέσουν χρήσιμο ιστορικό
// αρχείο για την παραγωγή στατιστικών και άλλων συγκεντρωτικών στοιχείων.

Proklisi.klisi = function() {
	let data = Proklisi.bebeosiTabDOM.data('bebeosiData');

	if (data) {
		if (data.hasOwnProperty('bebnum'))
		this.kodikos = data.bebnum;

		let date = pd.dateTime(undefined, '%D/%M/%Y, %h:%m');

		if (data.hasOwnProperty('date'))
		this.imerominia = data.date;
	}

	data = Proklisi.oximaTabDOM.data('oximaData');

	if (data)
	this.oxima = (new gh.oxima(data)).fixChildren();

	// Σε κάθε menu tab (κουτάκι επιλογής από μενού) υπάρχει data
	// item με όνομα σχετικό με το όνομα του menu tab, π.χ. στο
	// menu tab "oximaMenuTab" υπάρχει data item "oximaData" με
	// τον αρ. κυκλοφορίας οχήματος. Εκμεταλλευόμαστε, λοιπόν,
	// αυτήν την ευταξία στο πρόγραμμα προκειμένου να δώσουμε
	// αρχικές τιμές στα υπόλοιπα πεδία της υπό επεξεργασία
	// πρό-κλησης.

	pd.arrayWalk([
		'topos',
		'paravidos',
		'oximaTipos',
		'pinakides',
		'adia',
		'diploma',
		'prostimo',
	], (x) => {
		let data = Proklisi[x + 'TabDOM'].data(x +'Data');

		if (data)
		this[x] = data;
	});
};

Proklisi.klisi.prototype.kodikosGet = function() {
	return this.kodikos;
};

Proklisi.klisi.prototype.imerominiaGet = function() {
	return this.imerominia;
};

Proklisi.klisi.prototype.prostimoGet = function() {
	let paravidos = this.paravidos;

	if (!paravidos)
	return 0;

	if (!paravidos.hasOwnProperty('prostimo'))
	return 0;

	if (parseInt(paravidos.prostimo) != paravidos.prostimo)
	return 0;

	return paravidos.prostimo;
};

Proklisi.klisi.prototype.isProstimo = function() {
	return this.prostimoGet();
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.klisi.prototype.klisiDOM = function() {
	let klisiSelidaDOM = $('<div>').
	addClass('proklisiKlisiSelida');

	let klisiDOM = $('<div>').
	data('errors', []).
	addClass('proklisiKlisi').
	appendTo(klisiSelidaDOM);

	this.
	klisiHeaderDOM(klisiDOM).
	klisiOximaDOM(klisiDOM).
	klisiKatoxosDOM(klisiDOM).
	klisiParavasiDOM(klisiDOM).
	klisiKirosiDOM(klisiDOM).
	klisiFooterDOM(klisiDOM);

	let errors = klisiDOM.data('errors');

	if (!errors.length) {
		Proklisi.episkopisiDOM.
		removeData('errmsg');
		return klisiSelidaDOM;
	}

	let errmsg = (errors.length < 2 ? 'Λείπει' : 'Λείπουν');
	pd.arrayWalk(errors, (x, i) => errmsg += (i ? ',' : ':') +
		' <span class="proklisiKlisiMissing">' + x + '</span>');

	Proklisi.episkopisiDOM.
	data('errmsg', errmsg);

	return klisiSelidaDOM;
};

Proklisi.klisi.prototype.klisiHeaderDOM = function(klisiDOM) {
	let errors = klisiDOM.data('errors');

	let headerRightDOM = $('<td>').
	addClass('proklisiKlisiHeaderRight');

	let headerDOM = $('<table>').
	addClass('proklisiKlisiEnotitaData').
	addClass('proklisiKlisiEnotitaHeader').

	append($('<tr>').
	addClass('proklisiKlisiHeaderLine').

	append($('<td>').
	addClass('proklisiKlisiHeaderLeft').

	append($('<div>').
	addClass('proklisiKlisiKratos').
	append($('<img>').
	addClass('proklisiKlisiEthnosimo').
	attr('src', '../../images/ethnosimoBlack.png')).
	append($('<div>').
	addClass('proklisiKlisiKratosText').
	text('ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ'))).
	append($('<br>')).

	append($('<div>').
	addClass('proklisiKlisiDimos').
	text(Proklisi.param.dimas.ota)).

	append($('<div>').
	addClass('proklisiKlisiIpiresia').
	text(Proklisi.param.dimas.ipiresia)).

	append($('<div>').
	addClass('proklisiKlisiContact').
	text(Proklisi.param.dimas.contact))).

	append(headerRightDOM.
	append($('<div>').
	addClass('proklisiKlisiPraxi').
	html('ΠΡΑΞΗ ΒΕΒΑΙΩΣΗΣ ΠΑΡΑΒΑΣΗΣ<br>' + (this.isProstimo() ?
		'ΜΕ' : 'ΧΩΡΙΣ') + ' ΕΠΙΒΟΛΗ ΠΡΟΣΤΙΜΟΥ'))));

	let data = this.kodikosGet();

	if (data)
	headerRightDOM.
	append($('<div>').
	addClass('proklisiKlisiKodikos').
	text(data));

	else
	errors.push('Αρ. Βεβαίωσης');

	data = this.imerominiaGet();

	if (data)
	headerRightDOM.
	append($('<div>').
	addClass('proklisiKlisiImerominia').
	append($('<table>').

	append($('<tr>').
	append($('<td>').
	addClass('proklisiKlisiImerominiaPrompt').
	html('Ημ. βεβαίωσης')).
	append($('<td>').
	addClass('proklisiKlisiImerominiaTimi').
	html(pd.dateTime(this.imerominiaGet(), '%D-%M-%Y')))).

	append($('<tr>').
	append($('<td>').
	addClass('proklisiKlisiImerominiaPrompt').
	html('Ώρα βεβαίωσης')).
	append($('<td>').
	addClass('proklisiKlisiImerominiaTimi').
	html(this.oraPrometa())))));

	else
	errors.push('Ημερομηνία');

	headerDOM.
	appendTo(klisiDOM);

	return this;
}

Proklisi.klisi.prototype.oraPrometa = function() {
	let date = this.imerominiaGet();

	if (date === undefined)
	return '';

	let ora = pd.dateTime(date, '%h:%m');

	if (pd.dateTime(date, '%h') > 12)
	return ora;

	return $('<div>').
	addClass('proklisiKlisiOraPrometa').
	text(ora);
};

Proklisi.klisi.prototype.klisiParavasiDOM = function(klisiDOM) {
	let errors = klisiDOM.data('errors');
	let cols = [];

	if (this.topos)
	cols.push({
		'k': 'Τόπος',
		'v': this.topos,
	});

	else
	errors.push('Τόπος');

	if (this.paravidos)
	cols.push({
		'k': 'Παράβαση',
		'v': this.paravidos.diataxiGet() +
			'<span class="proklisiKlisiParavasi">' +
			this.paravidos.perigrafi + '</span>',
	});

	else
	errors.push('Παράβαση');

	if (!cols.length)
	return this;

	klisiDOM.
	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ'));

	let enotitaDOM =
	Proklisi.klisi.enotitaDOM().
	appendTo(klisiDOM);

	pd.arrayWalk(cols, (x) => enotitaDOM.
	append(Proklisi.klisi.klisiPedioDOM(x.k, x.v)));

	return this;
}

// Ακολουθεί λίστα κυρώσεων/προστίμων που εκτυπώνονται στη σχετική ενότητα.
// Τα πεδία της λίστας ερμηνεύονται ως εξής:
//
//	k:	Είδος κύρωσης/προστίμου
//	v:	Τιμή κύρωσης προστίμου (μέρες/cents)
//	f:	Custom function διαμόρφωσης
//	p:	Post string ("ημέρες"/"€", default "ημέρες")
//	c:	Αν είναι false θεωρείται δευτερεύον (default true)

Proklisi.klisi.kirosiList = [
	{
		'k': 'Ειδ. κατ. οχήματος',
		'v': 'oximaTipos',
		'p': '',
		'c': false,
	},
	{
		'k': 'Αφαίρεση πινακίδων',
		'v': 'pinakides',
	},
	{
		'k': 'Αφαίρεση αδείας',
		'v': 'adia',
	},
	{
		'k': 'Αφαίρεση διπλώματος',
		'v': 'diploma',
	},
	{
		'k': 'Πρόστιμο',
		'v': 'prostimo',
		'f': (x) => pd.centsToEuros(x, {
			'cents': ',',
			'triad': '.',
		}),
		'p': '&euro;',
	},
];

Proklisi.klisi.prototype.klisiKirosiDOM = function(klisiDOM) {
	let errors = klisiDOM.data('errors');
	let count = 0;
	let klist = Proklisi.klisi.kirosiList.filter((x) => {
		if (!this[x.v])
		return false;

		if ((!x.hasOwnProperty('c')) || x.c)
		count++;

		return true;
	});

	if (!count) {
		errors.push('Κυρώσεις');
		return this;
	}

	klisiDOM.
	append(Proklisi.klisi.enotitaTitlosDOM('ΚΥΡΩΣΕΙΣ & ΠΡΟΣΤΙΜΑ'));

	let enotitaDOM =
	Proklisi.klisi.enotitaDOM().
	appendTo(klisiDOM);

	pd.arrayWalk(klist, (x) => {
		let val = (x.f ? x.f(this[x.v]) : this[x.v]);
		let post = (x.hasOwnProperty('p') ? x.p : 'ημέρες');

		if (post)
		val += '<span style="font-weight: normal;">&nbsp;' + post + '</span>';

		enotitaDOM.
		append(Proklisi.klisi.klisiPedioDOM(x.k, val));
	});

	return this;
}

Proklisi.klisi.prototype.klisiOximaDOM = function(klisiDOM) {
	let errors = klisiDOM.data('errors');
	let oxima = this.oxima;

	if (!oxima) {
		errors.push('Όχημα');
		return this;
	}

	klisiDOM.
	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ')).
	append(Proklisi.klisi.enotitaDOM().
	append(Proklisi.klisi.klisiPedioDOM('Αρ. Κυκλοφορίας', oxima.pinakidaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Μάρκα', oxima.markaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Χρώμα', oxima.xromaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Τύπος', oxima.tiposGet())));

	let x = oxima.katastasiGet();

	if (x !== 'ΚΙΝΗΣΗ')
	klisiDOM.
	append(Proklisi.klisi.klisiPedioDOM('Κατάσταση', x).
	addClass('proklisiKlisiAlert'));

	return this;
};

Proklisi.klisi.prototype.klisiKatoxosDOM = function(klisiDOM) {
	if (!this.oxima)
	return this;

	let errors = klisiDOM.data('errors');
	let katoxos = this.oxima.kiriosKatoxosGet();

	if (!katoxos) {
		errors.push('Κάτοχος');
		return this;
	}

	katoxos = this.oxima.katoxos[katoxos - 1];

	let enotitaDOM = $('<div>').
	addClass('proklisiKlisiProtected').
	appendTo(klisiDOM);

	enotitaDOM.
	append(Proklisi.klisi.
	enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΚΥΡΙΟΥ ΚΑΤΟΧΟΥ'));

	let dataDOM = Proklisi.klisi.enotitaDOM().
	addClass('proklisiKlisiProtected').
	appendTo(enotitaDOM);

	dataDOM.
	append(Proklisi.klisi.klisiPedioDOM('ΑΦΜ', katoxos.afm));

	if (katoxos.pososto != 100)
	dataDOM.
	append(Proklisi.klisi.klisiPedioDOM('Ποσοστό', katoxos.pososto + '%'));

	dataDOM.
	append(Proklisi.klisi.klisiPedioDOM((katoxos.isFisikoProsopo() ?
		'Ονοματεπώνυμο' : 'Επωνυμία'), katoxos.onomasiaGet()));

	if (katoxos.dief)
	dataDOM.append(Proklisi.klisi.klisiPedioDOM('Διεύθυνση', katoxos.dief));

	if (katoxos.perioxi && katoxos.tk)
	dataDOM.append(Proklisi.klisi.
	klisiPedioDOM('Πόλη/Περιοχή', katoxos.perioxi +
	'<span style="font-weight: normal;">, </span>' + katoxos.tk));

	else if (katoxos.perioxi)
	dataDOM.append(Proklisi.klisi.
	klisiPedioDOM('Πόλη/Περιοχή', katoxos.perioxi));

	else if (katoxos.tk)
	dataDOM.append(Proklisi.klisi.klisiPedioDOM('Ταχ. κωδικός', katoxos.tk));

	return this;
}

Proklisi.klisi.prototype.klisiFooterDOM = function(klisiDOM) {
	let errors = klisiDOM.data('errors');
	let xristis = Proklisi.xristis;
	let titlos;
	let kodikos;
	let onoma;

	if (Proklisi.xristisIsAstinomikos()) {
		titlos = (Proklisi.xristis.filo === 'ΑΝΔΡΑΣ' ?
			'Ο Δημοτικός Αστυνομικός' :
			'Η Δημοτική Αστυνομικός');
		kodikos = Proklisi.xristis.kodikos;
		onoma = Proklisi.xristis.onomateponimo;
	}

	if (!kodikos) {
		errors.push('Αρμόδιος');
		return this;
	}

	let footerDOM = $('<table>').addClass('proklisiKlisiEnotitaFooter');
	let footerLeftDOM = $('<div>').addClass('proklisiKlisiFooterLeft');
	let footerRightDOM = $('<div>').addClass('proklisiKlisiFooterRight');

	footerRightDOM.
	append($('<div>').addClass('proklisiKlisiFooterArmodios').
	append($('<div>').addClass('proklisiKlisiFooterArmodiosTitlos').text(titlos)).
	append($('<div>').addClass('proklisiKlisiFooterArmodiosKodikos').text(kodikos)).
	append($('<div>').addClass('proklisiKlisiFooterArmodiosOnoma').text(onoma)).
	append($('<img>').addClass('proklisiKlisiFooterArmodiosIpografi').
	attr('src', '../ipografi/' + kodikos + '.png?xxx')));

	klisiDOM.
	append(footerDOM.
	append($('<tr>').addClass('proklisiKlisiFooterLine').
	append($('<td>').addClass('proklisiKlisiFooterLeftCol').
	append(footerLeftDOM)).
	append($('<td>').addClass('proklisiKlisiFooterRightCol').
	append(footerRightDOM))));

	return this;
}

///////////////////////////////////////////////////////////////////////////////@

Proklisi.klisi.enotitaTitlosDOM = (titlos) => {
	return $('<div>').
	addClass('proklisiKlisiEnotitaTitlos').
	html(titlos);
};

Proklisi.klisi.enotitaDOM = () => {
	return $('<table>').
	addClass('proklisiKlisiEnotitaData');
};

Proklisi.klisi.klisiPedioDOM = (label, data) => {
	label += pd.param.filler;

	return $('<tr>').
	addClass('proklisiKlisiPedio').

	append(Proklisi.klisi.klisiLabelDOM(label)).
	append(Proklisi.klisi.klisiDataDOM(data));
};

Proklisi.klisi.klisiLabelDOM = (label) => {
	return $('<td>').
	append($('<div>').
	addClass('proklisiKlisiLabel').
	html(label));
};

Proklisi.klisi.klisiDataDOM = (data) => {
	return $('<td>').
	addClass('proklisiKlisiData').
	html(data);
};

///////////////////////////////////////////////////////////////////////////////@
};
