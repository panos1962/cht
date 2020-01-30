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
// Στο παρόν JavaScript module περιέχονται δομές και functions που εξυπηρτούν
// τη δημιουργία, την επεξεργασία, την προεπισκόπηση και την υποβολή
// προ-κλήσεων που αφορούν σε παραβάσεις του ΚΟΚ.
//
// Το παρόν δεν έχει δημιουργηθεί ως αυτόνομο JavaScript module αλλά αποτελεί
// παρακολούθημα της βασικής σελίδας δημιουργίας, επεξεργασίας και υποβολής
// προ-κλήσεων "www/dimas/proklisi/main.js" και ο κύριος λόγος διαχωρισμού
// είναι η ευκολότερη διαχείριση των προγραμμάτων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
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

const pd =
require('../../../mnt/pandora/lib/pandoraClient.js');

const gh =
require('../../../lib/govHUB/apiCore.js');

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
	let data = Proklisi.oximaTabDOM.data('oximaData');

	if (data)
	this.oxima = (new gh.oxima(data)).fixChildren();

	data = Proklisi.toposTabDOM.data('toposData');

	if (data)
	this.topos = Proklisi.toposTabDOM.data('toposData');

	data = Proklisi.paravidosTabDOM.data('paravidosData');

	if (data)
	this.paravidos = data;
};

Proklisi.klisi.prototype.kodikosGet = function() {
	let kodikos = this.kodikos;

	if (!kodikos)
	kodikos = 123456789;

	return kodikos;
};

Proklisi.klisi.prototype.imerominiaGet = function() {
	let imerominia = this.imerominia;

	if (!imerominia)
	imerominia = '27-01-2020';

	return imerominia;
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
	addClass('proklisiKlisi').
	appendTo(klisiSelidaDOM);

	this.
	klisiHeaderDOM(klisiDOM).
	klisiOximaDOM(klisiDOM).
	klisiKatoxosDOM(klisiDOM).
	klisiParavasiDOM(klisiDOM);

	return klisiSelidaDOM;
};

Proklisi.klisi.prototype.klisiHeaderDOM = function(klisiDOM) {
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

	append($('<td>').
	addClass('proklisiKlisiHeaderRight').

	append($('<div>').
	addClass('proklisiKlisiPraxi').
	html('ΠΡΑΞΗ ΒΕΒΑΙΩΣΗΣ ΠΑΡΑΒΑΣΗΣ<br>' + 
		(this.isProstimo() ? 'ΜΕ' : 'ΧΩΡΙΣ') +
		' ΕΠΙΒΟΛΗ ΠΡΟΣΤΙΜΟΥ')).

	append($('<div>').
	addClass('proklisiKlisiKodikos').
	text(this.kodikosGet())).

	append($('<div>').
	addClass('proklisiKlisiImerominia').
	text(this.imerominiaGet()))

	));

	headerDOM.
	appendTo(klisiDOM);

	return this;
}

Proklisi.klisi.prototype.klisiParavasiDOM = function(klisiDOM) {
	let cols = [];

	if (this.topos)
	cols.push({
		'k': 'Τόπος',
		'v': this.topos,
	});

	if (this.paravidos)
	cols.push({
		'k': 'Παράβαση',
		'v': this.paravidos.diataxiGet() +
			'<span class="proklisiKlisiParavasi">' +
			this.paravidos.perigrafi + '</span>',
	});

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

Proklisi.klisi.prototype.klisiOximaDOM = function(klisiDOM) {
	let oxima = this.oxima;

	if (!oxima)
	return this;

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

	dataDOM.
	append(Proklisi.klisi.klisiPedioDOM((katoxos.isFisikoProsopo() ?
		'Ονοματεπώνυμο' : 'Επωνυμία'), katoxos.onomasiaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Διεύθυνση', katoxos.dief));

	return this;
}

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
