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
		'titlosClick': () => {
			let markesDOM = Proklisi.oximaMarkaRafiDOM.data('markes');
			let markesHeight = Proklisi.oximaMarkaRafiDOM.data('markesHeight');

			if (markesDOM.data('emfanes'))
			markesDOM.
			finish().
			animate({
				'opacity': 0,
				'height': 0,
			}, 200, () => markesDOM.data('emfanes', false));

			else
			markesDOM.
			finish().
			animate({
				'opacity': 1,
				'height': markesHeight,
			}, 200, () => markesDOM.data('emfanes', true));
		},
	}).
	append(markesDOM).
	appendTo(Proklisi.oximaPaletaDOM);

	Proklisi.oximaMarkaRafiDOM.
	data('markes', markesDOM).
	data('markesHeight', markesDOM.height());

	markesDOM.
	css({
		'opacity': 0,
		'height': 0,
	});

	pd.bodyDOM.
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
	data('markes').
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
		{'c':'#808080','n':'ΜΟΛΥΒΙ'},
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
		'titlosClick': () => {
			let xromataDOM = Proklisi.oximaXromaRafiDOM.data('xromata');
			let xromataHeight = Proklisi.oximaXromaRafiDOM.data('xromataHeight');

			if (xromataDOM.data('emfanes'))
			xromataDOM.
			finish().
			animate({
				'opacity': 0,
				'height': 0,
			}, 200, () => xromataDOM.data('emfanes', false));

			else
			xromataDOM.
			finish().
			animate({
				'opacity': 1,
				'height': xromataHeight,
			}, 200, () => xromataDOM.data('emfanes', true));
		},
	}).
	append(xromataDOM).
	appendTo(Proklisi.oximaPaletaDOM);

	Proklisi.oximaXromaRafiDOM.
	data('xromata', xromataDOM).
	data('xromataHeight', xromataDOM.height());

	xromataDOM.
	css({
		'opacity': 0,
		'height': 0,
	});

	pd.bodyDOM.
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
	data('xromata').
	children('.proklisiXromaContainer').
	removeClass('proklisiXromaEpilogi').
	children('.proklisiXromaCheck').
	remove();

	return Proklisi;
};

Proklisi.oximaXromaRafiEpilogi = (xromaDOM) => {
	xromaDOM.
	addClass('proklisiXromaEpilogi').
	append($('<img>').
	attr('src', '../../images/success.png').
	addClass('proklisiXromaCheck'));

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.oximaTiposSetup = () => {
	Proklisi.oximaTiposRafiDOM = pd.paletaRafi({
		'titlos': 'Τύπος οχήματος',
	});

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
		Proklisi.oximaTiposRafiDOM.
		append($('<div>').
		addClass('proklisiTiposContainer').
		append($('<div>').
		addClass('proklisiTipos').
		text(x)));
	});

	Proklisi.oximaTiposRafiDOM.
	appendTo(Proklisi.oximaPaletaDOM);

	pd.bodyDOM.
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
