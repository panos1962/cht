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

const pd =
require('../../../mnt/pandora/lib/pandoraClient.js');

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

Proklisi.oximaMarkaSetup = () => {
	let rafiDOM = pd.paletaRafi({
		'titlos': 'Μάρκα οχήματος',
	});

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
		rafiDOM.
		append($('<div>').
		addClass('proklisiMarkaContainer').
		data('marka', x).
		append($('<img>').
		addClass('proklisiMarkaImage').
		attr('src', '../../images/marka/' + x + '.jpg')));
	});

	rafiDOM.
	appendTo(Proklisi.oximaPaletaDOM);

	return Proklisi;
};

Proklisi.oximaXromaSetup = () => {
	let rafiDOM = pd.paletaRafi({
		'titlos': 'Χρώμα οχήματος',
	});

	pd.arrayWalk([
		{'c':'#000000','n':'ΜΑΥΡΟ'},
		{'c':'#ffffff','n':'ΑΣΠΡΟ'},
		{'c':'#808080','n':'ΜΟΛΥΒΙ'},
		{'c':'#d4d4d4','n':'ΑΣΗΜΙ'},
		{'c':'#ff0000','n':'ΚΟΚΚΙΝΟ'},
		{'c':'#0000ff','n':'ΜΠΛΕ'},
		{'c':'#00ffff','n':'ΓΑΛΑΖΙΟ'},
		{'c':'#d6aa69','n':'ΜΠΕΖ'},
		{'c':'#b22222','n':'ΜΠΟΡΝΤΟ'},
		{'c':'#ffff00','n':'ΚΙΤΡΙΝΟ'},
		{'c':'#8b4513','n':'ΚΑΦΕ'},
		{'c':'#008000','n':'ΠΡΑΣΙΝΟ'},
	], (x) => {
		rafiDOM.
		append($('<div>').
		data('xroma', x.n).
		attr('title', x.n).
		addClass('proklisiXromaContainer').
		append($('<div>').
		addClass('proklisiXroma').
		css('background-color', x.c)));
	});

	rafiDOM.
	appendTo(Proklisi.oximaPaletaDOM);

	return Proklisi;
};

Proklisi.oximaTiposSetup = () => {
	let rafiDOM = pd.paletaRafi({
		'titlos': 'Τύπος οχήματος',
	});

	rafiDOM.
	appendTo(Proklisi.oximaPaletaDOM);

	return Proklisi;
};

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

	if (oxima.noEpivatiko())
	fyi += ' <div class="proklisiOximaTiposNotice">' + oxima.tipos + '</div>';

	if (oxima.noKinisi())
	fyi += ' <div class="proklisiOximaKatastasiNotice">' + oxima.katastasi + '</div>';

	return fyi;
};

///////////////////////////////////////////////////////////////////////////////@
};
