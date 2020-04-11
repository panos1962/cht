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
// Updated: 2020-03-07
// Updated: 2020-03-06
// Updated: 2020-03-03
// Updated: 2020-02-17
// Updated: 2020-02-14
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

		if (data.hasOwnProperty('geox') &&
			data.hasOwnProperty('geoy')) {
			this.geox = data.geox;
			this.geoy = data.geoy;
		}
	}

	// Σε κάθε menu tab (κουτάκι επιλογής από μενού) υπάρχει data
	// item με όνομα σχετικό με το όνομα του menu tab, π.χ. στο
	// menu tab "oximaMenuTab" υπάρχει data item "oximaData" με
	// τον αρ. κυκλοφορίας οχήματος. Εκμεταλλευόμαστε, λοιπόν,
	// αυτήν την ευταξία στο πρόγραμμα προκειμένου να δώσουμε
	// αρχικές τιμές στα υπόλοιπα πεδία της υπό επεξεργασία
	// πρό-κλησης.

	pd.arrayWalk([
		'oxima',
		'ipoxreos',
		'topos',
		'paravidos',
		'paralogos',
		'oximaKatigoria',
		'pinakides',
		'adia',
		'diploma',
		'prostimo',
	], (x) => {
		let data = Proklisi[x + 'TabDOM'].data(x +'Data');

		if (data)
		this[x] = data;
	});

	// Εφόσον έχει καθοριστεί λόγος παράβασης, τον εντάσσουμε ως στοιχείο
	// του είδους παράβασης και τον καταργούμε από αυτοτελές στοιχείο τής
	// πρό-κλησης.

	if (this.paralogos)
	try {
		let a = this.paravidos.kodikos.split('@');
		this.paravidos.kodikos = a[0] + '@' + this.paralogos.logos;
		this.paravidos.logos = this.paralogos.perigrafi;
	} catch (e) {}

	delete this.paralogos;
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

Proklisi.klisi.prototype.errorPush = function(err) {
	this.errors.push(err);
	return this;
};

Proklisi.klisi.prototype.isError = function() {
	return this.errors.length;
};

Proklisi.klisi.prototype.noError = function() {
	return !this.isError();
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.klisi.prototype.klisiDOM = function() {
	this.errors = [];

	let klisiSelidaDOM = $('<div>').
	addClass('proklisiKlisiSelida');

	let klisiDOM = $('<div>').
	addClass('proklisiKlisi').
	appendTo(klisiSelidaDOM);

	this.
	klisiHeaderDOM(klisiDOM).
	klisiOximaDOM(klisiDOM).
	klisiKatoxosDOM(klisiDOM).
	klisiIpoxreosDOM(klisiDOM).
	klisiParavasiDOM(klisiDOM).
	klisiKirosiDOM(klisiDOM).
	klisiFooterDOM(klisiDOM);

	if (this.noError()) {
		Proklisi.episkopisiDOM.
		removeData('errmsg');
		return klisiSelidaDOM;
	}

	let errmsg = (this.errors.length < 2 ? 'Λείπει' : 'Λείπουν');
	pd.arrayWalk(this.errors, (x, i) => errmsg += (i ? ',' : ':') +
		' <span class="proklisiKlisiMissing">' + x + '</span>');

	Proklisi.episkopisiDOM.
	data('errmsg', errmsg);

	return klisiSelidaDOM;
};

Proklisi.klisi.prototype.klisiHeaderDOM = function(klisiDOM) {
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
	this.errorPush('Αρ. Βεβαίωσης');

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
	this.errorPush('Ημερομηνία');

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
	let cols = [];

	if (this.topos)
	cols.push({
		'k': 'Τόπος',
		'v': this.topos,
	});

	else
	this.errorPush('Τόπος');

	if (this.paravidos)
	cols.push({
		'k': 'Παράβαση',
		'v': this.paravidos.diataxiGet() +
			'<span class="proklisiKlisiParavasi">' +
			this.paravidos.perigrafi + '</span>',
	});

	else
	this.errorPush('Παράβαση');

	if (!cols.length)
	return this;

	if (this.paravidos && this.paravidos.logos)
	cols.push({
		'k': 'Λόγος',
		'v': this.paravidos.logos,
	});

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
		'v': 'oximaKatigoria',
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
	let count = 0;
	let klist = Proklisi.klisi.kirosiList.filter((x) => {
		if (!this[x.v])
		return false;

		if ((!x.hasOwnProperty('c')) || x.c)
		count++;

		return true;
	});

	if (!count)
	return this.errorPush('Κυρώσεις');

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
	if (!this.oxima)
	return this.errorPush('Όχημα');

	klisiDOM.
	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ'));

	let enotitaDOM = Proklisi.klisi.enotitaDOM().
	appendTo(klisiDOM);

	let oxima = this.oxima;

	enotitaDOM.
	append(Proklisi.klisi.klisiPedioDOM('Αρ. Κυκλοφορίας', oxima.pinakidaGet()));

	let x = oxima.markaGet();

	if (x)
	enotitaDOM.
	append(Proklisi.klisi.klisiPedioDOM('Μάρκα', x));

	x = oxima.xromaGet();

	if (x)
	enotitaDOM.
	append(Proklisi.klisi.klisiPedioDOM('Χρώμα', x));

	x = oxima.tiposGet();

	if (x)
	enotitaDOM.
	append(Proklisi.klisi.klisiPedioDOM('Τύπος', x));

	x = oxima.katastasiGet();

	if (!x)
	x = 'ΑΚΑΘΟΡΙΣΤΗ';

	if (x !== 'ΚΙΝΗΣΗ')
	enotitaDOM.
	append(Proklisi.klisi.klisiPedioDOM('Κατάσταση',
	x + '<div class="proklisiKlisiAlert">&#x2753;&#x2757;</div>'));

	klisiDOM.
	append(enotitaDOM);

	return this;
};

Proklisi.klisi.prototype.klisiKatoxosDOM = function(klisiDOM) {
	if (!this.oxima)
	return this;

	let katoxos = this.oxima.kiriosKatoxosGet();

	if (!katoxos)
	return this;

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

	let onomasia = katoxos.onomasiaGet();

	if (onomasia)
	dataDOM.
	append(Proklisi.klisi.klisiPedioDOM((katoxos.isFisikoProsopo() ?
		'Ονοματεπώνυμο' : 'Επωνυμία'), onomasia));

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

Proklisi.klisi.prototype.klisiIpoxreosDOM = function(klisiDOM) {
	if (!this.ipoxreos)
	return this;

	let ipoxreos = this.ipoxreos;

	klisiDOM.
	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ')).
	append(Proklisi.klisi.enotitaDOM().
	append(Proklisi.klisi.klisiPedioDOM('ΑΦΜ', ipoxreos.afm)));

	let onomasia = ipoxreos.onomasiaGet();

	if (onomasia)
	klisiDOM.
	append(Proklisi.klisi.klisiPedioDOM((ipoxreos.isFisikoProsopo() ?
		'Ονοματεπώνυμο' : 'Επωνυμία'), ipoxreos.onomasiaGet()));

	if (ipoxreos.dief)
	klisiDOM.append(Proklisi.klisi.klisiPedioDOM('Διεύθυνση', ipoxreos.dief));

	if (ipoxreos.perioxi && ipoxreos.tk)
	klisiDOM.append(Proklisi.klisi.
	klisiPedioDOM('Πόλη/Περιοχή', ipoxreos.perioxi +
	'<span style="font-weight: normal;">, </span>' + ipoxreos.tk));

	else if (ipoxreos.perioxi)
	klisiDOM.append(Proklisi.klisi.
	klisiPedioDOM('Πόλη/Περιοχή', ipoxreos.perioxi));

	else if (ipoxreos.tk)
	klisiDOM.append(Proklisi.klisi.klisiPedioDOM('Ταχ. κωδικός', ipoxreos.tk));

	return this;
}

Proklisi.klisi.prototype.klisiFooterDOM = function(klisiDOM) {
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

	if (!kodikos)
	return this.errorPush('Αρμόδιος');

	let footerDOM = $('<table>').addClass('proklisiKlisiEnotitaFooter');
	let footerLeftDOM = $('<div>').addClass('proklisiKlisiFooterLeft');
	let footerRightDOM = $('<div>').addClass('proklisiKlisiFooterRight');

	let armodiosDOM = $('<div>').addClass('proklisiKlisiFooterArmodios').
	append($('<div>').addClass('proklisiKlisiFooterArmodiosTitlos').text(titlos)).
	append($('<div>').addClass('proklisiKlisiFooterArmodiosKodikos').text(kodikos)).
	append($('<div>').addClass('proklisiKlisiFooterArmodiosOnoma').text(onoma));

	footerRightDOM.append(armodiosDOM);

	let ipografi = php.sessionGet(php.defs['CHT_SESSION_IPOGRAFI_XRISTI']);

	if (ipografi)
	armodiosDOM.append($('<img>').
	addClass('proklisiKlisiFooterArmodiosIpografi').
	attr('src', '../../tmp/ipografi/' + ipografi + '.png'));

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

Proklisi.klisi.prototype.ipovoliDOM = function() {
	let proklisi = this;

	let buttonDOM = $('<div>').
	addClass('proklisiButton').
	text('Υποβολή βεβαίωσης').
	on('click', function(e) {
		e.stopPropagation();
		proklisi.ipovoli($(this), ipovoliDOM);
	});

	let ipovoliDOM = $('<div>').
	data('state', 0).
	addClass('proklisiKlisiIpovoliSection').
	append(buttonDOM);

	if (Proklisi.economyMode) {
		buttonDOM.addClass('proklisiButtonEconomy');
		ipovoliDOM.addClass('proklisiKlisiIpovoliSectionEconomy');
	}

	return ipovoliDOM;
}

Proklisi.klisi.prototype.ipovoli = function(epikirosiDOM, ipovoliDOM) {
	let state = ipovoliDOM.data('state');

	if (state)
	return Proklisi.klisi.ipovoliExec(this);

	epikirosiDOM.attr('value', 'Επικύρωση υποβολής');

	let buttonDOM = $('<div>').
	addClass('proklisiButton').
	text('Ακύρωση υποβολής').
	on('click', function(e) {
		e.stopPropagation();

		$(this).remove();
		ipovoliDOM.data('state', 0);
		epikirosiDOM.text('Υποβολή βεβαίωσης');
	});

	ipovoliDOM.
	data('state', state + 1).
	prepend(buttonDOM);

	if (Proklisi.economyMode)
	buttonDOM.addClass('proklisiButtonEconomy');
};

Proklisi.klisi.ipovoliExec = function(proklisi) {
	let data = proklisi.ipovoliFormat();

	if (data.error)
	return pd.fyiError(data.error);

	$.post({
		'url': 'ipovoli.php',
		'dataType': 'text',
		'data': proklisi.ipovoliFormat(),
		'success': (rsp) => {
			if (!rsp)
			return Proklisi.neaProklisi();

			console.error(rsp);
			return pd.fyiError(rsp);
		},
		'error': (err) => {
			console.error(err);
			pd.fyiError('Αποτυχία καταχώρησης βεβαίωσης');
		},
	});
};

Proklisi.klisi.prototype.ipovoliFormat = function() {
	let x = {};

	if (!this.kodikos)
	return this.ipovoliError('Ακαθόριστος κωδικός βεβαίωσης');

	if (!this.imerominia)
	return this.ipovoliError('Ακαθόριστη ημερομηνία βεβαίωσης');

	if (!this.paravidos)
	return this.ipovoliError('Ακαθόριστο είδος παράβασης');

	try {
		if (!this.ipoxreos)
		this.ipoxreos = this.oxima.katoxos
		[this.oxima.kiriosKatoxosGet() - 1];
	}

	catch (e) {
		pd.fyiError('Ακαθόριστα στοιχεία υπόχρεου');
	}

	if (!this.topos)
	return this.ipovoliError('Ακαθόριστος τόπος παράβασης');

	x.proklidata = {};

	///////////////////////////////////////////////////////////////////////@

	let t = this.paravidos;

	x.proklidata['ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ'] = {
		'ΚΩΔΙΚΟΣ': t.kodikos,
		'ΔΙΑΤΑΞΗ': t.diataxiGet(),
		'ΠΑΡΑΒΑΣΗ': t.perigrafi,
		'ΛΟΓΟΣ': t.logos,
		'ΤΟΠΟΣ': this.topos,
		'GEOX': this.geox,
		'GEOY': this.geoy,
	};

	///////////////////////////////////////////////////////////////////////@

	if (this.oxima) {
		t = this.oxima;

		// Θα μεταφέρουμε την κατάσταση του οχήματος μόνον εάν
		// το όχημα δεν είναι καταγεγραμμένο σε κατάσταση κίνησης.

		let katastasi = t.katastasi;

		if (!katastasi)
		katastasi = 'ΑΚΑΘΟΡΙΣΤΗ';

		else if (t.isKinisi())
		katastasi = undefined;

		x.proklidata['ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ'] = {
			'ΑΡ. ΚΥΚΛΟΦΟΡΙΑΣ': t.pinakida,
			'ΜΑΡΚΑ': t.marka,
			'ΧΡΩΜΑ': t.xroma,
			'ΤΥΠΟΣ': t.tipos,
			'ΚΑΤΗΓΟΡΙΑ': this.oximaKatigoria,
			'ΚΑΤΑΣΤΑΣΗ': katastasi,
		};
	}

	///////////////////////////////////////////////////////////////////////@

	if (this.ipoxreos) {
		t = this.ipoxreos;

		x.proklidata['ΣΤΟΙΧΕΙΑ ΥΠΟΧΡΕΟΥ'] = {
			'ΑΦΜ': t.afm,
			'ΕΠΩΝΥΜΙΑ': t.eponimia,
			'ΝΟΜΙΚΗ ΜΟΡΦΗ': t.morfi,
			'ΕΠΩΝΥΜΟ': t.eponimo,
			'ΟΝΟΜΑ': t.onoma,
			'ΠΑΤΡΩΝΥΜΟ': t.patronimo,
			'ΔΙΕΥΘΥΝΣΗ': t.dief,
			'ΤΚ': t.tk,
			'ΠΕΡΙΟΧΗ/ΠΟΛΗ': t.perioxi,
		};
	}

	///////////////////////////////////////////////////////////////////////@

	x.proklidata['ΚΥΡΩΣΕΙΣ ΚΑΙ ΠΡΟΣΤΙΜΑ'] = {
		'ΠΙΝΑΚΙΔΕΣ': this.pinakides,
		'ΑΔΕΙΑ': this.adia,
		'ΔΙΠΛΩΜΑ': this.diploma,
		'ΠΡΟΣΤΙΜΟ': this.prostimo,
	};


	pd.objectWalk(x.proklidata, (t, i) => {
		let empty = true;

		pd.objectWalk(t, (v, k) => {
			if (v)
			empty = false;

			else
			delete t[k];
		});

		if (empty)
		delete x[i];
	});

	x.kodikos = this.kodikos;
	x.imerominia = pd.dateTime(this.imerominia);

	return x;
};

Proklisi.klisi.prototype.ipovoliError = function(msg) {
	return {
		'error': msg,
	};
};

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
