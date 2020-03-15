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
// www/dimas/main.js —— Πρόγραμμα οδήγησης σελίδας Δημοτικής Αστυνομίας
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-03-11
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd =
require('../../mnt/pandora/lib/pandoraClient.js');
require('../../mnt/pandora/www/lib/pandoraPaleta.js')(pd);
require('../../mnt/pandora/www/lib/pandoraJQueryUI.js')(pd);

const Dimas = require('../../lib/dimasClient.js');

const Dimasmenu = {};
Dimasmenu.param = {};

Dimasmenu.protocol = 'http';

if (php.serverGet('HTTPS'))
Dimasmenu.protocol += 's';

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

	Dimasmenu.
	toolbarSetup().
	ribbonSetup()
	[pd.isXristis() ? 'eponimiXrisi' : 'anonimiXrisi']();
});

Dimasmenu.eponimiXrisi = () => {
	Dimasmenu.
	cleanup().
	toolbarXristisRefresh().
	menuMenuSetup().
	exodosSetup().
	activate(Dimasmenu.menuDOM);

	pd.keepAlive('../mnt/pandora');
	return Dimasmenu;
};

Dimasmenu.anonimiXrisi = () => {
	pd.keepAlive(false);

	Dimasmenu.
	cleanup().
	toolbarXristisRefresh().
	menuIsodosSetup().
	isodosAstinomikosSetup().
	isodosPasswordSetup().
	astinomikosLoad();

	return Dimasmenu;
};

Dimasmenu.toolbarSetup = () => {
	pd.toolbarCenterDOM.
	addClass('dimasmenuToolbarTitlos');

	pd.toolbarRightDOM.
	append($('<div>').addClass('chtToolbarXristis'));

	return Dimasmenu;
};

Dimasmenu.xristis = undefined;

Dimasmenu.xristisIsAstinomikos = () => {
	try {
		return (Dimasmenu.xristis instanceof Dimas.ipalilos);
	}

	catch (e) {
		return false;
	}
};

Dimasmenu.xristisNoAstinomikos = () => !Dimasmenu.xristisIsAstinomikos();

Dimasmenu.xristisIsIpalilos = () => {
	try {
		return (Dimasmenu.xristis instanceof Prosop.ipalilos);
	}

	catch (e) {
		return false;
	}
};

Dimasmenu.xristisNoIpalilos = () => !Dimasmenu.xristisIsIpalilos();

Dimasmenu.xristisIsXristis = () => {
	try {
		return (Dimasmenu.xristis instanceof Pandora.xristis);
	}

	catch (e) {
		return false;
	}
};

Dimasmenu.xristisNoXristis = () => !Dimasmenu.xristisIsXristis();

Dimasmenu.toolbarXristisRefresh = () => {
	let dom = pd.toolbarRightDOM.children('.chtToolbarXristis');

	if (!dom.length)
	return Dimasmenu;

	dom.empty();
	Dimasmenu.xristis = undefined;

	Dimasmenu.xristisGet((x) => {
		if (!x)
		return;

		Dimasmenu.xristis = x;
		switch (x.idos) {
		case 'dimas':
			Dimasmenu.xristis = new Dimas.ipalilos(x);
			Dimasmenu.xristis.toolbarXristisRefresh(dom);
			break;
		}
	});

	return Dimasmenu;
};

Dimasmenu.xristisGet = (callback) => {
	$.post({
		'url': '../lib/xristis_get.php',
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

	return Dimasmenu;
};

Dimasmenu.ribbonSetup = () => {
	return Dimasmenu;
};

Dimasmenu.cleanup = () => {
	pd.ofelimoDOM.empty();
	return Dimasmenu;
};

Dimasmenu.fyiMessage = (msg) => {
	pd.fyiMessage(msg);
	return Dimasmenu;
};

Dimasmenu.fyiError = (msg, err) => {
	pd.fyiError(msg);

	if (err)
	console.log(err);

	return Dimasmenu;
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.menuIsodosSetup = () => {
	Dimasmenu.menuIsodosDOM = $('<div>').
	data('titlos', 'Πιστοποίηση χρήστη').
	data('fyi', 'Επιλέξτε μέθοδο πιστοποίησης').
	addClass('dimasmenuEnotita').
	addClass('dimasmenuMenu').
	addClass('dimasmenuEnotitaActive').

	append($('<div>').addClass('dimasmenuMenuLine').

	append(Dimasmenu.astinomikosTabDOM = $('<div>').
	data('exec', Dimasmenu.isodosAstinomikosExec).
	addClass('dimasmenuMenuTab').
	append($('<div>').addClass('dimasmenuMenuTabFyi')).
	append($('<div>').addClass('dimasmenuMenuTabLabel').
	html('Είσοδος με κωδικό Δ.Α.'))).

	append(Dimasmenu.ipalilosTabDOM = $('<div>').
	data('exec', Dimasmenu.isodosIpalilosExec).
	addClass('dimasmenuMenuTab').
	append($('<div>').addClass('dimasmenuMenuTabFyi')).
	append($('<div>').addClass('dimasmenuMenuTabLabel').
	html('Είσοδος Α.Μ. Υπαλλήλου'))).

	append(Dimasmenu.xristisTabDOM = $('<div>').
	data('exec', Dimasmenu.isodosXristisExec).
	addClass('dimasmenuMenuTab').
	append($('<div>').addClass('dimasmenuMenuTabFyi')).
	append($('<div>').addClass('dimasmenuMenuTabLabel').
	html('Είσοδος με όνομα χρήστη')))).

	append($('<div>').addClass('dimasmenuMenuLine').

	append(Dimasmenu.passwordTabDOM = $('<div>').
	data('exec', Dimasmenu.isodosPasswordExec).
	addClass('dimasmenuMenuTab').
	css('visibility', 'hidden').
	append($('<div>').addClass('dimasmenuMenuTabFyi')).
	append($('<div>').addClass('dimasmenuMenuTabLabel').
	html('Εισαγωγή μυστικού κωδικού'))));

	Dimasmenu.menuTabStatus(Dimasmenu.ipalilosTabDOM, 'inactive');
	Dimasmenu.menuTabStatus(Dimasmenu.xristisTabDOM, 'inactive');

	Dimasmenu.menuIsodosDOM.
	appendTo(pd.ofelimoDOM);

	Dimasmenu.menuIsodosDOM.
	data('height', Dimasmenu.menuIsodosDOM.height());

	return Dimasmenu;
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.isodosAstinomikosSetup = () => {
	Dimasmenu.isodosAstinomikosDOM = Dimasmenu.enotitaDOM(Dimasmenu.menuIsodosDOM).
	data('fyi', 'Πληκτρολογήστε κωδικό/όνομα δημοτικού αστυνομικού').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': true,
		'scribe': Dimasmenu.isodosAstinomikosScribe,
		'submit': () => Dimasmenu.enotitaRise(Dimasmenu.menuIsodosDOM),
		'change': Dimasmenu.isodosAstinomikosCheckData,
	}));

	return Dimasmenu;
};

Dimasmenu.isodosAstinomikosScribe = (paletaDOM) => {
	let inputDOM = paletaDOM.children('.pnd-paletaInput');
	let text = inputDOM.val();
	let list = pd.gramata(text);
	let zoomDOM = paletaDOM.children('.pnd-paletaZoom');

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

	re = new RegExp(re, 'i');
	let match = [];

	pd.arrayWalk(Dimasmenu.astinomikosList, (x) => {
		let s = x.kodikos + x.onomateponimo;

		if (s.match(re)) 
		return match.push(x);
	});

	paletaDOM.data('match', match);
	paletaDOM.removeData('matchPointer');

	if (!match.length)
	return pd;

	zoomDOM = paletaDOM.children('.pnd-paletaZoom');
	pd.arrayWalk(match, (x) => {
		$('<div>').
		addClass('pnd-paletaZoomGrami').
		data('value', x).
		text('[' + x.kodikos + '] ' + x.onomateponimo).
		appendTo(zoomDOM);
	});

	return pd;
};

Dimasmenu.isodosAstinomikosExec = () => {
	Dimasmenu.enotitaActivate(Dimasmenu.isodosAstinomikosDOM);
	return Dimasmenu;
};

Dimasmenu.isodosAstinomikosCheckData = (paletaDOM) => {
	let astinomikosDOM = Dimasmenu.astinomikosTabDOM;
	let astinomikos = paletaDOM.data('value');

	if (astinomikos) {
		Dimasmenu.isodosOnomataClear();
		Dimasmenu.menuTabStatus(astinomikosDOM.
		data('astinomikosData', astinomikos), 'success');
		Dimasmenu.menuTabFyi(astinomikosDOM, astinomikos.onomateponimo);

		Dimasmenu.passwordTabDOM.
		css('visibility', '').
		trigger('click');

		return Dimasmenu;
	}

	Dimasmenu.menuTabStatus(astinomikosDOM.
	removeData('astinomikosData'),  'clear');
	Dimasmenu.menuTabFyi(astinomikosDOM);
	Dimasmenu.passwordTabDOM.css('visibility', 'hidden');

	return Dimasmenu;
};

Dimasmenu.isodosIpalilosExec = () => {
};

Dimasmenu.isodosXristisExec = () => {
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.isodosPasswordSetup = () => {
	Dimasmenu.isodosPasswordDOM = Dimasmenu.enotitaDOM(Dimasmenu.menuIsodosDOM).
	data('fyi', 'Πληκτρολογήστε το password').
	append(pd.paleta({
		'tipos': 'password',
		'paleta': [
			pd.paletaList['latin'],
			pd.paletaList['symbol'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'submit': () => Dimasmenu.enotitaRise(Dimasmenu.menuIsodosDOM),
		'change': Dimasmenu.isodosPasswordCheckData,
	}));

	return Dimasmenu;
};

Dimasmenu.isodosPasswordExec = () => {
	Dimasmenu.enotitaActivate(Dimasmenu.isodosPasswordDOM);
	return Dimasmenu;
};

Dimasmenu.isodosPasswordCheckData = (paletaDOM) => {
	let xristis = Dimasmenu.isodosXristisGet();
	if (!xristis) {
		pd.fyiError('Ακαθόριστα στοιχεία χρήστη');
		return Dimasmenu;
	}

	Dimasmenu.menuIsodosDOM.removeData('errmsg');
	xristis.kodikos = paletaDOM.data('text');
	$.post({
		'url': '../lib/prosvasi.php',
		'dataType': 'json',
		'data': xristis,
		'success': (rsp) => {
			if (rsp.hasOwnProperty('error')) {
				pd.fyiError(rsp.error);
				Dimasmenu.menuIsodosDOM.data('errmsg', rsp.error);
				return;
			}

			php._SESSION[php.defs['CHT_SESSION_IPOGRAFI_XRISTI']] =
			rsp.ipografi;
			Dimasmenu.eponimiXrisi();
		},
		'error': (err) => {
			Dimasmenu.toolbarXristisRefresh();
			console.error(err);
			let msg = 'Ανεπιτυχής έλεγχος πρόσβασης';
			pd.fyiError(msg);
			Dimasmenu.menuIsodosDOM.data('errmsg', msg);
		},
	});

	return Dimasmenu;
};

Dimasmenu.isodosXristisGet = () => {
	let xristis = Dimasmenu.astinomikosTabDOM.
	data('astinomikosData');

	if (xristis)
	return {
		'idos': 'dimas',
		'login': xristis.kodikos,
	};

	return undefined;
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.isodosOnomataClear = () => {
	Dimasmenu.astinomikosTabDOM.removeData('astinomikosData');
	Dimasmenu.menuTabFyi(Dimasmenu.astinomikosTabDOM);

	Dimasmenu.ipalilosTabDOM.removeData('ipalilosData');
	Dimasmenu.menuTabFyi(Dimasmenu.ipalilosTabDOM);

	Dimasmenu.xristisTabDOM.removeData('xristisData');
	Dimasmenu.menuTabFyi(Dimasmenu.xristisTabDOM);

	return Dimasmenu;
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.menuMenuSetup = () => {
	Dimasmenu.menuDOM = $('<div>').
	data('titlos', 'Δημοτική Αστυνομία').
	addClass('dimasmenuEnotita').
	addClass('dimasmenuMenu').

	append($('<div>').addClass('dimasmenuMenuLine').

	append(Dimasmenu.proklisiTabDOM = $('<div>').
	data('exec', () => self.location = '/cht/dimas/proklisi').
	addClass('dimasmenuMenuTab').
	append($('<div>').addClass('dimasmenuMenuTabFyi')).
	append($('<div>').addClass('dimasmenuMenuTabLabel').
	html('Βεβαίωση πραβάσεων ΚΟΚ'))).

	append(Dimasmenu.blokakiTabDOM = $('<div>').
	data('exec', () => self.location = '/cht/dimas/blokaki').
	addClass('dimasmenuMenuTab').
	append($('<div>').addClass('dimasmenuMenuTabFyi')).
	append($('<div>').addClass('dimasmenuMenuTabLabel').
	html('Αλλαγή καρνέ'))).

	append($('<div>').addClass('dimasmenuMenuLine').

	append(Dimasmenu.exodosTabDOM = $('<div>').
	data('exec', Dimasmenu.exodosExec).
	addClass('dimasmenuMenuTab').
	append($('<div>').addClass('dimasmenuMenuTabFyi')).
	append($('<div>').addClass('dimasmenuMenuTabLabel').
	html('Έξοδος')))));

	Dimasmenu.menuDOM.
	appendTo(pd.ofelimoDOM);

	return Dimasmenu;
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.exodosSetup = () => {
	Dimasmenu.exodosDOM = Dimasmenu.enotitaDOM(Dimasmenu.menuDOM).
	data('titlos', 'Έξοδος');

	Dimasmenu.exodosMenuDOM = $('<div>').
	appendTo(Dimasmenu.exodosDOM);

	Dimasmenu.exodosMenuDOM.
	append(Dimasmenu.exodosTabDOM = $('<div>').
	data('exec', Dimasmenu.exodosConfirmExec).
	addClass('dimasmenuMenuTab').
	append($('<div>').addClass('dimasmenuMenuTabLabel').
	html('Επιβεβαίωση Εξόδου')));

	return Dimasmenu;
};

Dimasmenu.exodosExec = () => Dimasmenu.
menuTabStatus(Dimasmenu.exodosTabDOM, 'clear').
enotitaActivate(Dimasmenu.exodosDOM);

Dimasmenu.exodosConfirmExec = () => {
	$.post({
		'url': '../lib/exodos.php',
		'success': () => window.location = self.location,
		'error': (err) => Dimasmenu.
		fyiError('Αποτυχία εξόδου', err).
		menuTabStatus(Dimasmenu.exodosTabDOM, 'error'),
	});

	return Dimasmenu;
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.astinomikosLoad = () => {
	$.post({
		'url': 'lib/astinomikos_list.php',
		'success': (rsp) => {
			Dimasmenu.astinomikosList = rsp.split(/[\n\r]+/);
			Dimasmenu.astinomikosList.pop();
			pd.arrayWalk(Dimasmenu.astinomikosList, (x, i) =>
				Dimasmenu.astinomikosList[i] = Dimas.ipalilos.
					fromAstinomikosList(x));
			Dimasmenu.activate(Dimasmenu.menuIsodosDOM);
		},
		'error': (err) => {
			console.error(err);
			Dimasmenu.activate(Dimasmenu.menuIsodosDOM);
		},
	});

	return Dimasmenu;
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.param.menuShrinkDuration = 300;

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.menuSetupOk = false;

Dimasmenu.menuSetup = () => {
	if (Dimasmenu.menuSetupOk)
	return Dimasmenu;

	Dimasmenu.menuSetupOk = true;

	pd.ofelimoDOM.
	on('mouseenter', '.dimasmenuMenuTab', function(e) {
		e.stopPropagation();

		if (!$(this).data('exec'))
		return;

		$('.dimasmenuMenuTab').
		addClass('dimasmenuMenuTabAtono');

		$(this).
		removeClass('dimasmenuMenuTabAtono').
		addClass('dimasmenuMenuTabCandi');
	}).
	on('mouseleave', '.dimasmenuMenuTab', function(e) {
		e.stopPropagation();
		$('.dimasmenuMenuTabAtono').removeClass('dimasmenuMenuTabAtono');
		$(this).removeClass('dimasmenuMenuTabCandi');
	}).
	on('click', '.dimasmenuMenuTab', function(e) {
		e.stopPropagation();

		let exec = $(this).data('exec');

		if (exec)
		exec();
	}).
	on('click', '.dimasmenuEpistrofiBar', function(e) {
		e.stopPropagation();
		Dimasmenu.enotitaRise($(this).data('epistrofi'));
	});

	return Dimasmenu;
};

Dimasmenu.activate = (enotitaDOM) => {
	pd.paletaSetup();
	Dimasmenu.
	menuSetup().
	enotitaActivate(enotitaDOM);

	return Dimasmenu;
};

Dimasmenu.enotitaRise = (enotitaDOM) => {
	if (!enotitaDOM)
	return Dimasmenu;

	Dimasmenu.toolbarTitlos(enotitaDOM);

	let fyi = enotitaDOM.data('errmsg');

	if (fyi)
	pd.fyiError(fyi);

	else
	pd.fyiMessage(enotitaDOM.data('fyi'));

	$('.dimasmenuEnotitaActive').
	filter(function() {
		return ($(this) !== enotitaDOM);
	}).
	finish().
	animate({
		'height': '0px',
		'opacity': 0,
	}, Dimasmenu.param.enotitaShrinkDuration, function() {
		$(this).removeClass('dimasmenuEnotitaActive');
	});

	enotitaDOM.
	finish().
	css({
		'height': '0px',
		'opacity': 0,
		'display': '',
	}).
	addClass('dimasmenuEnotitaActive').
	animate({
		'height': '100px',
		'opacity': 1,
	}, Dimasmenu.param.enotitaShrinkDuration, function() {
		$(this).css('height', '');
	});

	pd.ofelimoDOM.scrollTop(0);
	return Dimasmenu;
};

Dimasmenu.menuTabStatus = (menuTabDOM, status) => {
	menuTabDOM.
	removeClass('dimasmenuMenuTabBusy').
	removeClass('dimasmenuMenuTabSuccess').
	removeClass('dimasmenuMenuTabInactive').
	removeClass('dimasmenuMenuTabError').
	children('.dimasmenuMenuTabStatusIcon').
	remove();

	switch (status) {
	case 'busy':
		menuTabDOM.
		addClass('dimasmenuMenuTabBusy').
		append($('<img>').
		addClass('dimasmenuMenuTabStatusIcon').
		attr('src', '../images/busy.gif'));
		break;
	case 'success':
		menuTabDOM.
		addClass('dimasmenuMenuTabSuccess').
		append($('<img>').
		addClass('dimasmenuMenuTabStatusIcon').
		attr('src', '../images/success.png'));
		break;
	case 'inactive':
		menuTabDOM.
		addClass('dimasmenuMenuTabInactive').
		append($('<img>').
		addClass('dimasmenuMenuTabStatusIcon').
		attr('src', '../images/inactive.png'));
		break;
	case 'error':
		menuTabDOM.
		addClass('dimasmenuMenuTabError').
		append($('<img>').
		addClass('dimasmenuMenuTabStatusIcon').
		attr('src', '../images/error.png'));
		break;
	}

	return Dimasmenu;
};

Dimasmenu.menuTabFyi = (menuTabDOM, msg) => {
	let labelDOM = menuTabDOM.children('.dimasmenuMenuTabLabel');
	let fyiDOM = menuTabDOM.children('.dimasmenuMenuTabFyi');

	labelDOM.css('display', 'none');
	fyiDOM.css('display', 'none').
	removeClass('dimasmenuMenuTabFyiError');

	if (!msg) {
		fyiDOM.empty();
		labelDOM.css('display', 'block');
		return Dimasmenu;
	}

	fyiDOM.css('display', 'block').html(msg);
	return Dimasmenu;
};

Dimasmenu.menuTabFyiError = (menuTabDOM, msg) => {
	Dimasmenu.menuTabFyi(menuTabDOM, msg);
	menuTabDOM.children('.dimasmenuMenuTabFyi').
	addClass('dimasmenuMenuTabFyiError');
	return Dimasmenu;
};

///////////////////////////////////////////////////////////////////////////////@

Dimasmenu.enotitaDOM = (parentDOM) => {
	let enotitaDOM = $('<div>').
	addClass('dimasmenuEnotita').
	appendTo(pd.ofelimoDOM);

	if (!parentDOM)
	return enotitaDOM;

	let epistrofiBarDOM = $('<div>').
	data('epistrofi', parentDOM).
	addClass('dimasmenuEpistrofiBar').
	appendTo(enotitaDOM);

	let titlos = parentDOM.data('titlos');

	if (!titlos)
	titlos = 'Επιστροφή';

	epistrofiBarDOM.text(titlos);

	return enotitaDOM;
};

Dimasmenu.enotitaActivate = (enotitaDOM) => {
	Dimasmenu.toolbarTitlos(enotitaDOM);

	let active = $('.dimasmenuEnotitaActive');
	let h = (active.length ? $(active[0]).innerHeight() : 0);

	active.
	filter(function() {
		return ($(this) !== enotitaDOM);
	}).
	finish().
	animate({
		'height': '0px',
		'opacity': 0,
	}, Dimasmenu.param.menuShrinkDuration, function() {
		$(this).removeClass('dimasmenuEnotitaActive');
	});

	enotitaDOM.
	finish().
	css({
		'height': '0px',
		'opacity': 0,
		'display': '',
	}).
	addClass('dimasmenuEnotitaActive').
	animate({
		'height': h + 'px',
		'opacity': 1,
	}, Dimasmenu.param.menuShrinkDuration, function() {
		$(this).css({
			'height': '',
			'opacity': '',
		});
	});

	let errmsg = enotitaDOM.data('errmsg');

	if (errmsg)
	pd.fyiError(errmsg);

	else
	pd.fyiMessage(enotitaDOM.data('fyi'));

	// Αν υπάρχει παλέτα στο επιλεγμένο menutab την ενεργοποιούμε
	// κυρίως για να έχουμε focus στο σχετικό input field, εφόσον
	// αυτό εμφανίζεται.

	pd.paletaActivate(enotitaDOM.find('.pnd-paleta').first());

	return Dimasmenu;
};

Dimasmenu.toolbarTitlos = (enotitaDOM) => {
	let titlos = enotitaDOM.data('titlos');

	if (!titlos)
	titlos = 'Βεβαίωση παραβάσεων ΚΟΚ';

	pd.toolbarCenterDOM.
	finish().
	fadeTo(Dimasmenu.param.menuShrinkDuration, 0, function() {
		$(this).
		css({
			'display': 'table-cell',
			'opacity': '',
		}).
		text(titlos);
	});

	return Dimasmenu;
};

///////////////////////////////////////////////////////////////////////////////@
