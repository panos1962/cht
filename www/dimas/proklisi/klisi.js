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

Proklisi.klisi = function() {
	let data = Proklisi.oximaTabDOM.data('oximaData');

	if (data)
	this.oxima = (new gh.oxima(data)).fixChildren();
else
this.oxima = (new gh.oxima({
	'pinakida': 'ΝΒΝ9596',
	'marka': 'NISSAN',
	'xroma': 'ΕΡΥΘΡΟ',
	'tipos': 'ΕΠΙΒΑΤΙΚΟ',
	'katoxos': [
		{
			'afm': '032792320',
			'pososto': 100,
			'eponimo': 'ΠΑΠΑΔΟΠΟΥΛΟΣ',
			'onoma': 'ΟΝΟΜΑ',
			'patronimo': 'ΙΩΑΝΝΗΣ',
			'dief': 'ΜΗΤΡ. ΜΟΣΧΟΝΗΣΙΩΝ 54, 55131, ΚΑΛΑΜΑΡΙΑ',
		},
	]
})).fixChildren();

	data = Proklisi.toposTabDOM.data('toposData');

	if (data)
	this.topos = Proklisi.toposTabDOM.data('toposData');
else
this.topos = 'ΜΗΤΡΟΠΟΛΙΤΟΥ ΜΟΣΧΟΝΗΣΙΩΝ ΚΑΙ ΑΝΑΤΟΛΙΚΗΣ ΘΡΑΚΗΣ ΑΜΒΡΟΣΙΟΥ 54';
};

Proklisi.klisi.prototype.klisiDOM = function() {
	let klisiSelidaDOM = $('<div>').
	addClass('proklisiKlisiSelida');

	let klisiDOM = $('<div>').
	addClass('proklisiKlisi').
	appendTo(klisiSelidaDOM);

	let data = this.oxima;

	if (data)
	klisiDOM.
	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ')).
	append(Proklisi.klisi.enotitaDOM().
	append(Proklisi.klisi.klisiPedioDOM('Αρ. Κυκλοφορίας', data.pinakidaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Μάρκα', data.markaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Χρώμα', data.xromaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Τύπος', data.tiposGet())));

	if (data)
	data = data.kiriosKatoxosGet();

	if (this.oxima && data)
	data = this.oxima.katoxos[data - 1];

	if (data) {
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
		append(Proklisi.klisi.klisiPedioDOM('ΑΦΜ', data.afm));

		if (data.pososto != 100)
		dataDOM.
		append(Proklisi.klisi.klisiPedioDOM('Ποσοστό', data.pososto + '%'));

		dataDOM.
		append(Proklisi.klisi.klisiPedioDOM((data.isFisikoProsopo() ?
			'Ονοματεπώνυμο' : 'Επωνυμία'), data.onomasiaGet())).
		append(Proklisi.klisi.klisiPedioDOM('Διεύθυνση', data.dief));
	}

	data = this.topos;

	if (!data)
	data = '';

	klisiDOM.
	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ')).
	append(Proklisi.klisi.enotitaDOM()).
	append(Proklisi.klisi.klisiPedioDOM('Τόπος', data));

	return klisiSelidaDOM;
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
