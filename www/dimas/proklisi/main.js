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

const Dimas =
require('../../../lib/dimasCore.js');

const Proklisi = {};

Proklisi.param = {
	'oximaServerHost': 'http://' + php.serverGet('HTTP_HOST'),
	'oximaServerPort': 8001,
	'dimas': {
		'ota': 'ΔΗΜΟΣ ΘΕΣΣΑΛΟΝΙΚΗΣ',
		'ipiresia': 'ΔΙΕΥΘΥΝΣΗ ΔΗΜΟΤΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ',
		'contact': 'Βασ. Γεωργίου 1, ΤΚ 54640, Τηλ. 231331-7930',
	},
};

Proklisi.param.oximaServerUrl = Proklisi.param.oximaServerHost +
	':' + Proklisi.param.oximaServerPort;

require('./menu.js')(Proklisi);
require('./isodos.js')(Proklisi);
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
	menuKlisiSetup().
	bebeosiSetup().
	oximaSetup().
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

	return Proklisi;
};

Proklisi.anonimiXrisi = () => {
	Proklisi.
	cleanup().
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

	append(Proklisi.toposTabDOM = $('<div>').
	data('exec', Proklisi.toposExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Τοποθεσία Παράβασης')))).

	append($('<div>').addClass('proklisiMenuLine').

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
	html('Κυρώσεις &amp; Πρόστιμα'))).

	append(Proklisi.infoTabDOM = $('<div>').
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Παρατηρήσεις')))).

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
	menuTabStatus(Proklisi.infoTabDOM, 'inactive').
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
		'url': Proklisi.param.oximaServerUrl,
		'dataType': 'json',
		'data': {
			'idos': 'oxima',
			'key': oxima,
		},
		'success': (rsp) => {
			if (rsp.hasOwnProperty('error'))
			return Proklisi.menuTabStatus(oximaDOM.
			data('oximaError', rsp.error), 'error').
			menuTabFyiError(oximaDOM, oxima);

			Proklisi.
			menuTabStatus(oximaDOM.
			data('oximaData', rsp.data), 'success').
			menuTabFyi(oximaDOM,
			rsp.data.pinakida + ' ' +
			rsp.data.marka + ' ' +
			rsp.data.xroma);
		},
		'error': (err) => {
			Proklisi.menuTabStatus(oximaDOM.
			data('oximaError', 'ERROR'), 'error').
			menuTabFyiError(oximaDOM, oxima);
		},
	});

	return Proklisi;
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
		pd.arrayWalk(list, (c) => {
			re += '.*' + c;
		});
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
	removeData('toposData'),  'clear');

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
		pd.arrayWalk(list, (c) => {
			re += '.*' + c;
		});
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
	let paravidosDOM = Proklisi.paravidosTabDOM;
	let paravidos = paletaDOM.data('value');

	if (paravidos) {
		Proklisi.menuTabStatus(paravidosDOM.
		data('paravidosData', paravidos), 'success');
		Proklisi.menuTabFyi(paravidosDOM, paravidos.diataxiGet());
		return Proklisi;
	}

	Proklisi.menuTabStatus(paravidosDOM.
	removeData('paravidosData'),  'clear');
	Proklisi.menuTabFyi(paravidosDOM);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.kirosiSetup = () => {
	Proklisi.kirosiDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Κυρώσεις & πρόστιμα').
	addClass('proklisiMenu').

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.kirosiPinakidaTabDOM = $('<div>').
	data('exec', Proklisi.kirosiPinakidaExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Αφαίρεση πινακίδων'))).

	append(Proklisi.kirosiAdiaTabDOM = $('<div>').
	data('exec', Proklisi.kirosiAdiaExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Αφαίρεση αδείας'))).

	append(Proklisi.kirosiDiplomaTabDOM = $('<div>').
	data('exec', Proklisi.kirosiDiplomaExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Αφαίρεση διπλώματος')))).

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.kirosiProstimoTabDOM = $('<div>').
	data('exec', Proklisi.kirosiProstimoExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Πρόστιμο'))));

	return Proklisi;
};

Proklisi.kirosiExec = () => {
	Proklisi.enotitaActivate(Proklisi.kirosiDOM);
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
	Proklisi.episkopisiKlisiDOM.
	empty().
	append((new Proklisi.klisi()).klisiDOM());

	Proklisi.enotitaActivate(Proklisi.episkopisiDOM);
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
