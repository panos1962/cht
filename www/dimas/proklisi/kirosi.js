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
// www/dimas/proklisi/kirosi.js —— Module επεξεργασίας κυρώσεων και προστίμων
// προ-κλήσεων.
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2020-03-06
// Updated: 2020-02-10
// Created: 2020-02-06
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd = require('../../../mnt/pandora/lib/pandoraClient.js');
const Dimas = require('../../../lib/dimasCore.js');

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

	append(Proklisi.monoproTabDOM = $('<div>').
	data('exec', Proklisi.monoproToggle).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel'))).

	append(Proklisi.oximaKatigoriaTabDOM = $('<div>').
	data('exec', Proklisi.oximaKatigoriaExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Ειδική κατηγορία οχήματος'))));

	Proklisi.
	pinakidesSetup().
	adiaSetup().
	diplomaSetup().
	prostimoSetup().
	monoproSetup().
	oximaKatigoriaSetup();

	return Proklisi;
};

Proklisi.kirosiExec = () => {
	Proklisi.enotitaActivate(Proklisi.kirosiDOM);
	return Proklisi;
};

Proklisi.kirosiFyiRefresh = () => {
	let keno = true;
	let fyi = '';

	let s = Proklisi.oximaKatigoriaTabDOM.children('.proklisiMenuTabFyi').html();

	if (s) {
		fyi = '<div><b>' + s + '</b></div>';
		keno = false;
	}

	fyi += '<table>';

	s = Proklisi.prostimoTabDOM.children('.proklisiMenuTabFyi').html();

	if (s) {
		fyi += '<tr>' + s + '</tr>';
		keno = false;
	}

	s = Proklisi.pinakidesTabDOM.children('.proklisiMenuTabFyi').html();

	if (s) {
		fyi += '<tr>' + s + '</tr>';
		keno = false;
	}

	s = Proklisi.adiaTabDOM.children('.proklisiMenuTabFyi').html();

	if (s) {
		fyi += '<tr>' + s + '</tr>';
		keno = false;
	}

	s = Proklisi.diplomaTabDOM.children('.proklisiMenuTabFyi').html();

	if (s) {
		fyi += '<tr>' + s + '</tr>';
		keno = false;
	}

	fyi += '</table>';

	if (keno)
	fyi = undefined;

	Proklisi.menuTabFyi(Proklisi.kirosiTabDOM, fyi);
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.pinakidesSetup = () => {
	Proklisi.pinakidesDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Αφαίρεση πινακίδων').
	data('fyi', 'Πληκτρολογήστε το διάστημα αφαίρεσης πινακίδων (σε ημέρες)').
	append(Proklisi.pinakidesPaletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['digit'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': Proklisi.pinakidesCheckData,
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
	}

	else {
		Proklisi.menuTabStatus(pinakidesDOM.
		removeData('pinakidesData'), 'clear');
		Proklisi.menuTabFyi(pinakidesDOM);
	}

	Proklisi.kirosiFyiRefresh();
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.adiaSetup = () => {
	Proklisi.adiaDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Αφαίρεση αδείας').
	data('fyi', 'Πληκτρολογήστε το διάστημα αφαίρεσης αδείας (σε ημέρες)').
	append(Proklisi.adiaPaletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['digit'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': Proklisi.adiaCheckData,
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
	}

	else {
		Proklisi.menuTabStatus(adiaDOM.
		removeData('adiaData'), 'clear');
		Proklisi.menuTabFyi(adiaDOM);
	}

	Proklisi.kirosiFyiRefresh();
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.diplomaSetup = () => {
	Proklisi.diplomaDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Αφαίρεση διπλώματος οδήγησης').
	data('fyi', 'Πληκτρολογήστε το διάστημα αφαίρεσης διπλώματος (σε ημέρες)').
	append(Proklisi.diplomaPaletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['digit'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': Proklisi.diplomaCheckData,
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
	}

	else {
		Proklisi.menuTabStatus(diplomaDOM.
		removeData('diplomaData'), 'clear');
		Proklisi.menuTabFyi(diplomaDOM);
	}

	Proklisi.kirosiFyiRefresh();
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
		'change': Proklisi.prostimoCheckData,
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
	}

	else {
		Proklisi.menuTabStatus(prostimoDOM.
		removeData('prostimoData'), 'clear');
		Proklisi.menuTabFyi(prostimoDOM);
	}

	Proklisi.kirosiFyiRefresh();
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

// Υπάρχει περίπτωση ο φορέας να μην εφαρμόζει αυστηρά το νόμο με την έννοια
// της μη επιβολής των προβλεπόμενων διοικητικών κυρώσεων και να προβαίνει
// μόνο στη βεβαίωση προστίμου ακόμη και ο νόμος προβλέπει και διοικητικές
// κυρώσεις. Το πρόγραμμα παρέχει αυτήν την ευκολία με το πάτημα σχετικού
// πλήκτρου το οποίου επιγράφεται "Μόνο πρόστιμο" ή "Όλες οι κυρώσεις".

Proklisi.monoproSetup = () => {
	Proklisi.monoproToggle();
	return Proklisi;
};

Proklisi.monoproToggle = () => {
	let monopro = Proklisi.monoproTabDOM.data('monopro');

	if (monopro)
	Proklisi.monoproSet();

	else
	Proklisi.monoproUnset();

	return Proklisi;
};

// Ακολουθεί λίστα των «χαλαρών» διοικητικών κυρώσεων, δηλαδή εκείνων των
// κυρώσεων που επιβάλλονται κατά το δοκούν.

Proklisi.kirosiList = {
	'pinakides': 0,
	'adia': 0,
	'diploma': 0,
};

Proklisi.monoproSet = function() {
	pd.objectWalk(Proklisi.kirosiList, function(x, i) {
		let dom = Proklisi[i + 'TabDOM'];
		let dat = i + 'Data';
		let pal = Proklisi[i + 'PaletaDOM'];

		Proklisi.kirosiList[i] = dom.data(dat);
		dom.data(dat, 0);
		pal.data('text', 0);
		Proklisi[i + 'CheckData'](pal);
	});

	Proklisi.monoproTabDOM.
	removeData('monopro').
	html('Όλες οι κυρώσεις');

	return Proklisi;
};

Proklisi.monoproUnset = function() {
	pd.objectWalk(Proklisi.kirosiList, function(x, i) {
		let dom = Proklisi[i + 'TabDOM'];
		let dat = i + 'Data';
		let pal = Proklisi[i + 'PaletaDOM'];

		dom.data(dat, Proklisi.kirosiList[i]);
		pal.data('text', Proklisi.kirosiList[i]);
		Proklisi.kirosiList[i] = 0;
		Proklisi[i + 'CheckData'](pal);
	});

	Proklisi.monoproTabDOM.
	data('monopro', true).
	html('Μόνο πρόστιμο');

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.oximaKatigoriaSetup = () => {
	let paletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': true,
		'submit': () => Proklisi.enotitaRise(Proklisi.kirosiDOM),
		'change': Proklisi.oximaKatigoriaCheckData,
	}).data('match', Dimas.paravidos.oximaKatigoria);

	let zoomDOM = paletaDOM.children('.pnd-paletaZoom').empty();

	pd.arrayWalk(Dimas.paravidos.oximaKatigoria, (x) => $('<div>').
	addClass('pnd-paletaZoomGrami').
	text(x).
	appendTo(zoomDOM));

	Proklisi.oximaKatigoriaDOM = Proklisi.enotitaDOM(Proklisi.kirosiDOM).
	data('titlos', 'Ειδική κατηγορία οχήματος').
	data('fyi', 'Πληκτρολογήστε ή επιλέξτε ειδική κατηγορία οχήματος').
	append(paletaDOM);

	return Proklisi;
};

Proklisi.oximaKatigoriaExec = () => {
	Proklisi.enotitaActivate(Proklisi.oximaKatigoriaDOM);
	return Proklisi;
};

Proklisi.oximaKatigoriaCheckData = (paletaDOM) => {
	if (paletaDOM === undefined)
	paletaDOM = Proklisi.oximaKatigoriaDOM.
	find('.pnd-paleta').first();

	let oximaKatigoria = paletaDOM.data('text');

	if (oximaKatigoria) {
		Proklisi.menuTabStatus(Proklisi.oximaKatigoriaTabDOM.
		data('oximaKatigoriaData', oximaKatigoria), 'success');
		Proklisi.menuTabFyi(Proklisi.oximaKatigoriaTabDOM, oximaKatigoria);
	}

	else {
		Proklisi.menuTabStatus(Proklisi.oximaKatigoriaTabDOM.
		removeData('oximaKatigoriaData'), 'clear');
		Proklisi.menuTabFyi(Proklisi.oximaKatigoriaTabDOM);
	}

	Proklisi.
	paravidosCheckData().
	kirosiFyiRefresh();

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@
};
