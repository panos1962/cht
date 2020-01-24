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
// www/dimas/proklisi/main.js —— Πρόγραμμα οδήγησης σελίδας καταχώρησης και
// επεξεργασίας προ-κλήσεων.
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2020-01-24
// Updated: 2020-01-23
// Created: 2020-01-22
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";
module.exports = function(Proklisi, gh, pd) {

Proklisi.param.filler = '';
{
	for (let i = 0; i < 100; i++)
	Proklisi.param.filler += '&hellip;';
}

///////////////////////////////////////////////////////////////////////////////@

Proklisi.klisi = function() {
	this.oxima = new gh.oxima(Proklisi.oximaTabDOM.data('oximaData'));
	this.topos = Proklisi.toposTabDOM.data('toposData');
};

Proklisi.klisi.prototype.klisiDOM = function() {
	let oxima = this.oxima;
	let topos = this.topos;

	let klisiDOM = $('<div>').
	addClass('proklisiKlisiSelida').
	append($('<div>').
	addClass('proklisiKlisi').

	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ')).
	append(Proklisi.klisi.klisiPedioDOM('Αρ. Κυκλοφορίας', oxima.pinakidaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Μάρκα', oxima.markaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Χρώμα', oxima.xromaGet())).
	append(Proklisi.klisi.klisiPedioDOM('Τύπος', oxima.tiposGet())).

	append(Proklisi.klisi.enotitaTitlosDOM('ΣΤΟΙΧΕΙΑ ΠΑΡΑΒΑΣΗΣ')).
	append(Proklisi.klisi.klisiPedioDOM('Τόπος', topos)).

	append($('<div>').text('xxx')));

	return klisiDOM;
}

Proklisi.klisi.enotitaTitlosDOM = (titlos) => {
	return $('<div>').
	addClass('proklisiKlisiEnotitaTitlos').
	html(titlos);
};

Proklisi.klisi.klisiPedioDOM = (label, data) => {
	if (!label)
	label = '&#x200b;';

	label += Proklisi.param.filler;

	if (!data)
	data = '&#x200b;';

	return $('<div>').
	addClass('proklisiKlisiPedio').

	append(Proklisi.klisi.klisiLabelDOM(label)).
	append(Proklisi.klisi.klisiDataDOM(data));
};

Proklisi.klisi.klisiLabelDOM = (label) => {
	return $('<div>').
	addClass('proklisiKlisiLabel').
	html(label);
};

Proklisi.klisi.klisiDataDOM = (data) => {
	return $('<div>').
	addClass('proklisiKlisiData').
	html(data);
};

///////////////////////////////////////////////////////////////////////////////@
};
