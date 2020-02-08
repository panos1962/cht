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
// www/dimas/proklisi/kirosi.js —— Module επεξεργασίας κρώσεων και προστίμου
// προ-κλήσεων.
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-02-06
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

Proklisi.kirosiSetup = () => {
	Proklisi.kirosiDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Κυρώσεις & πρόστιμα').
	addClass('proklisiMenu').

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.pinakidesTabDOM = $('<div>').
	data('exec', Proklisi.pinakidesExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Αφαίρεση πινακίδων'))).

	append(Proklisi.adiaTabDOM = $('<div>').
	data('exec', Proklisi.adiaExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Αφαίρεση αδείας'))).

	append(Proklisi.diplomaTabDOM = $('<div>').
	data('exec', Proklisi.diplomaExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Αφαίρεση διπλώματος')))).

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.prostimoTabDOM = $('<div>').
	data('exec', Proklisi.prostimoExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Πρόστιμο'))).

	append(Proklisi.misthosiTabDOM = $('<div>').
	data('exec', Proklisi.misthosiExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Μισθωμένα, ΤΑΞΙ, Δ.Χ. κλπ'))));

	Proklisi.
	pinakidesSetup().
	adiaSetup().
	diplomaSetup().
	prostimoSetup().
	misthosiSetup();

	return Proklisi;
};

Proklisi.kirosiExec = () => {
	Proklisi.enotitaActivate(Proklisi.kirosiDOM);
	return Proklisi;
};

Proklisi.kirosiFyiRefresh = () => {
	let fyi = '';

	let s = Proklisi.prostimoTabDOM.children('.proklisiMenuTabFyi').html();

	if (s)
	fyi += '<tr>' + s + '</tr>';

	s = Proklisi.pinakidesTabDOM.children('.proklisiMenuTabFyi').html();

	if (s)
	fyi += '<tr>' + s + '</tr>';

	s = Proklisi.adiaTabDOM.children('.proklisiMenuTabFyi').html();

	if (s)
	fyi += '<tr>' + s + '</tr>';

	s = Proklisi.diplomaTabDOM.children('.proklisiMenuTabFyi').html();

	if (s)
	fyi += '<tr>' + s + '</tr>';

	Proklisi.menuTabFyi(Proklisi.kirosiTabDOM, fyi);
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.pinakidesSetup = () => {
	Proklisi.pinakidesDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Αφαίρεση πινακίδων').
	data('fyi', 'Πληκτρολογήστε το διάστημα αφαίρεσης πινακίδων (σε ημέρες)').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['digit'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': (paletaDOM) => {
			Proklisi.
			pinakidesCheckData(paletaDOM).
			kirosiFyiRefresh();
		},
	}));

	return Proklisi;
};

Proklisi.pinakidesExec = () => {
	Proklisi.enotitaActivate(Proklisi.pinakidesDOM);
	return Proklisi;
};

Proklisi.pinakidesCheckData = (paletaDOM) => {
	let pinakidesDOM = Proklisi.pinakidesTabDOM;
	let pinakides = paletaDOM.data('text');

	if (pinakides)
	pinakides = parseInt(pinakides);

	if (isNaN(pinakides))
	pinakides = 0;

	else if (pinakides <= 0)
	pinakides = 0;

	if (pinakides) {
		Proklisi.menuTabStatus(pinakidesDOM.
		data('pinakidesData', pinakides), 'success');
		Proklisi.menuTabFyi(pinakidesDOM,
			'<td class="proklisiKirosiFyiLeft">' +
			'Πινακίδες' +
			'</td>' +
			'<td class="proklisiKirosiFyiRight">' +
			pinakides + '&nbsp;ημέρες' +
			'</td>');
		return Proklisi;
	}

	Proklisi.menuTabStatus(pinakidesDOM.
	removeData('pinakidesData'), 'clear');
	Proklisi.menuTabFyi(pinakidesDOM);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.adiaSetup = () => {
	Proklisi.adiaDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Αφαίρεση αδείας').
	data('fyi', 'Πληκτρολογήστε το διάστημα αφαίρεσης αδείας (σε ημέρες)').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['digit'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': (paletaDOM) => {
			Proklisi.
			adiaCheckData(paletaDOM).
			kirosiFyiRefresh();
		},
	}));

	return Proklisi;
};

Proklisi.adiaExec = () => {
	Proklisi.enotitaActivate(Proklisi.adiaDOM);
	return Proklisi;
};

Proklisi.adiaCheckData = (paletaDOM) => {
	let adiaDOM = Proklisi.adiaTabDOM;
	let adia = paletaDOM.data('text');

	if (adia)
	adia = parseInt(adia);

	if (isNaN(adia))
	adia = 0;

	else if (adia <= 0)
	adia = 0;

	if (adia) {
		Proklisi.menuTabStatus(adiaDOM.
		data('adiaData', adia), 'success');
		Proklisi.menuTabFyi(adiaDOM,
			'<td class="proklisiKirosiFyiLeft">' +
			'Άδεια' +
			'</td>' +
			'<td class="proklisiKirosiFyiRight">' +
			adia + '&nbsp;ημέρες' +
			'</td>');
		return Proklisi;
	}

	Proklisi.menuTabStatus(adiaDOM.
	removeData('adiaData'), 'clear');
	Proklisi.menuTabFyi(adiaDOM);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.diplomaSetup = () => {
	Proklisi.diplomaDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Αφαίρεση διπλώματος οδήγησης').
	data('fyi', 'Πληκτρολογήστε το διάστημα αφαίρεσης διπλώματος (σε ημέρες)').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['digit'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': (paletaDOM) => {
			Proklisi.
			diplomaCheckData(paletaDOM).
			kirosiFyiRefresh();
		},
	}));

	return Proklisi;
};

Proklisi.diplomaExec = () => {
	Proklisi.enotitaActivate(Proklisi.diplomaDOM);
	return Proklisi;
};

Proklisi.diplomaCheckData = (paletaDOM) => {
	let diplomaDOM = Proklisi.diplomaTabDOM;
	let diploma = paletaDOM.data('text');

	if (diploma)
	diploma = parseInt(diploma);

	if (isNaN(diploma))
	diploma = 0;

	else if (diploma <= 0)
	diploma = 0;

	if (diploma) {
		Proklisi.menuTabStatus(diplomaDOM.
		data('diplomaData', diploma), 'success');
		Proklisi.menuTabFyi(diplomaDOM,
			'<td class="proklisiKirosiFyiLeft">' +
			'Δίπλωμα' +
			'</td>' +
			'<td class="proklisiKirosiFyiRight">' +
			diploma + '&nbsp;ημέρες' +
			'</td>');
		return Proklisi;
	}

	Proklisi.menuTabStatus(diplomaDOM.
	removeData('diplomaData'), 'clear');
	Proklisi.menuTabFyi(diplomaDOM);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.prostimoSetup = () => {
	Proklisi.prostimoDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Καθορισμός προστίμου').
	data('fyi', 'Πληκτρολογήστε το πρόστιμο σε ευρώ ή σε λεπτά του ευρώ').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['digit'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': (paletaDOM) => {
			Proklisi.
			prostimoCheckData(paletaDOM).
			kirosiFyiRefresh();
		},
	}));

	return Proklisi;
};

Proklisi.prostimoExec = () => {
	Proklisi.enotitaActivate(Proklisi.prostimoDOM);
	return Proklisi;
};

Proklisi.prostimoCheckData = (paletaDOM) => {
	let prostimoDOM = Proklisi.prostimoTabDOM;
	let prostimo = paletaDOM.data('text');

	if (prostimo)
	prostimo = parseInt(prostimo);

	if (isNaN(prostimo))
	prostimo = 0;

	else if (prostimo <= 0)
	prostimo = 0;

	else if (prostimo < 100)
	prostimo *= 100;

	if (prostimo) {
		Proklisi.menuTabStatus(prostimoDOM.
		data('prostimoData', prostimo), 'success');
		Proklisi.menuTabFyi(prostimoDOM,
			'<td class="proklisiKirosiFyiLeft">' +
			'Πρόστιμο' +
			'</td>' +
			'<td class="proklisiKirosiFyiRight">' +
			pd.centsToEuros(prostimo, {
				'triad': '.',
				'cents': ',',
				'post': '&nbsp;&euro;',
			}) +
			'</td>');
		return Proklisi;
	}

	Proklisi.menuTabStatus(prostimoDOM.
	removeData('prostimoData'), 'clear');
	Proklisi.menuTabFyi(prostimoDOM);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.misthosiSetup = () => {
	let lista = [
		'ΜΙΣΘΩΜΕΝΟ',
		'ΤΑΞΙ',
		'ΑΓΟΡΑΙΟ',
		'ΔΗΜΟΣΙΑΣ ΧΡΗΣΗΣ',
	];

	let paletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': true,
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': Proklisi.misthosiCheckData,
	}).data('match', lista);

	let zoomDOM = paletaDOM.children('.pandoraPaletaZoom').empty();

	pd.arrayWalk(lista, (x) => $('<div>').
	addClass('pandoraPaletaZoomGrami').
	text(x).
	appendTo(zoomDOM));

	Proklisi.misthosiDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Μισθωμένα, ΤΑΞΙ, Δ.Χ. κλπ').
	data('fyi', 'Πληκτρολογήστε ή επιλέξτε ειδική κατηγορία οχήματος').
	append(paletaDOM);

	return Proklisi;
};

Proklisi.misthosiExec = () => {
	Proklisi.enotitaActivate(Proklisi.misthosiDOM);
	return Proklisi;
};

Proklisi.misthosiCheckData = (paletaDOM) => {
	let misthosiDOM = Proklisi.misthosiTabDOM;
	let misthosi = paletaDOM.data('text');

	if (misthosi) {
		Proklisi.menuTabStatus(misthosiDOM.
		data('misthosiData', misthosi), 'success');
		Proklisi.menuTabFyi(misthosiDOM, misthosi);
		return Proklisi;
	}

	Proklisi.menuTabStatus(misthosiDOM.
	removeData('misthosiData'), 'clear');
	Proklisi.menuTabFyi(misthosiDOM);
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@
};
