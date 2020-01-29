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

	Proklisi[Proklisi.isLogin() ? 'eponimiXrisi' : 'anonimiXrisi']();
});

Proklisi.isLogin = () => {
	console.log(php);
	return php._SESSION.hasOwnProperty('xristis');
};

Proklisi.eponimiXrisi = () => {
	Proklisi.
	menuKlisiSetup().
	bebeosiSetup().
	oximaSetup().
	toposSetup().
	paravidosSetup().
	episkopisiSetup().
	odosLoad([
		Proklisi.paravidosLoad,
		Proklisi.astinomikosLoad,
		() => Proklisi.menuActivate(Proklisi.menuKlisiDOM),
	]);

	return Proklisi;
};

Proklisi.anonimiXrisi = () => {
	Proklisi.
	menuIsodosSetup().
	isodosAstinomikosSetup().
	astinomikosLoad([
		() => Proklisi.menuActivate(Proklisi.menuIsodosDOM),
	]);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.menuKlisiSetup = () => {
	Proklisi.menuKlisiDOM = $('<div>').
	addClass('proklisiMenu').
	addClass('proklisiEnotita').
	addClass('proklisiEnotitaActive').
	css('height', 'auto').

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.basicTabDOM = $('<div>').
	data('exec', Proklisi.bebeosiExec).
	addClass('proklisiMenuTab').
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

	append(Proklisi.infoTabDOM = $('<div>').
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Παρατηρήσεις'))).

	append(Proklisi.episkopisiTabDOM = $('<div>').
	data('exec', Proklisi.episkopisiExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Επισκόπηση'))));

	Proklisi.menuKlisiDOM.
	appendTo(pd.ofelimoDOM);

	Proklisi.menuKlisiDOM.
	data('height', Proklisi.menuKlisiDOM.height());

	return Proklisi;
};

Proklisi.menuBarDOM = () => {
	let menuBarDOM = $('<div>').
	addClass('proklisiMenuBar').
	text('Αρχικό Μενού Επιλογών');

	return menuBarDOM;
};

Proklisi.menuTabStatus = (menuTabDOM, status) => {
	menuTabDOM.
	removeClass('proklisiMenuTabBusy').
	removeClass('proklisiMenuTabSuccess').
	removeClass('proklisiMenuTabError').
	children('.proklisiMenuTabStatusIcon').
	remove();

	switch (status) {
	case 'busy':
		menuTabDOM.
		addClass('proklisiMenuTabBusy').
		append($('<img>').
		addClass('proklisiMenuTabStatusIcon').
		attr('src', '../../images/busy.gif'));
		break;
	case 'success':
		menuTabDOM.
		addClass('proklisiMenuTabSuccess').
		append($('<img>').
		addClass('proklisiMenuTabStatusIcon').
		attr('src', '../../images/success.png'));
		break;
	case 'error':
		menuTabDOM.
		addClass('proklisiMenuTabError').
		append($('<img>').
		addClass('proklisiMenuTabStatusIcon').
		attr('src', '../../images/error.png'));
		break;
	}

	return Proklisi;
};

Proklisi.menuTabFyi = (menuTabDOM, msg) => {
	let labelDOM = menuTabDOM.children('.proklisiMenuTabLabel');
	let fyiDOM = menuTabDOM.children('.proklisiMenuTabFyi');

	labelDOM.css('display', 'none');
	fyiDOM.css('display', 'none').
	removeClass('proklisiMenuTabFyiError');

	if (!msg) {
		fyiDOM.empty();
		labelDOM.css('display', 'block');
		return Proklisi;
	}

	fyiDOM.css('display', 'block').text(msg);
	return Proklisi;
};

Proklisi.menuTabFyiError = (menuTabDOM, msg) => {
	Proklisi.menuTabFyi(menuTabDOM, msg);
	menuTabDOM.children('.proklisiMenuTabFyi').
	addClass('proklisiMenuTabFyiError');
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.bebeosiSetup = () => {
	Proklisi.bebeosiDOM = Proklisi.enotitaDOM().
	append($('<div>').text('Εδώ διαχειριζόμαστε τα στοιχεία βεβαίωσης, ' +
		'τουτέστιν τον αριθμό κλήσης, την ημερομηνία και την ώρα ' +
		'βεβαίωσης, τα στοιχεία του δημοτικού αστυνομικού κλπ.'));

	return Proklisi;
};

Proklisi.bebeosiExec = () => {
	Proklisi.enotitaActivate(Proklisi.bebeosiDOM);
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
		'submit': () => Proklisi.menuRise(Proklisi.menuKlisiDOM),
		'change': Proklisi.oximaGetData,
	});

	Proklisi.oximaDOM = Proklisi.enotitaDOM().
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
		'type': 'POST',
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
	Proklisi.toposDOM = Proklisi.enotitaDOM().
	data('fyi', 'Πληκτρολογήστε το όνομα της οδού').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': 20,
		'scribe': Proklisi.toposScribe,
		'submit': () => Proklisi.menuRise(Proklisi.menuKlisiDOM),
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

	if (paletaDOM.data('zoomStrict'))
	re += '^';

	re += list.shift();
	pd.arrayWalk(list, (c) => {
		re += '.*' + c;
	});

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
		return pd;
	}

	if (!match.length)
	return pd;

	let zoom = paletaDOM.data('zoom');

	/*
	XXX
	Αρχικά υπήρχε ο σχεδιασμός να περιορίζεται το output σε κάποιο
	συγκεκριμένο πλήθος εγγραφών, αλλά μάλλον κάτι τέτοιο δημιουργεί
	περισσότερα προβλήματα από όσα λύνει. Αν δεν παρουσιαστούν νέες
	δυσκολίες θα απαλείψουμε τελείως την παράμετρο "zoom".

	if (match.length > zoom)
	return pd;
	*/

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
	Proklisi.paravidosDOM = Proklisi.enotitaDOM().
	data('fyi', 'Πληκτρολογήστε τη διάταξη ή την περιγραφή της παράβασης').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'scribe': Proklisi.paravidosScribe,
		'submit': () => Proklisi.menuRise(Proklisi.menuKlisiDOM),
		'change': Proklisi.paravidosCheckData,
		'zoom': 1000,
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

	if (paletaDOM.data('zoomStrict'))
	re += '^';

	re += list.shift();
	pd.arrayWalk(list, (c) => {
		re += '.*' + c;
	});

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
		return pd;
	}

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

Proklisi.episkopisiSetup = () => {
	Proklisi.episkopisiDOM = Proklisi.enotitaDOM();

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

Proklisi.enotitaDOM = () => {
	let enotitaDOM = $('<div>').
	addClass('proklisiEnotita').
	appendTo(pd.ofelimoDOM);

	enotitaDOM.
	append(Proklisi.menuBarDOM());

	return enotitaDOM;
};

Proklisi.enotitaActivate = (enotitaDOM) => {
	let active = $('.proklisiEnotitaActive');
	let h = (active.length ? $(active[0]).innerHeight() : 0);

	active.
	finish().
	animate({
		'height': '0px',
		'opacity': 0,
	}, Proklisi.param.menuShrinkDuration);

	enotitaDOM.
	finish().
	addClass('proklisiEnotitaActive').
	animate({
		'height': h + 'px',
		'opacity': 1,
	}, Proklisi.param.menuShrinkDuration, function() {
		$(this).css('height', 'auto');
		pd.fyiMessage(enotitaDOM.data('fyi'));
	});

	// Αν υπάρχει παλέτα στο επιλεγμένο menu tab την ενεργοποιούμε
	// κυρίως για να έχουμε focus στο σχετικό input field, εφόσον
	// αυτό εμφανίζεται.

	pd.paletaActivate(enotitaDOM.find('.pandoraPaleta').first());

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

	if (Proklisi.hasOwnProperty('paravidosList'))
	return next(chain);

	$.post({
		'url': '../lib/astinomikos_list.php',
		'success': (rsp) => {
			Proklisi.astinomikosList = rsp.split(/[\n\r]+/);
			Proklisi.astinomikosList.pop();
			pd.arrayWalk(Proklisi.astinomikosList, (x, i) =>
				Proklisi.astinomikosList[i] = Dimas.astinomikos.
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
