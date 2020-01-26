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
// www/dimas/proklisi/klisi.js —— Προεπισκόπηση προ-κλήσεων παραβάσεων ΚΟΚ.
// @FILE END
//
// @DESCRIPTION BEGIN
// Στο παρόν JavaScript module περιέχονται δομές και functions που εξυπηρτούν
// τη σύνταξη και την προεπισκόπηση προ-κλήσεων που συντάσσουν οι δημοτικοί
// αστυνομικοί και αφορούν σε παραβάσεις του ΚΟΚ.
//
// Το παρόν δεν είναι αυτόνομο JavaScript module αλλά αποτελεί παρακολούθημα
// του προγράμματος δημιουργίας προ-κλήσεων "dimas/proklisi/main.js" και ο
// κύριος λόγος διαχωρισμού είναι η ευκολότερη διαχείριση των προγραμμάτων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-01-25
// Created: 2020-01-24
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

// Από το κυρίως πρόγραμμα μεταφέρουμε τα modules "Proklisi" (κυρίως πρόγραμμα),
// "gh" ("govHUB" API) και "pd" ("pandora" module).

module.exports = function(Proklisi, gh, pd) {

///////////////////////////////////////////////////////////////////////////////@

// Η κλάση "Proklisi.klisi" αφορά σε προ-κλήσεις παταβάσεων ΚΟΚ τουτέστιν
// βεβαιώσεις παραβάσεων ΚΟΚ σε πρώιμο στάδιο. Βεβαίωση παράβασης ΚΟΚ σε
// πρώιμο στάδιο είναι η αρχική διαπίστωση της παράβασης επί του πεδίου και
// η καταγραφή από τον δημοτικό αστυνομικό των στοιχείων της παράβασης σε
// καρνέ κλήσεων. Οι προ-κλήσεις καταχωρούνται αρχικά σε πρόχειρη database
// και κατόπιν ελέγχονται και μεταφέρονται ως κλήσεις στο ΟΠΣΟΥ.

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

Proklisi.klisi.prototype.klisiDOM = function() {
	let klisiSelidaDOM = $('<div>').
	addClass('proklisiKlisiSelida');

	let klisiDOM = $('<div>').
	addClass('proklisiKlisi').
	appendTo(klisiSelidaDOM);

	this.
	klisiOximaDOM(klisiDOM).
	klisiKatoxosDOM(klisiDOM).
	klisiParavasiDOM(klisiDOM);

	return klisiSelidaDOM;
};

Proklisi.klisi.prototype.klisiParavasiDOM = function(klisiDOM) {
	klisiDOM.
	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ'));

	let enotitaDOM =
	Proklisi.klisi.enotitaDOM().
	appendTo(klisiDOM);

	let topos = this.topos;

	if (!topos)
	topos = '';

	let paravasi = (this.paravidos ?
		this.paravidos.diataxiGet() +
		'<span class="proklisiKlisiParavasi">' +
		this.paravidos.perigrafi + '</span>' : '');

	enotitaDOM.
	append(Proklisi.klisi.klisiPedioDOM('Τόπος', topos)).
	append(Proklisi.klisi.klisiPedioDOM('Παράβαση', paravasi));

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
	addClass('proklisiKlisiEnotitaPrivate').
	appendTo(klisiDOM);

	enotitaDOM.
	append(Proklisi.klisi.
	enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΚΥΡΙΟΥ ΚΑΤΟΧΟΥ'));

	let dataDOM = Proklisi.klisi.enotitaDOM().
	addClass('proklisiKlisiEnotitaPrivate').
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
	addClass('proklisiKlisiLabel').
	html(label);
};

Proklisi.klisi.klisiDataDOM = (data) => {
	return $('<td>').
	addClass('proklisiKlisiData').
	html(data);
};

///////////////////////////////////////////////////////////////////////////////@
};
