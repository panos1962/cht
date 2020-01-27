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
// www/lib/menu.js —— JavaScript δομές και functions που αφορούν σε σελίδες
// μενού.
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-01-27
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd =
require('../../mnt/pandora/lib/pandoraClient.js');

const Menu = {};

Menu.param = {
	'menuShrinkDuration': 300,
};

///////////////////////////////////////////////////////////////////////////////@

Menu.menu = function(opts) {
	pd.initObject(this, opts);
};

Menu.menuDOM = function() {
	let menuDOM = $('<div>').
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

	Proklisi.menuDOM.
	appendTo(pd.ofelimoDOM);

	Proklisi.menuDOM.
	data('height', Proklisi.menuDOM.height());

	return Proklisi;
};

Proklisi.menuActivate = () => {
	pd.bodyDOM.
	on('mouseenter', '.proklisiMenuTab', function(e) {
		e.stopPropagation();

		if (!$(this).data('exec'))
		return;

		$('.proklisiMenuTab').addClass('proklisiMenuTabAtono');
		$(this).addClass('proklisiMenuTabCandi');
	}).
	on('mouseleave', '.proklisiMenuTab', function(e) {
		e.stopPropagation();
		$('.proklisiMenuTabAtono').removeClass('proklisiMenuTabAtono');
		$(this).removeClass('proklisiMenuTabCandi');
	}).
	on('click', '.proklisiMenuTab', function(e) {
		e.stopPropagation();

		let exec = $(this).data('exec');

		if (exec)
		exec();
	});

	pd.
	paletaSetup().
	bodyDOM.
	on('click', '.proklisiMenuBar', function(e) {
		e.stopPropagation();
		Proklisi.menuRise();
	});
};

Proklisi.menuBarDOM = () => {
	let menuBarDOM = $('<div>').
	addClass('proklisiMenuBar').
	text('Αρχικό Μενού Επιλογών');

	return menuBarDOM;
};

Proklisi.menuRise = () => {
	$('.proklisiEnotitaActive').
	not('.prosklisiMenu').
	finish().
	animate({
		'height': 0,
		'opacity': 0,
	}, Proklisi.param.menuShrinkDuration, function() {
		$(this).removeClass('proklisiEnotitaActive');
	});

	Proklisi.menuDOM.
	finish().
	css('height', '0px').
	addClass('proklisiEnotitaActive').
	animate({
		'height': Proklisi.menuDOM.data('height') + 'px',
		'opacity': 1,
	}, Proklisi.param.menuShrinkDuration);
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
	append('ΣΤΟΙΧΕΙΑ ΒΕΒΑΙΩΣΗΣ');

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
		'submit': Proklisi.menuRise,
		'change': Proklisi.oximaGetData,
	});

	Proklisi.oximaDOM = Proklisi.enotitaDOM();

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
	append(pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': 20,
		'scribe': Proklisi.toposScribe,
		'submit': Proklisi.menuRise,
		'change': Proklisi.toposCheckData,
		'helper': true,
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

	if (match.length > zoom)
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
	Proklisi.paravidosDOM = Proklisi.enotitaDOM().
	append(pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'scribe': Proklisi.paravidosScribe,
		'submit': Proklisi.menuRise,
		'change': Proklisi.paravidosCheckData,
		'zoom': 1000,
	}));

	return Proklisi;
};

Proklisi.paravidosExec = () => {
	Proklisi.enotitaActivate(Proklisi.paravidosDOM);
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
	});

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.loadData = () => {
	Proklisi.odosLoad();
	return Proklisi;
};

Proklisi.odosLoad = () => {
	let next = Proklisi.paravidosLoad;

	$.post({
		'url': '../lib/odos_list.php',
		'success': (rsp) => {
			Proklisi.odosList = rsp.split(/[\n\r]+/);
			Proklisi.odosList.pop();
			next();
		},
		'error': (err) => {
			console.error(err);
			next();
		},
	});

	return Proklisi;
};

Proklisi.paravidosLoad = () => {
	let next = Proklisi.astinomosLoad;

	$.post({
		'url': '../lib/paravidos_list.php',
		'success': (rsp) => {
			Proklisi.paravidosList = rsp.split(/[\n\r]+/);
			Proklisi.paravidosList.pop();
			pd.arrayWalk(Proklisi.paravidosList, (x, i) =>
				Proklisi.paravidosList[i] = Dimas.paravidos.
					fromParavidosList(x));
			next();
		},
		'error': (err) => {
			console.error(err);
			next();
		},
	});

	return Proklisi;
};

Proklisi.astinomosLoad = () => {
	let next = Proklisi.menuActivate;

	$.post({
		'url': '../lib/astinomos_list.php',
		'success': (rsp) => {
			Proklisi.astinomosList = rsp.split(/[\n\r]+/);
			next();
		},
		'error': (err) => {
			console.error(err);
			next();
		},
	});

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@
