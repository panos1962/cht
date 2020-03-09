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
// www/dimas/proklisi/oxima.js —— Παρακολούθημα του www/dimas/proklisi/main.js
// σχετικό με τα οχήματα.
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2020-03-09
// Updated: 2020-03-07
// Created: 2020-03-06
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

Proklisi.oximaSetup = () => {
	Proklisi.oximaPaletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['latin'],
			pd.paletaList['greek'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.menuKlisiDOM),
		'change': Proklisi.oximaGetData,
	});

	Proklisi.oximaDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Στοιχεία οχήματος').
	data('fyi', 'Πληκτρολογήστε τον αρ. κυκλοφορίας οχήματος');

	Proklisi.
	oximaMarkaSetup().
	oximaXromaSetup().
	oximaTiposSetup();

	Proklisi.oximaDOM.
	append(Proklisi.oximaPaletaDOM);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.oximaMarkaSetup = () => {
	let markesDOM = $('<div>');

	pd.arrayWalk([
		'HYUNDAI',
		'NISSAN',
		'TOYOTA',
		'HONDA',
		'MAZDA',
		'MITSUBISHI',
		'SUBARU',
		'SUZUKI',
		'DAIHATSU',
		'KIA',
		'YAMAHA',
		'LEXUS',
		'FIAT',
		'ALFAROMEO',
		'LANCIA',
		'VW',
		'AUDI',
		'BMW',
		'MERCEDES',
		'SMART',
		'PORSCHE',
		'MINI',
		'JAGUAR',
		'LANDROVER',
		'MG',
		'FORD',
		'CHEVROLET',
		'CHRYSLER',
		'DODGE',
		'JEEP',
		'CITROEN',
		'RENAULT',
		'PEUGEOT',
		'SEAT',
		'VOLVO',
		'SAAB',
		'SKODA',
		'DACIA',
		'KTM',
	], (x) => {
		markesDOM.
		append($('<div>').
		addClass('proklisiMarkaContainer').
		data('marka', x).
		append($('<img>').
		addClass('proklisiMarkaImage').
		attr('src', '../../images/marka/' + x + '.jpg')));
	});

	Proklisi.oximaMarkaRafiDOM = pd.paletaRafi({
		'titlos': 'Μάρκα οχήματος',
		'content': markesDOM,
		'hidden': true,
		'titlosClick': 'toggle',
	}).
	appendTo(Proklisi.oximaPaletaDOM);

	markesDOM.
	on('click', '.proklisiMarkaContainer', function(e) {
		e.stopPropagation();

		let marka = $(this).data('marka');

		if (!marka)
		return;

		let oxima = Proklisi.oximaTabDOM.data('oximaData');

		if (!oxima)
		return;

		oxima.marka = marka;
		Proklisi.oximaTabDOM.data('oximaData', oxima);

		Proklisi.
		menuTabFyi(Proklisi.oximaTabDOM, Proklisi.oximaFyi(oxima)).
		oximaMarkaRafiClear().
		oximaMarkaRafiEpilogi($(this));
	});

	return Proklisi;
};

Proklisi.oximaMarkaRafiClear = () => {
	Proklisi.oximaMarkaRafiDOM.
	children('.pandoraPaletaRafiContent').
	children('.proklisiMarkaContainer').
	removeClass('proklisiMarkaEpilogi').
	children('.proklisiMarkaCheck').
	remove();

	return Proklisi;
};

Proklisi.oximaMarkaRafiEpilogi = (markaDOM) => {
	markaDOM.
	addClass('proklisiMarkaEpilogi').
	append($('<img>').
	attr('src', '../../images/success.png').
	addClass('proklisiMarkaCheck'));

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.oximaXromaSetup = () => {
	let xromataDOM = $('<div>');

	pd.arrayWalk([
		{'c': null,'n':'ΑΚΑΘΟΡΙΣΤΟ'},
		{'c':'#000000','n':'ΜΑΥΡΟ'},
		{'c':'#ffffff','n':'ΑΣΠΡΟ'},
		{'c':'#5d5d5d','n':'ΜΟΛΥΒΙ'},
		{'c':'#00ffff','n':'ΓΑΛΑΖΙΟ'},
		{'c':'#d4d4d4','n':'ΑΣΗΜΙ'},
		{'c':'#ff0000','n':'ΚΟΚΚΙΝΟ'},
		{'c':'#d6aa69','n':'ΜΠΕΖ'},
		{'c':'#0f2861','n':'ΜΠΛΕ'},
		{'c':'#93fb98','n':'ΛΑΧΑΝΙ'},
		{'c':'#e46e00','n':'ΧΑΛΚΟΚΟΚΚΙΝΟ'},
		{'c':'#981d1d','n':'ΜΠΟΡΝΤΟ'},
		{'c':'#ffff00','n':'ΚΙΤΡΙΝΟ'},
		{'c':'#6b8e23','n':'ΧΑΚΙ'},
		{'c':'#8b4513','n':'ΚΑΦΕ'},
		{'c':'#008000','n':'ΠΡΑΣΙΝΟ'},
	], (x) => {
		xromataDOM.
		append($('<div>').
		data('xroma', x.n).
		attr('title', x.n).
		addClass('proklisiXromaContainer').
		append($('<div>').
		addClass('proklisiXroma').
		css('background-color', x.c)));
	});

	Proklisi.oximaXromaRafiDOM = pd.paletaRafi({
		'titlos': 'Χρώμα οχήματος',
		'content': xromataDOM,
		'hidden': true,
		'titlosClick': 'toggle',
	}).
	appendTo(Proklisi.oximaPaletaDOM);

	xromataDOM.
	on('click', '.proklisiXromaContainer', function(e) {
		e.stopPropagation();

		let xroma = $(this).data('xroma');

		if (!xroma)
		return;

		let oxima = Proklisi.oximaTabDOM.data('oximaData');

		if (!oxima)
		return;

		oxima.xroma = xroma;
		Proklisi.oximaTabDOM.data('oximaData', oxima);

		Proklisi.
		menuTabFyi(Proklisi.oximaTabDOM, Proklisi.oximaFyi(oxima)).
		oximaXromaRafiClear().
		oximaXromaRafiEpilogi($(this));
	});

	return Proklisi;
};

Proklisi.oximaXromaRafiClear = () => {
	Proklisi.oximaXromaRafiDOM.
	children('.pandoraPaletaRafiContent').
	children('.proklisiXromaContainer').
	removeClass('proklisiXromaEpilogi').
	children('.proklisiXroma').
	children('.proklisiXromaCheck').
	remove();

	return Proklisi;
};

Proklisi.oximaXromaRafiEpilogi = (xromaDOM) => {
	xromaDOM.
	addClass('proklisiXromaEpilogi').
	children('.proklisiXroma').
	append($('<img>').
	attr('src', '../../images/success.png').
	addClass('proklisiXromaCheck'));

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.oximaTiposSetup = () => {
	let tipoiDOM = $('<div>');

	pd.arrayWalk([
		'ΕΠΙΒΑΤΙΚΟ',
		'ΤΖΙΠ',
		'SUV',
		'ΒΑΝ',
		'ΗΜΙΦΟΡΤΗΓΟ',
		'ΦΟΡΤΗΓΟ',
		'ΣΚΑΠΤΙΚΟ',
		'ΤΡΑΚΤΕΡ',
		'ΤΑΞΙ',
		'ΛΕΩΦΟΡΕΙΟ',
		'ΔΙΚΥΚΛΟ',
		'ΤΡΙΚΥΚΛΟ',
		'ΤΡΕΪΛΕΡ',
	], (x) => {
		tipoiDOM.
		append($('<div>').
		addClass('proklisiTiposContainer').
		append($('<div>').
		addClass('proklisiTipos').
		text(x)));
	});

	Proklisi.oximaTiposRafiDOM = pd.paletaRafi({
		'titlos': 'Τύπος οχήματος',
		'content': tipoiDOM,
		'hidden': true,
		'titlosClick': 'toggle',
	});

	Proklisi.oximaTiposRafiDOM.
	appendTo(Proklisi.oximaPaletaDOM);

	tipoiDOM.
	on('mouseenter', '.proklisiTiposContainer', function(e) {
		e.stopPropagation();

		$(this).
		addClass('proklisiTiposContainerCandi').
		children('.proklisiTipos').
		addClass('proklisiTiposCandi');
	}).
	on('mouseleave', '.proklisiTiposContainer', function(e) {
		e.stopPropagation();

		$(this).
		removeClass('proklisiTiposContainerCandi').
		children('.proklisiTipos').
		removeClass('proklisiTiposCandi');
	}).
	on('click', '.proklisiTiposContainer', function(e) {
		e.stopPropagation();

		let tipos = $(this).text();

		if (!tipos)
		return;

		let oxima = Proklisi.oximaTabDOM.data('oximaData');

		if (!oxima)
		return;

		oxima.tipos = tipos;
		Proklisi.oximaTabDOM.data('oximaData', oxima);

		Proklisi.
		menuTabFyi(Proklisi.oximaTabDOM, Proklisi.oximaFyi(oxima)).
		oximaTiposRafiClear().
		oximaTiposRafiEpilogi($(this));
	});

	return Proklisi;
};

Proklisi.oximaTiposRafiClear = () => {
	Proklisi.oximaTiposRafiDOM.
	children('.pandoraPaletaRafiContent').
	children('.proklisiTiposContainer').
	removeClass('proklisiTiposEpilogi').
	children('.proklisiTiposCheck').
	remove();

	return Proklisi;
};

Proklisi.oximaTiposRafiEpilogi = (tiposDOM) => {
	tiposDOM.
	addClass('proklisiTiposEpilogi').
	append($('<img>').
	attr('src', '../../images/success.png').
	addClass('proklisiTiposCheck'));

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.oximaExec = () => {
	Proklisi.enotitaActivate(Proklisi.oximaDOM);
	return Proklisi;
};

Proklisi.oximaGetData = (paletaDOM) => {
	let oximaDOM = Proklisi.oximaTabDOM;
	let pinakida = paletaDOM.data('text');

	Proklisi.
	menuTabStatus(oximaDOM.
	removeData('oximaData').
	removeData('oximaError')).
	menuTabFyi(oximaDOM);

	if (!pinakida)
	return Proklisi;

	let oxima = {
		'pinakida': pinakida,
	};

	Proklisi.
	menuTabStatus(oximaDOM, 'busy').
	menuTabFyi(oximaDOM, pinakida).
	fyiMessage();

	$.post({
		'url': Proklisi.param.govHUBServerUrl,
		'dataType': 'json',
		'data': {
			'idos': 'oxima',
			'key': pinakida,
			'sesami': govHUBConf.sesami,
		},
		'success': (rsp) => {
			if (rsp.hasOwnProperty('error')) {
				Proklisi.fyiError(rsp.error).
				menuTabStatus(oximaDOM.data('oximaError', rsp.error), 'error').
				menuTabFyiError(oximaDOM, '<div>&#x2753;</div>' + pinakida);

				oxima = (new gh.oxima(oxima)).fixChildren();
			}

			else {
				oxima = (new gh.oxima(rsp.data)).fixChildren();
				Proklisi.menuTabStatus(oximaDOM, 'success').
				menuTabFyi(oximaDOM, Proklisi.oximaFyi(oxima));

				let fyi = '';

				if (oxima.noKinisi())
				fyi = pd.strPush(fyi, oxima.katastasi);

				if (oxima.noEpivatiko())
				fyi = pd.strPush(fyi, oxima.tipos);

				Proklisi.fyiError(fyi);
			}

			oximaDOM.data('oximaData', oxima);
		},
		'error': (err) => {
			Proklisi.
			fyiError('Σφάλμα ανάκτησης στοιχείων οχήματος', err).
			menuTabStatus(oximaDOM.data('oximaError',
			'Αποτυχημένη ανάκτηση στοιχείων οχήματος'), 'error').
			menuTabFyiError(oximaDOM, pinakida);
			oximaDOM.data('oximaData', (new gh.oxima(oxima)).fixChildren());
		},
	});

	return Proklisi;
};

Proklisi.oximaFyi = (oxima) => {
	let fyi = '';

	if (oxima.pinakida)
	fyi += '<div><b>' + oxima.pinakida + '</b></div>';

	if (oxima.marka)
	fyi += '<div>' + oxima.marka + '</div>';

	if (oxima.xroma)
	fyi += '<div>' + oxima.xroma + '</div>';

	if (oxima.tipos && oxima.noEpivatiko())
	fyi += ' <div class="proklisiOximaTiposNotice">' + oxima.tipos + '</div>';

	if (oxima.katastasi && oxima.noKinisi())
	fyi += ' <div class="proklisiOximaKatastasiNotice">' + oxima.katastasi + '</div>';

	return fyi;
};

///////////////////////////////////////////////////////////////////////////////@
};
