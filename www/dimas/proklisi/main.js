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
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα οδηγεί τη σελίδα καταχώρησης προ-κλήσεων. Πρό-κληση
// ονομάζεται μια κλήση σε πρώιμο στάδιο, πράγμα που σημαίνει βεβαίωση
// παράβασης ΚΟΚ από τη στιγμή που συντάσσεται από τον δημοτικό αστυνομικό
// μέχρι να περαστεί στο ΟΠΣΟΥ.
//
// Το πρόγραμμα είναι προσανατολισμένο σε PDA (Personal Digital Assistant)
// με Android και touch screen, αλλά μπορεί να χρησιμοποιηθεί σε οποιονδήποτε
// υπολογιστή διαθέτει browser με σύνδεση στο intranet του Δήμου Θεσσαλονίκης.
// Οι δημοτικοί αστυνομικοί του ΔΘ φέρουν ούτως ή άλλως PDAs από την έναρξη
// εφαρμογής του συστήματος THESi που ανέπτυξε η εταιρεία ParkPal το 2018.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-02-10
// Updated: 2020-02-07
// Updated: 2020-02-05
// Updated: 2020-02-03
// Updated: 2020-01-30
// Updated: 2020-01-27
// Updated: 2020-01-26
// Updated: 2020-01-25
// Updated: 2020-01-24
// Updated: 2020-01-23
// Created: 2020-01-22
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd =
require('../../../mnt/pandora/lib/pandoraClient.js');
require('../../../mnt/pandora/www/lib/pandoraPaleta.js')(pd);
require('../../../mnt/pandora/www/lib/pandoraJQueryUI.js')(pd);

const gh = require('../../../lib/govHUB/apiCore.js');
const Dimas = require('../../../lib/dimasClient.js');

const Proklisi = {};

Proklisi.param = {
	'govHUBServerHost': 'http://' + php.serverGet('HTTP_HOST'),
	'govHUBServerPort': 8001,
	'dimas': {
		'ota': 'ΔΗΜΟΣ ΘΕΣΣΑΛΟΝΙΚΗΣ',
		'ipiresia': 'ΔΙΕΥΘΥΝΣΗ ΔΗΜΟΤΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ',
		'contact': 'Βασ. Γεωργίου 1, ΤΚ 54640, Τηλ. 231331-7930',
	},
};

Proklisi.param.govHUBServerUrl = Proklisi.param.govHUBServerHost +
	':' + Proklisi.param.govHUBServerPort;

require('./menu.js')(Proklisi);
require('./isodos.js')(Proklisi);
require('./kirosi.js')(Proklisi);
require('./klisi.js')(Proklisi);

///////////////////////////////////////////////////////////////////////////////@

pd.domInit(() => {
	pd.
	domSetup().
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domFixup().
	noop();

	Proklisi.
	toolbarSetup().
	ribbonSetup()
	[pd.isXristis() ? 'eponimiXrisi' : 'anonimiXrisi']();
});

Proklisi.eponimiXrisi = () => {
	Proklisi.
	cleanup().
	toolbarXristisRefresh().
	menuKlisiSetup().
	bebeosiSetup().
	oximaSetup().
	ipoxreosSetup().
	toposSetup().
	paravidosSetup().
	kirosiSetup().
	episkopisiSetup().
	exodosSetup().
	odosLoad([
		Proklisi.paravidosLoad,
		Proklisi.astinomikosLoad,
		() => Proklisi.activate(Proklisi.menuKlisiDOM),
	]);

	pd.keepAlive('../../mnt/pandora');
	return Proklisi;
};

Proklisi.anonimiXrisi = () => {
	pd.keepAlive(false);

	Proklisi.
	cleanup().
	toolbarXristisRefresh().
	menuIsodosSetup().
	isodosAstinomikosSetup().
	isodosPasswordSetup().
	astinomikosLoad([
		() => Proklisi.activate(Proklisi.menuIsodosDOM),
	]);

	return Proklisi;
};

Proklisi.toolbarSetup = () => {
	pd.toolbarCenterDOM.
	addClass('proklisiToolbarTitlos');

	pd.toolbarLeftDOM.
	empty().
	append($('<div>').
	attr('id', 'proklisiToggleFullscreen').
	text('Toggle fullscreen').
	on('click', () => Proklisi.toggleFullscreen()));

	pd.toolbarRightDOM.
	append($('<div>').addClass('chtToolbarXristis'));

	return Proklisi;
};

// Η παράμετρος "xristis" περιέχει τον χρήστη που λειτουργεί του πρόγραμμα.
// Ο χρήστης μπορεί να είναι δημοτικός αστυνομικός, τρίτος υπάλληλος του
// δήμου, ή γενικά χρήστης της εφαρμογής· αυτό καθορίζεται από τον τρόπο
// εισόδου του χρήστη στο πρόγραμμα (επώνυμη χρήση).

Proklisi.xristis = undefined;

Proklisi.xristisIsAstinomikos = () => {
	try {
		return (Proklisi.xristis instanceof Dimas.ipalilos);
	}

	catch (e) {
		return false;
	}
};

Proklisi.xristisNoAstinomikos = () => !Proklisi.xristisIsAstinomikos();

Proklisi.xristisIsIpalilos = () => {
	try {
		return (Proklisi.xristis instanceof Prosop.ipalilos);
	}

	catch (e) {
		return false;
	}
};

Proklisi.xristisNoIpalilos = () => !Proklisi.xristisIsIpalilos();

Proklisi.xristisIsXristis = () => {
	try {
		return (Proklisi.xristis instanceof Pandora.xristis);
	}

	catch (e) {
		return false;
	}
};

Proklisi.xristisNoXristis = () => !Proklisi.xristisIsXristis();

Proklisi.toolbarXristisRefresh = () => {
	let dom = pd.toolbarRightDOM.children('.chtToolbarXristis');

	if (!dom.length)
	return Proklisi;

	dom.empty();
	Proklisi.xristis = undefined;

	Proklisi.xristisGet((x) => {
		if (!x)
		return;

		Proklisi.xristis = x;
		switch (x.idos) {
		case 'dimas':
			Proklisi.xristis = new Dimas.ipalilos(x);
			Proklisi.xristis.toolbarXristisRefresh(dom);
			break;
		}
	});

	return Proklisi;
};

Proklisi.xristisGet = (callback) => {
	$.post({
		'url': '../../lib/xristis_get.php',
		'dataType': 'json',
		'success': (rsp) => {
			if (callback)
			callback(rsp);
		},
		'error': (err) => {
			console.error(err);

			if (callback)
			callback();
		},
	});

	return Proklisi;
};

Proklisi.ribbonSetup = () => {
	pd.ribbonRightDOM.
	append($('<div>').
	addClass('proklisiRibbonCopyright').
	html('<a href="copyright.php" target="copyright">' +
		'&copy; Δήμος Θεσσαλονίκης 2019 - ' +
		pd.dateTime(undefined, '%Y') + '</a>'));

	return Proklisi;
};

Proklisi.fullscreen = false;

Proklisi.toggleFullscreen = () => {
	if (Proklisi.fullscreen)
	pd.exitFullscreen();

	else
	pd.enterFullscreen();

	Proklisi.fullscreen = !Proklisi.fullscreen;
	return Proklisi;
};

Proklisi.cleanup = () => {
	pd.ofelimoDOM.empty();
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.menuKlisiSetup = () => {
	Proklisi.menuKlisiDOM = $('<div>').
	data('titlos', 'Βεβαιώσεις παραβάσεων ΚΟΚ').
	addClass('proklisiEnotita').
	addClass('proklisiMenu').

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.bebeosiTabDOM = $('<div>').
	data('exec', Proklisi.bebeosiExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Στοιχεία Βεβαίωσης'))).

	append(Proklisi.oximaTabDOM = $('<div>').
	data('exec', Proklisi.oximaExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Στοιχεία Οχήματος'))).

	append(Proklisi.ipoxreosTabDOM = $('<div>').
	data('exec', Proklisi.ipoxreosExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Στοιχεία Υπόχρεου')))).

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.toposTabDOM = $('<div>').
	data('exec', Proklisi.toposExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Τοποθεσία Παράβασης'))).

	append(Proklisi.paravidosTabDOM = $('<div>').
	data('exec', Proklisi.paravidosExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Είδος Παράβασης'))).

	append(Proklisi.kirosiTabDOM = $('<div>').
	data('exec', Proklisi.kirosiExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Κυρώσεις &amp; Πρόστιμα')))).

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.exodosTabDOM = $('<div>').
	data('exec', Proklisi.exodosExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Έξοδος'))).

	append(Proklisi.istorikoTabDOM = $('<div>').
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Ιστορικό'))).

	append(Proklisi.episkopisiTabDOM = $('<div>').
	data('exec', Proklisi.episkopisiExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Επισκόπηση'))));

	Proklisi.
	menuTabStatus(Proklisi.istorikoTabDOM, 'inactive');

	Proklisi.menuKlisiDOM.
	appendTo(pd.ofelimoDOM);

	Proklisi.menuKlisiDOM.
	data('height', Proklisi.menuKlisiDOM.height());

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.bebeosiSetup = () => {
	Proklisi.bebeosiDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Στοιχεία βεβαίωσης');

	return Proklisi;
};

Proklisi.bebeosiExec = () => {
	let bebeosiDOM = Proklisi.bebeosiTabDOM;


	$.post({
		'url': 'bebeosi.php',
		'dataType': 'text',
		'success': (rsp) => {
			let bebnum = parseInt(rsp);

			if (bebnum != rsp)
			return pd.fyiError('Λανθασμένος αρ. βεβαίωσης');

			let date = new Date();

			bebeosiDOM.data('bebeosiData', {
				'bebnum': bebnum,
				'date': date,
			});
			Proklisi.menuTabFyi(bebeosiDOM,
				'<b>' + bebnum + '</b><br>' +
				pd.dateTime(date, '%D/%M/%Y, %h:%m'));
				Proklisi.menuTabStatus(bebeosiDOM, 'success');
		},
		'error': (err) => {
			pd.fyiError('ERROR');
			Proklisi.menuTabStatus(bebeosiDOM, 'error');
			console.error(err);
		},
	});

	return Proklisi;
};

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

	Proklisi.oximaDOM.
	append(Proklisi.oximaPaletaDOM);

	return Proklisi;
};

Proklisi.oximaExec = () => {
	Proklisi.enotitaActivate(Proklisi.oximaDOM);
	return Proklisi;
};

Proklisi.oximaGetData = (paletaDOM) => {
	let oximaDOM = Proklisi.oximaTabDOM;
	let oxima = paletaDOM.data('text');

	Proklisi.
	menuTabStatus(oximaDOM.
	removeData('oximaData').
	removeData('oximaError')).
	menuTabFyi(oximaDOM);

	if (!oxima)
	return Proklisi;

	Proklisi.
	menuTabStatus(oximaDOM, 'busy').
	menuTabFyi(oximaDOM, oxima);

	$.post({
		'url': Proklisi.param.govHUBServerUrl,
		'dataType': 'json',
		'data': {
			'idos': 'oxima',
			'key': oxima,
		},
		'success': (rsp) => {
			if (rsp.hasOwnProperty('error'))
			return Proklisi.menuTabStatus(oximaDOM.
			data('oximaError', rsp.error), 'error').
			menuTabFyiError(oximaDOM, '<div>&#x2753;</div>' + oxima);

			let oxima = new gh.oxima(rsp.data).fixChildren();
			Proklisi.menuTabStatus(oximaDOM.
			data('oximaData', oxima), 'success').
			menuTabFyi(oximaDOM, Proklisi.oximaFyi(rsp.data));

			if (Dimas.paravidos.oximaTiposList.
				hasOwnProperty(rsp.data.tipos)) {
				Proklisi.menuTabStatus(Proklisi.oximaTiposTabDOM.
				data('oximaTiposData', rsp.data.tipos), 'success');
				Proklisi.menuTabFyi(Proklisi.oximaTiposTabDOM,
				rsp.data.tipos);
			}

			else {
				Proklisi.menuTabStatus(Proklisi.oximaTiposTabDOM.
				removeData('oximaTiposData'), 'clear');
				Proklisi.menuTabFyi(Proklisi.oximaTiposTabDOM);
			}

			let oximaTiposPaletaDOM = Proklisi.oximaTiposDOM.
			find('.pandoraPaleta').first();

			Proklisi.paravidosCheckData();
		},
		'error': (err) => {
			Proklisi.menuTabStatus(oximaDOM.
			data('oximaError',
			'Αποτυχημένη ανάκτηση στοιχείων οχήματος'), 'error').
			menuTabFyiError(oximaDOM, oxima);
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

	switch (oxima.tipos) {
	case 'ΕΠΙΒΑΤΙΚΟ':
		break;
	default:
		fyi += ' <div class="proklisiOximaTiposNotice">' +
		oxima.tipos + '</div>';
	}

	switch (oxima.katastasi) {
	case 'ΚΙΝΗΣΗ':
		break;
	default:
		fyi += ' <div class="proklisiOximaKatastasiNotice">' +
		oxima.katastasi + '</div>';
	}

	return fyi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.ipoxreosSetup = () => {
	Proklisi.ipoxreosPaletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['digit'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Proklisi.enotitaRise(Proklisi.menuKlisiDOM),
		'change': Proklisi.ipoxreosGetData,
	});

	Proklisi.ipoxreosDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Στοιχεία υπόχρεου').
	data('fyi', 'Πληκτρολογήστε το ΑΦΜ του υπόχρεου');

	Proklisi.ipoxreosDOM.
	append(Proklisi.ipoxreosPaletaDOM);

	return Proklisi;
};

Proklisi.ipoxreosExec = () => {
	Proklisi.enotitaActivate(Proklisi.ipoxreosDOM);
	return Proklisi;
};

Proklisi.ipoxreosGetData = (paletaDOM) => {
	let ipoxreosDOM = Proklisi.ipoxreosTabDOM;
	let afm = paletaDOM.data('text');

	Proklisi.
	menuTabStatus(ipoxreosDOM.
	removeData('ipoxreosData').
	removeData('ipoxreosError')).
	menuTabFyi(ipoxreosDOM);

	if (!afm)
	return Proklisi;

	Proklisi.
	menuTabStatus(ipoxreosDOM, 'busy').
	menuTabFyi(ipoxreosDOM, afm);

	$.post({
		'url': Proklisi.param.govHUBServerUrl,
		'dataType': 'json',
		'data': {
			'idos': 'prosopo',
			'key': afm,
		},
		'success': (rsp) => {
			if (rsp.hasOwnProperty('error'))
			return Proklisi.menuTabStatus(ipoxreosDOM.
			data('ipoxreosError', rsp.error), 'error').
			menuTabFyiError(ipoxreosDOM, '<div>&#x2753;</div>' + afm);

			let prosopo = new gh.prosopo(rsp.data);
			Proklisi.menuTabStatus(ipoxreosDOM.
			data('ipoxreosData', prosopo), 'success').
			menuTabFyi(ipoxreosDOM, Proklisi.ipoxreosFyi(rsp.data));
		},
		'error': (err) => {
			Proklisi.menuTabStatus(ipoxreosDOM.
			data('ipoxreosError',
			'Αποτυχημένη ανάκτηση στοιχείων υπόχρεου'), 'error').
			menuTabFyiError(ipoxreosDOM, afm);
		},
	});

	return Proklisi;
};

Proklisi.ipoxreosFyi = (ipoxreos) => {
	let fyi = '';

	fyi += '<div>ΑΦΜ&nbsp;<b>' + ipoxreos.afm + '</b></div>';

	if (ipoxreos.eteria)
	fyi += '<div>' + ipoxreos.eteria + '</div>';

	else if (ipoxreos.eponimia)
	fyi += '<div>' + ipoxreos.eponimia + '</div>';

	else {
		let s = '';

		if (ipoxreos.eponimo)
		s += ' ' + ipoxreos.eponimo;

		if (ipoxreos.onoma)
		s += ' ' + ipoxreos.onoma;

		if (ipoxreos.patronimo)
		s += ' (' + ipoxreos.patronimo.substr(0, 3) + ')';

		s = s.trim();

		if (s)
		fyi += '<div>' + s.trim() + '</div>';
	}

	if (ipoxreos.dief)
	fyi += '<div>' + ipoxreos.dief + '</div>';

	if (ipoxreos.perioxi)
	fyi += '<div>' + ipoxreos.perioxi + '</div>';

	return fyi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.toposSetup = () => {
	Proklisi.toposDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Τόπος παράβασης').
	data('fyi', 'Πληκτρολογήστε το όνομα της οδού').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': true,
		'scribe': Proklisi.toposScribe,
		'submit': () => Proklisi.enotitaRise(Proklisi.menuKlisiDOM),
		'change': Proklisi.toposCheckData,
		'helper': 'Πληκτρολογήστε τον αριθμό',
	}));

	return Proklisi;
};

Proklisi.toposExec = () => {
	Proklisi.enotitaActivate(Proklisi.toposDOM);
	return Proklisi;
};

Proklisi.toposScribe = (paletaDOM) => {
	let inputDOM = paletaDOM.children('.pandoraPaletaInput');
	let text = inputDOM.val();
	let list = text.split('');
	let zoomDOM = paletaDOM.children('.pandoraPaletaZoom');

	zoomDOM.empty();

	if (!list.length)
	return pd;

	let re = '';

	if (paletaDOM.data('zoomMode') === 'ZOOMSTRICT')
	re = text;

	else {
		if (paletaDOM.data('zoomMode') === 'ZOOMMEDIUM')
		re += '^';

		re += list.shift();
		pd.arrayWalk(list, (c) => re += '.*' + c);
	}

	let match = [];

	// Υπάρχει περίπτωση ο χρήστης να πληκτρολογήσει
	// διάφορα σύμβολα που δεν θα βγάζουν νόημα ως
	// regular expression.

	try {
		re = new RegExp(re, 'i');

		pd.arrayWalk(Proklisi.odosList, (x) => {
			if (x.match(re)) 
			match.push(x);
		});
	}

	catch (e) {
		console.error(e);
		return pd;
	}

	paletaDOM.data('match', match);
	paletaDOM.removeData('matchPointer');

	if (!match.length)
	return pd;

	zoomDOM = paletaDOM.children('.pandoraPaletaZoom');
	pd.arrayWalk(match, (x) => {
		$('<div>').
		addClass('pandoraPaletaZoomGrami').
		text(x).
		appendTo(zoomDOM);
	});

	return pd;
};

Proklisi.toposCheckData = (paletaDOM) => {
	let toposDOM = Proklisi.toposTabDOM;
	let topos = paletaDOM.data('text');

	if (topos)
	Proklisi.menuTabStatus(toposDOM.
	data('toposData', topos), 'success');

	else
	Proklisi.menuTabStatus(toposDOM.
	removeData('toposData'), 'clear');

	Proklisi.menuTabFyi(toposDOM, topos);
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.paravidosSetup = () => {
	Proklisi.paravidosDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Είδος παράβασης').
	data('fyi', 'Πληκτρολογήστε τη διάταξη ή την περιγραφή της παράβασης').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'scribe': Proklisi.paravidosScribe,
		'submit': () => Proklisi.enotitaRise(Proklisi.menuKlisiDOM),
		'change': Proklisi.paravidosCheckData,
		'zoom': true,
		'text': 'Α',
	}));

	return Proklisi;
};

Proklisi.paravidosExec = () => {
	Proklisi.enotitaActivate(Proklisi.paravidosDOM);
	Proklisi.paravidosScribe(Proklisi.paravidosDOM.
	find('.pandoraPaleta').first());
	return Proklisi;
};

Proklisi.paravidosScribe = (paletaDOM) => {
	let inputDOM = paletaDOM.children('.pandoraPaletaInput');
	let text = inputDOM.val();
	let list = text.split('');
	let zoomDOM = paletaDOM.children('.pandoraPaletaZoom');

	zoomDOM.empty();

	if (!list.length)
	return pd;

	let re = '';

	if (paletaDOM.data('zoomMode') === 'ZOOMSTRICT')
	re = text;

	else {
		if (paletaDOM.data('zoomMode') === 'ZOOMMEDIUM')
		re += '^';

		re += list.shift();
		pd.arrayWalk(list, (c) => re += '.*' + c);
	}

	let match = [];

	// Υπάρχει περίπτωση ο χρήστης να πληκτρολογήσει
	// διάφορα σύμβολα που δεν θα βγάζουν νόημα ως
	// regular expression.

	try {
		re = new RegExp(re, 'i');

		pd.arrayWalk(Proklisi.paravidosList, (x) => {
			let s = x.kodikos + x.perigrafi;

			if (s.match(re)) 
			return match.push(x);
		});
	}

	catch (e) {
		console.error(e);
		return pd;
	}

	paletaDOM.data('match', match);
	paletaDOM.removeData('matchPointer');

	if (!match.length)
	return pd;

	zoomDOM = paletaDOM.children('.pandoraPaletaZoom');
	pd.arrayWalk(match, (x) => {
		$('<div>').
		addClass('pandoraPaletaZoomGrami').
		data('value', x).
		text(x.diataxiGet() + ' ' + x.perigrafi).
		appendTo(zoomDOM);
	});

	return pd;
};

Proklisi.paravidosCheckData = (paletaDOM) => {
	if (paletaDOM === undefined)
	paletaDOM = Proklisi.paravidosDOM.
	find('.pandoraPaleta').first();

	let paravidosDOM = Proklisi.paravidosTabDOM;
	let paravidos = paletaDOM.data('value');
console.log(paravidos);

	if (paravidos) {
		let oxima = Proklisi.oximaTabDOM.data('oximaData');
		let tipos = Proklisi.oximaTiposTabDOM.data('oximaTiposData');

		if (!tipos)
		tipos = (oxima ? oxima.tipos : undefined);

		Proklisi.menuTabStatus(paravidosDOM.
		data('paravidosData', paravidos), 'success');
		Proklisi.menuTabFyi(paravidosDOM, paravidos.diataxiGet());

		pd.arrayWalk([
			'pinakides',
			'adia',
			'diploma',
			'prostimo',
		], (x) => {
			let val = paravidos.kirosiGet(x, tipos);
			let kirosiDOM = Proklisi[x + 'DOM'];
			let paletaDOM = kirosiDOM.
			children('.pandoraPaleta');

			if (val)
			paletaDOM.
			data('text', val).
			data('value', val);

			else
			paletaDOM.removeData('text');

			Proklisi[x + 'CheckData'](paletaDOM);
		});

		Proklisi.kirosiFyiRefresh();
		return Proklisi;
	}

	Proklisi.menuTabStatus(paravidosDOM.
	removeData('paravidosData'), 'clear');
	Proklisi.menuTabFyi(paravidosDOM);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.episkopisiSetup = () => {
	Proklisi.episkopisiDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Επισκόπηση κλήσης');

	Proklisi.episkopisiKlisiDOM = $('<div>').
	appendTo(Proklisi.episkopisiDOM);

	return Proklisi;
};

Proklisi.episkopisiExec = () => {
	let proklisi = new Proklisi.klisi();

	Proklisi.episkopisiKlisiDOM.
	empty().
	append(proklisi.klisiDOM());

proklisi.errors = [];
	if (proklisi.noError())
	Proklisi.episkopisiKlisiDOM.
	append(proklisi.ipovoliDOM());

	Proklisi.enotitaActivate(Proklisi.episkopisiDOM);
	return Proklisi;
};

Proklisi.neaProklisi = () => {
	pd.arrayWalk([
		'bebeosi',
		'oxima',
		'ipoxreos',
		'paravidos',
		'oximaTipos',
		'pinakides',
		'adia',
		'diploma',
		'prostimo',
	], (x) => {
		let tabDOM = Proklisi[x + 'TabDOM'];

console.log(tabDOM.find('.pandoraPaletaInput').length);
console.log(tabDOM.find('.pandoraPaletaMonitor').length);

		tabDOM.
		find('.pandoraPaletaInput').
		data('prev', '').
		val('');

		tabDOM.
		find('.pandoraPaletaMonitor').
		text('');

		tabDOM.removeData(x + 'Data');
	});

	Proklisi.enotitaRise(Proklisi.menuKlisiDOM);
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.exodosSetup = () => {
	Proklisi.exodosDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Έξοδος');

	Proklisi.exodosKlisiDOM = $('<div>').
	appendTo(Proklisi.exodosDOM);

	Proklisi.exodosKlisiDOM.
	append(Proklisi.exodosTabDOM = $('<div>').
	data('exec', Proklisi.exodosConfirmExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Επιβεβαίωση Εξόδου')));

	return Proklisi;
};

Proklisi.exodosExec = () => {
	Proklisi.enotitaActivate(Proklisi.exodosDOM);
	return Proklisi;
};

Proklisi.exodosConfirmExec = () => {
	$.post({
		'url': '../../lib/exodos.php',
		'success': () => Proklisi.anonimiXrisi(),
		'error': (err) => {
			console.error(err);
			pd.fyiError('Αποτυχία εξόδου');
		},
	});

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.odosLoad = (chain) => {
	let next = chain.shift();

	if (Proklisi.hasOwnProperty('odosList'))
	return next(chain);

	$.post({
		'url': '../lib/odos_list.php',
		'success': (rsp) => {
			Proklisi.odosList = rsp.split(/[\n\r]+/);
			Proklisi.odosList.pop();
			next(chain);
		},
		'error': (err) => {
			console.error(err);
			next(chain);
		},
	});

	return Proklisi;
};

Proklisi.paravidosLoad = (chain) => {
	let next = chain.shift();

	if (Proklisi.hasOwnProperty('paravidosList'))
	return next(chain);

	$.post({
		'url': '../lib/paravidos_list.php',
		'success': (rsp) => {
			Proklisi.paravidosList = rsp.split(/[\n\r]+/);
			Proklisi.paravidosList.pop();
			pd.arrayWalk(Proklisi.paravidosList, (x, i) =>
				Proklisi.paravidosList[i] = Dimas.paravidos.
					fromParavidosList(x));
			next(chain);
		},
		'error': (err) => {
			console.error(err);
			next(chain);
		},
	});

	return Proklisi;
};

Proklisi.astinomikosLoad = (chain) => {
	let next = chain.shift();

	if (Proklisi.hasOwnProperty('astinomikosList'))
	return next(chain);

	$.post({
		'url': '../lib/astinomikos_list.php',
		'success': (rsp) => {
			Proklisi.astinomikosList = rsp.split(/[\n\r]+/);
			Proklisi.astinomikosList.pop();
			pd.arrayWalk(Proklisi.astinomikosList, (x, i) =>
				Proklisi.astinomikosList[i] = Dimas.ipalilos.
					fromAstinomikosList(x));
			next(chain);
		},
		'error': (err) => {
			console.error(err);
			next(chain);
		},
	});

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@
