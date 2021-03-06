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
// Updated: 2020-12-09
// Updated: 2020-10-09
// Updated: 2020-03-18
// Updated: 2020-03-17
// Updated: 2020-03-16
// Updated: 2020-03-09
// Updated: 2020-03-07
// Updated: 2020-03-06
// Updated: 2020-03-03
// Updated: 2020-02-20
// Updated: 2020-02-17
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
	'dimas': {
		'ota': 'ΔΗΜΟΣ ΘΕΣΣΑΛΟΝΙΚΗΣ',
		'ipiresia': 'ΔΙΕΥΘΥΝΣΗ ΔΗΜΟΤΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ',
		'contact': 'Βασ. Γεωργίου 1, ΤΚ 54640, Τηλ. 231331-7930',
	},
};

Proklisi.param.govHUBServerUrl = govHUBConf.serverName +
	':' + govHUBConf.portNumber;

require('./menu.js')(Proklisi);
require('./isodos.js')(Proklisi);
require('./oxima.js')(Proklisi);
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
	geodataSetup().
	bebeosiSetup().
	oximaSetup().
	ipoxreosSetup().
	toposSetup().
	paravidosSetup().
	kirosiSetup().
	episkopisiSetup().
	exodosSetup().
	economySetup().
	pdaSetup().
	odosLoad([
		Proklisi.paravidosLoad,
		Proklisi.paralogosLoad,
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
	economySetup().
	pdaSetup().
	astinomikosLoad([
		() => Proklisi.activate(Proklisi.menuIsodosDOM),
	]);

	return Proklisi;
};

Proklisi.toolbarSetup = () => {
	pd.toolbarCenterDOM.
	addClass('proklisiToolbarTitlos');

	pd.toolbarLeftDOM.
	empty();

	if (Proklisi.oxiPDA())
	pd.toolbarLeftDOM.
	append($('<div>').
	addClass('proklisiTRButton').
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

	// Αν δεν βρούμε το συγκεκριμένο element στο toolbar τότε μάλλον
	// είμαστε σε economy mode, οπότε το αναζητούμε εκ νέου στην ωφέλιμη
	// περιοχή.

	if (!dom.length)
	dom = pd.ofelimoDOM.children('.chtToolbarXristis');

	// Αν και πάλι δεν εντοπίσουμε το συγκεκριμένο element στην ωφέλιμη
	// περιοχή, τότε το προσθέτουμε σαν να βρισκόμαστε σε economy mode.

	if (!dom.length)
	dom = $('<div>').
	addClass('chtToolbarXristis').
	addClass('proklisiToolbarXristisEconomy').
	appendTo(pd.ofelimoDOM);

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

Proklisi.economyMode = false;

Proklisi.economySetup = (economyMode) => {
	if (economyMode === undefined) {
		if (php.isRequest('economy') || Proklisi.isPDA()) {
			Proklisi.economyButtonDOM.trigger('click');
			return Proklisi;
		}
	}

	else
	Proklisi.economyMode = economyMode;

	if (Proklisi.economyMode) {
		$('.proklisiMenu').addClass('proklisiMenuEconomy');
		$('.proklisiMenuTab').addClass('proklisiMenuTabEconomy');
		$('.proklisiEpistrofiBar').addClass('proklisiEpistrofiBarEconomy');
		$('.proklisiButton').addClass('proklisiButtonEconomy');
		$('.pnd-paleta').addClass('proklisiPaletaEconomy');
	}

	else {
		$('.proklisiMenuEconomy').addClass('proklisiMenuEconomy');
		$('.proklisiMenuTabEconomy').removeClass('proklisiMenuTabEconomy');
		$('.proklisiEpistrofiBarEconomy').removeClass('proklisiEpistrofiBarEconomy');
		$('.proklisiButtonEconomy').removeClass('proklisiButtonEconomy');
		$('.pnd-paletaEconomy').removeClass('proklisiPaletaEconomy');
	}

	return Proklisi;
};

Proklisi.pdaSetup = () => {
	if (Proklisi.oxiPDA())
	return Proklisi;

	$('<div>').
	addClass('proklisiPDA').
	text('Full screen mode').
	on('click', (e) => {
		e.stopPropagation();
		Proklisi.fullscreen = false;
		pd.enterFullscreen();
	}).
	appendTo(pd.ofelimoDOM);

	pd.windowDOM.
	on('resize', () => {
		let h = 0;

		h += pd.bodyDOM.outerHeight();
		h -= pd.fyiDOM.outerHeight();

		pd.ofelimoDOM.css({
			'height': h + 'px',
		});
	});

	return Proklisi;
};

Proklisi.ribbonSetup = () => {
	let economyClicked = false;

	pd.ribbonLeftDOM.
	empty();

	pd.ribbonLeftDOM.
	prepend(Proklisi.economyButtonDOM = $('<div>').
	addClass('proklisiTRButton').
	attr('id', 'proklisiEconomyButton').
	text('Economy').
	on('click', (e) => {
		e.stopPropagation();

		if (economyClicked)
		return;

		let dh = pd.ofelimoDOM.height();
		dh += (pd.ofelimoDOM.innerHeight() - dh);
		dh += pd.toolbarDOM.outerHeight();
		dh += pd.ribbonDOM.outerHeight();

		pd.toolbarDOM.addClass('proklisiToolbarEconomy');
		$('.chtToolbarXristis').
		addClass('proklisiToolbarXristisEconomy').
		appendTo(pd.ofelimoDOM);

		pd.ribbonDOM.css('display', 'none');
		pd.ofelimoDOM.
		css({
			'padding': '0px',
			'height': dh + 'px',
		});

		Proklisi.economySetup(true);
	}));

	pd.ribbonCenterDOM.
	prepend($('<div>').
	text(pd.windowDOM.width() + 'x' + pd.windowDOM.height()));

	pd.ribbonRightDOM.
	append($('<div>').
	addClass('proklisiRibbonCopyright').
	html('<a href="copyright.php" target="copyright">' +
		'&copy; Δήμος Θεσσαλονίκης 2019 - ' +
		pd.dateTime(undefined, '%Y') + '</a>'));

	return Proklisi;
};

Proklisi.fullscreen = false;

Proklisi.isFullscreen = () => {
	return Proklisi.fullscreen;
};

Proklisi.toggleFullscreen = () => {
	if (Proklisi.isFullscreen())
	pd.exitFullscreen();

	else
	pd.enterFullscreen();

	Proklisi.fullscreen = !Proklisi.fullscreen;
	return Proklisi;
};

// Η παράμετρος "PDA" καθορίζει αν ο χρήστης επιθυμεί να τρέξει την εφαρμογή
// σε fullscreen και economy mode, πράγμα που είναι μάλλον απαραίτητο όταν
// η εφαρμογή εκτελείται σε συσκευές PDA.

Proklisi.isPDA = () => {
	return php.getIsYes("PDA");
}

Proklisi.oxiPDA = () => {
	return !Proklisi.isPDA();
}

Proklisi.cleanup = () => {
	pd.ofelimoDOM.empty();
	return Proklisi;
};

Proklisi.fyiMessage = (msg) => {
	pd.fyiMessage(msg);
	return Proklisi;
};

Proklisi.fyiError = (msg, err) => {
	if (msg && err) {
		pd.fyiError(msg);

		if (err)
		console.log(err);
	}

	else
	pd.fyiMessage();

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

Proklisi.geodataSetup = () => {
	try {
		Proklisi.geodata = navigator.geolocation;
	}

	catch (e) {
		delete Proklisi.geodata;
	}

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

	Proklisi.
	menuTabStatus(bebeosiDOM, 'busy').
	menuTabFyi(bebeosiDOM);

	$.post({
		'url': 'bebeosi.php',
		'dataType': 'text',
		'success': (rsp) => {
			let bebnum = parseInt(rsp);

			if (bebnum != rsp)
			return Proklisi.
			fyiError(rsp).
			menuTabStatus(bebeosiDOM.
			data('bebeosiError', rsp.error), 'error').
			menuTabFyi(bebeosiDOM);

			let data = {
				'bebnum': bebnum,
				'date': new Date(),
			};

			if (!Proklisi.geodata)
			Proklisi.bebeosiDataSet(bebeosiDOM, data);

			Proklisi.geodata.getCurrentPosition((pos) => {
				data.geox = pos.coords.longitude;
				data.geoy = pos.coords.latitude;
				Proklisi.bebeosiDataSet(bebeosiDOM, data);
			}, (err) => {
				Proklisi.bebeosiDataSet(bebeosiDOM, data);
			}, {
				'enableHighAccuracy': true,
				'timeout': 2000,
			});
		},
		'error': (err) => Proklisi.
		fyiError('Σφάλμα αιτήματος αριθμού βεβαίωσης', err).
		menuTabStatus(bebeosiDOM, 'error'),
	});

	return Proklisi;
};

Proklisi.bebeosiDataSet = (bebeosiDOM, data) => {
	bebeosiDOM.data('bebeosiData', data);

	let fyi = '<div><b>' + data.bebnum + '</b></div>';
	fyi += '<div>' + pd.dateTime(data.date, '%D/%M/%Y, %h:%m') + '</div>';

	if (data.hasOwnProperty('geox'))
	fyi += '<div>x&nbsp;=&nbsp;' + data.geox.toString().substr(0, 10) + '</div>';

	if (data.hasOwnProperty('geoy'))
	fyi += '<div>y&nbsp;=&nbsp;' + data.geoy.toString().substr(0, 10) + '</div>';

	Proklisi.menuTabFyi(bebeosiDOM, fyi);
	Proklisi.menuTabStatus(bebeosiDOM, 'success');

	return Proklisi;
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

	let prosopo = {
		'afm': afm,
	};

	Proklisi.
	menuTabStatus(ipoxreosDOM, 'busy').
	menuTabFyi(ipoxreosDOM, afm);

	$.post({
		'url': Proklisi.param.govHUBServerUrl,
		'dataType': 'json',
		'data': {
			'idos': 'prosopo',
			'key': afm,
			'sesami': govHUBConf.sesami,
		},
		'success': (rsp) => {
			if (rsp.hasOwnProperty('error')) {
				Proklisi.fyiError(rsp.error).
				menuTabStatus(ipoxreosDOM.data('ipoxreosError', rsp.error), 'error').
				menuTabFyiError(ipoxreosDOM, '<div>&#x2753;</div>' + afm);
			}

			else {
				prosopo = rsp.data;
				Proklisi.menuTabStatus(ipoxreosDOM, 'success').
				menuTabFyi(ipoxreosDOM, Proklisi.ipoxreosFyi(prosopo));
			}

			prosopo = new gh.prosopo(prosopo);
			ipoxreosDOM.data('ipoxreosData', prosopo);
		},
		'error': (err) => {
			Proklisi.
			fyiError('Σφάλμα ανάκτησης στοιχείων υπόχρεου', err).
			menuTabStatus(ipoxreosDOM.data('ipoxreosError',
			'Αποτυχημένη ανάκτηση στοιχείων υπόχρεου'), 'error').
			menuTabFyiError(ipoxreosDOM, afm);
			ipoxreosDOM.data('ipoxreosData', new gh.prosopo(prosopo));
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

Proklisi.toposimoList = [
	'ΕΝΑΝΤΙ',
	'ΚΑΙ',
	'ΓΩΝΙΑ',
	'ΕΜΠΡΟΣΘΕΝ',
	'ΑΠΘ',
	'ΧΑΝΘ',
	'ΞΑΡΧΑΚΟΣ',
	'ΔΗΜΑΡΧΕΙΟ',
	'ΔΕΘ',
];

Proklisi.toposSetup = () => {
	let paletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
			pd.paletaList['symbol'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': true,
		'scribe': Proklisi.toposScribe,
		'submit': () => Proklisi.enotitaRise(Proklisi.menuKlisiDOM),
		'change': Proklisi.toposCheckData,
		'helper': 'Πληκτρολογήστε τον αριθμό',
		'post': ' ',
	});

	let toposimaDOM = $('<div>');

	pd.arrayWalk(Proklisi.toposimoList, (x) => {
		toposimaDOM.
		append($('<div>').
		addClass('proklisiToposimoContainer').
		append($('<div>').
		addClass('proklisiToposimo').
		text(x)));
	});

	Proklisi.toposimoRafiDOM = pd.paletaRafi({
		'content': toposimaDOM,
	});

	Proklisi.toposimoRafiDOM.
	appendTo(paletaDOM);

	toposimaDOM.
	on('mouseenter', '.proklisiToposimoContainer', function(e) {
		e.stopPropagation();

		$(this).
		addClass('proklisiToposimoContainerCandi').
		children('.proklisiToposimo').
		addClass('proklisiToposimoCandi');
	}).
	on('mouseleave', '.proklisiToposimoContainer', function(e) {
		e.stopPropagation();

		$(this).
		removeClass('proklisiToposimoContainerCandi').
		children('.proklisiToposimo').
		removeClass('proklisiToposimoCandi');
	}).
	on('click', '.proklisiToposimoContainer', function(e) {
		e.stopPropagation();

		let toposimo = $(this).text();

		if (!toposimo)
		return;

		let paletaDOM = Proklisi.toposDOM.children('.pnd-paleta');
		let monitorDOM = paletaDOM.children('.pnd-paletaMonitor');
		let topos = monitorDOM.text();

		topos = Proklisi.toposimoFix(topos, toposimo);
		monitorDOM.text(topos);
		paletaDOM.data('text', topos);
		paletaDOM.children('.pnd-paletaInput').val(topos);
		Proklisi.toposCheckData(paletaDOM);
	});

	Proklisi.toposDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Τόπος παράβασης').
	data('fyi', 'Πληκτρολογήστε το όνομα της οδού').
	append(paletaDOM);

	return Proklisi;
};

// Η function "toposimoFix" δέχεται τον τρέχοντα τόπο και ένα τοπόσημο που έχει
// επιλέξει ο χρήστης και επιχειρεί είτε να προσθέσει το συγκεκριμένο τοπόσημο
// στον υφιστάμενο τόπο, είτε να διαγράψει το συγκεκριμένο τοπόσημο εφόσον αυτό
// βρίσκεται ήδη ως τελευταία λέξη στον υφιστάμενο τόπο.
//
// Παράδειγμα
// ‾‾‾‾‾‾‾‾‾‾
//        Τόπος: ΦΑΙΑΚΩΝ 4
//     Τοπόσημο: ΚΑΙ
// Επιστρέφεται: ΦΑΙΑΚΩΝ 4 ΚΑΙ
//
// Παράδειγμα
// ‾‾‾‾‾‾‾‾‾‾
//        Τόπος: ΦΑΙΑΚΩΝ 4 ΚΑΙ
//     Τοπόσημο: ΚΑΙ
// Επιστρέφεται: ΦΑΙΑΚΩΝ 4

Proklisi.toposimoFix = (topos, toposimo) => {
	// Σε πρώτη φάση αφαιρούμε λευκούς χαρακτήρες που
	// ίσως υπάρχουν στο τέλος του υφιστάμενου τόπου.

	topos = topos.replace(/\s+$/, '');

	// Κατόπιν σπάζουμε τον υφιστάμενο τόπο σε λέξεις.

	let lexi = topos.split(/\s+/);

	// Αν ο υφιστάμενος τόπος ήταν κενός, επιστρέφουμε
	// το τοπόσημο.

	if (!lexi.length)
	return toposimo;

	// Αν η τελευταία λέξη του υφιστάμενου τόπου δεν συμπίπτει με το
	// τοπόσημο, τότε προσθέτουμε το τοπόσημο στον υφιστάμενο τόπο.

	if (lexi.pop() !== toposimo)
	return topos + ' ' + toposimo + ' ';

	// Διαπιστώσαμε ότι η τελευταία λέξη του υφιστάμενου τόπου συμπίπτει
	// με το τοπόσημο, επομένως το αφαιρούμε από τον υφιστάμενο τόπο.

	topos = '';
	pd.arrayWalk(lexi, (s) => topos = pd.strPush(topos, s));

	return topos;
};

Proklisi.toposExec = () => {
	Proklisi.enotitaActivate(Proklisi.toposDOM);
	return Proklisi;
};

Proklisi.toposScribe = (paletaDOM) => {
	let inputDOM = paletaDOM.children('.pnd-paletaInput');
	let text = Proklisi.toposScribeText(paletaDOM, inputDOM);
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
		pd.arrayWalk(list, (c) => re += '.*' + c);
	}

	re = new RegExp(re, 'i');
	let match = [];

	pd.arrayWalk(Proklisi.odosList, (x) => {
		if (x.match(re)) 
		match.push(x);
	});

	paletaDOM.data('match', match);
	paletaDOM.removeData('matchPointer');

	if (!match.length)
	return pd;

	zoomDOM = paletaDOM.children('.pnd-paletaZoom');
	pd.arrayWalk(match, (x) => {
		$('<div>').
		addClass('pnd-paletaZoomGrami').
		text(x).
		appendTo(zoomDOM);
	});

	return pd;
};

Proklisi.toposScribeText = (paletaDOM, inputDOM) => {
	paletaDOM.removeData('ante');
	let s = inputDOM.val().replace(/\s+$/, '');

	if (s === undefined)
	return '';

	if (typeof(s) !== 'string')
	return '';

	let lexi = s.split(/\s+/);

	if (!lexi.length)
	return '';

	// Εντοπίζουμε την τελευταία εμφάνιση τοποσήμου στον υφιστάμενο τόπο
	// και κρατάμε ό,τι υπάρχει από την αρχή του υφιστάμενου τόπου μέχρι
	// και το συγκεκριμένο τοπόσημο ως μελλοντικό πρόθεμα (ante), ενώ
	// επιστρέφουμε το μέρος του υφιστάμενου τόπου μετά το τοπόσημο
	// προκειμένου να χρησιμοποιηθεί στο επόμενο lookup των οδών.

	for (let i = lexi.length - 1; i >= 0; i--) {
		for (let j = 0; j < Proklisi.toposimoList.length; j++) {
			if (lexi[i] !== Proklisi.toposimoList[j])
			continue;

			s = '';

			for (j = 0; j <= i; j++)
			s = pd.strPush(s, lexi[j]);

			if (s)
			s += ' ';

			paletaDOM.data('ante', s);
			s = '';

			for (j = i + 1; j < lexi.length; j++)
			s = pd.strPush(s, lexi[j]);

			return s;
		}
	}

	return s;
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

Proklisi.paletaDefaultText = {
	'paravidos': 'Ε1999Ν2696Α',
};

Proklisi.paravidosSetup = () => {
	Proklisi.paravidosPaletaDOM = pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'scribe': Proklisi.paravidosScribe,
		'submit': () => Proklisi.enotitaRise(Proklisi.menuKlisiDOM),
		'change': Proklisi.paravidosCheckData,
		'zoom': true,
		'text': Proklisi.paletaDefaultText.paravidos,
		'helper': Proklisi.paravidosClick,
	});

	Proklisi.paravidosDOM = Proklisi.enotitaDOM(Proklisi.menuKlisiDOM).
	data('titlos', 'Είδος παράβασης').
	data('fyi', 'Πληκτρολογήστε τη διάταξη ή την περιγραφή της παράβασης').
	append(Proklisi.paravidosPaletaDOM);

	Proklisi.paravidosPaletaDOM.
	on('click', '.proklisiParalogos', function(e) {
		e.stopPropagation();
		Proklisi.paravidosEpilogi(
			$(this).parent().data('value'),
			$(this).data('value'),
		);
	});

	// Για λόγους ομοιομρφίας δημιουργούμε ένα «ορφανό» div για τον λόγο
	// παράβασης. Πράγματι, ο λόγος παράβασης λειτουργεί στα πλαίσια της
	// ενότητας που αφορά στο είδος παράβασης, επομένως δεν χρειάζεται να
	// δημιουργήσουμε άλλη ενότητα, ωστόσο προτιμούμε να δημιουργήσουμε
	// την εν λόγω ενότητα προκειμένου να διατηρήσουμε κατά το δυνατόν
	// την ομοιομορφία σε άλλες λειτουργίες της εφαρμογής.

	Proklisi.paralogosTabDOM = $('<div>');

	return Proklisi;
};

Proklisi.paravidosExec = () => {
	Proklisi.enotitaActivate(Proklisi.paravidosDOM);
	Proklisi.paravidosScribe(Proklisi.paravidosDOM.
	find('.pnd-paleta').first());
	return Proklisi;
};

Proklisi.paravidosScribe = (paletaDOM) => {
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
		pd.arrayWalk(list, (c) => re += '.*' + c);
	}

	re = new RegExp(re, 'i');
	let match = [];

	pd.arrayWalk(Proklisi.paravidosList, (x) => {
		let s = x.kodikos + x.perigrafi;

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
		text(x.diataxiGet() + ' ' + x.perigrafi).
		appendTo(zoomDOM);
	});

	return pd;
};

Proklisi.paravidosCheckData = (paletaDOM) => {
	if (paletaDOM === undefined)
	paletaDOM = Proklisi.paravidosDOM.
	find('.pnd-paleta').first();

	let paravidosDOM = Proklisi.paravidosTabDOM;
	let paravidos = paletaDOM.data('value');

	if (paravidos) {
		let oxima = Proklisi.oximaTabDOM.data('oximaData');
		let katigoria = Proklisi.oximaKatigoriaTabDOM.data('oximaKatigoriaData');

		if (!katigoria)
		katigoria = (oxima ? oxima.tipos : undefined);

		Proklisi.menuTabStatus(paravidosDOM.
		data('paravidosData', paravidos), 'success');
		Proklisi.menuTabFyi(paravidosDOM, paravidos.diataxiGet());

		// Λαμβάνουμε υπόψη την τρέχουσα κατάσταση επιβολής διοικητικών
		// κυρώσεων.

		let monopro = Proklisi.monoproTabDOM.data('monopro');

		pd.arrayWalk([
			'pinakides',
			'adia',
			'diploma',
			'prostimo',
		], (x) => {
			let val = paravidos.kirosiGet(x, katigoria);

			if (Proklisi.kirosiList.hasOwnProperty(x)) {
				if (monopro)
				Proklisi.kirosiList[x] = 0;

				else {
					Proklisi.kirosiList[x] = val;
					val = 0;
				}
			}

			let kirosiDOM = Proklisi[x + 'DOM'];
			let paletaDOM = kirosiDOM.
			children('.pnd-paleta');

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

// Η function "paravidosClick" καλείται κατά το κλικ στη γραμμή είδους
// παράβασης στην περιοχή του zoom ειδών παράβασης. Αν το είδος παράβασης
// συνοδεύεται από λόγους παράβασης, τότε ανοίγει «βεντάλια» με τους λόγους
// παράβασης προκειμένου ο χρήστης να επιλέξει συγκεκριμένο λόγο παράβασης.

Proklisi.paravidosClick = (candiDOM, paletaDOM) => {
	let paravidos = candiDOM.data('value');
	let ll = Proklisi.paralogosList[paravidos.kodikos];

	// Αν δεν υπάρχουν λόγοι παράβασης για το επιλεγμένο είδος παράβασης,
	// τότε απλώς επιλέγουμε το συγκεκριμένο είδος παράβασης χωρίς να
	// καθορίζουμε συγκεκριμένο λόγο παράβασης.

	if (!ll)
	return Proklisi.paravidosEpilogi(paravidos);

	// Το επιλεγμένο είδος παράβασης συνοδεύεται από ειδικούς λόγους
	// παράβασης, οπότε ανοίγουμε «βεντάλια» με τους λόγους που αφορούν
	// στο επιλεγμένο είδος παράβασης. Αν όμως έχουμε ήδη ανοίξει τη
	// συγκεκριμένη βεντάλια, τότε απλώς κλείνουμε την βεντάλια επομένως
	// το κλικ στο συγκεκριμένο είδος παράβασης χωρίς να επιλέγουμε
	// κάποιον από τους λόγους παράβασης που αφορούν στο συγκεκριμένο
	// είδος παράβασης, λειτουργεί ως toggle ανοίγματος/κλεισίματος
	// των λόγων παράβασης του επιλεγμένου είδους παράβασης.

	if (candiDOM.data('anikto'))
	return candiDOM.removeData('anikto').children().remove();

	// Έχουμε κάνει κλικ σε είδος παράβασης το οποίο συνοδεύεται από
	// ειδικότερους λόγους παράβασης, οπότε ανοίγουμε «βεντάλια» με
	// τους συγκεκριμένους λόγους παράβασης που αφορούν στο είδος
	// παράβασης στο οποίο κάναμε κλικ.

	pd.arrayWalk(ll, (x) => candiDOM.
	append($('<div>').
	data('value', x).
	addClass('proklisiParalogos').
	text(x.perigrafi)));

	// Μαρκάρουμε το συγκεκριμένο είδος παράβασης ως «ανοικτό» και
	// επιστρέφουμε προκειμένου ο χρήστης να επιλέξει συγκεκριμένο
	// λόγο παράβασης.

	candiDOM.data('anikto', true);

	return pd;
};

// Η function "paravidosEpilogi" καλείται όταν ο χρήστης έχει επιλέξει είδος
// και λόγο παράβασης για την ανά χείρας βεβαίωση. Το είδος παράβασης είναι
// υποχρεωτικό, ενώ ο λόγος παράβασης μπορεί και να μην έχει καθοριστεί.

Proklisi.paravidosEpilogi = (paravidos, paralogos) => {
	let paletaDOM = Proklisi.paravidosPaletaDOM;
	let paravidosDOM = Proklisi.paravidosTabDOM;
	let paralogosDOM = Proklisi.paralogosTabDOM;

	paletaDOM.data('value', paravidos);
	Proklisi.paravidosCheckData(paletaDOM);

	// Το είδος παράβασης αποθηκεύεται ως στοιχείο της ενότητας είδους
	// παράβασης, η οποία υφίσταται ως ενότητα στη σελίδα μας.

	paravidosDOM.data('paravidosData', paravidos);

	// Ο λόγος παράβασης αποθηκεύεται ως στοιχείο της ψευδοενότητας
	// λόγου παράβασης την οποία έχουμε δημιουργήσει αλλά δεν έχουμε
	// εντάξει στη σελίδα μας και ως εκ τούτου δεν υφίσταται ως ενότητα
	// στη σελίδα μας, αλλά την έχουμε δημιουργήσει ακριβώς για να
	// διατηρήσουμε την ομοιομορφία των διαδικασιών στην εφαρμογή μας.

	paralogosDOM.data('paralogosData', paralogos);

	// Ενημερώνουμε το tab box που αφορά στο είδος παράβασης, θέτοντας
	// το check ενημέρωσης και το λεκτικό του είδους και του λόγου
	// παράβασης που επιλέξαμε.

	Proklisi.menuTabStatus(paravidosDOM, paravidos ? 'success' : 'clear');

	let fyi = '';

	if (paravidos)
	fyi = pd.strPush(fyi, paravidos.diataxiGet());

	if (paralogos)
	fyi = pd.strPush(fyi, paralogos.perigrafi, '<br>');

	Proklisi.menuTabFyi(paravidosDOM, fyi);

	// Καθαρίζουμε την ενότητα επιλογής είδους και λόγου παράβασης
	// και επιστρέφουμε στο βασικού μενού επεξεργασίας της πρό-κλησης.

	Proklisi.paravidosPaletaDOM.children('.pnd-paletaZoom').empty();
	Proklisi.enotitaRise(Proklisi.menuKlisiDOM);

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
	$('.pnd-paleta').each(function() {
		return true;
	});

	pd.arrayWalk([
		'bebeosi',
		'oxima',
		'ipoxreos',
		'paravidos',
		'paralogos',
		'oximaKatigoria',
		'kirosi',
		'pinakides',
		'adia',
		'diploma',
		'prostimo',
	], (x) => {
		let tabDOM = Proklisi[x + 'TabDOM'];

		tabDOM.
		removeData(x + 'Data');

		Proklisi.
		menuTabStatus(tabDOM, 'clear').
		menuTabFyi(tabDOM);

		let enotitaDOM = Proklisi[x + 'DOM'];

		if (!enotitaDOM)
		return;

		let paletaDOM = enotitaDOM.children('.pnd-paleta');
		let monitorDOM = paletaDOM.children('.pnd-paletaMonitor');
		let inputDOM = paletaDOM.children('.pnd-paletaInput');
		let text = Proklisi.paletaDefaultText[x];

		if (!text)
		text = '';

		paletaDOM.
		data('text', '').
		data('value', '').
		removeData('match').
		removeData('matchPointer');

		monitorDOM.
		removeData('content').
		removeData('text').
		removeData('value').
		text(text);

		inputDOM.
		removeData('prev').
		val(text);
	});

	Proklisi.
	oximaMarkaRafiClear().
	oximaXromaRafiClear().
	oximaTiposRafiClear();

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

Proklisi.exodosExec = () => Proklisi.
menuTabStatus(Proklisi.exodosTabDOM, 'clear').
enotitaActivate(Proklisi.exodosDOM);

Proklisi.exodosConfirmExec = () => {
	$.post({
		'url': '../../lib/exodos.php',
		'success': () => window.location = self.location,
		'error': (err) => Proklisi.
		fyiError('Αποτυχία εξόδου', err).
		menuTabStatus(Proklisi.exodosTabDOM, 'error'),
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

Proklisi.paralogosLoad = (chain) => {
	let next = chain.shift();

	if (Proklisi.hasOwnProperty('paralogosList'))
	return next(chain);

	// Η λίστα "paralogosList" είναι associative αποτελεί παρακολούθημα
	// του array "paravidosList" και είναι δεικτοδοτημένη με το είδος
	// παράβασης. Κάθε στοιχείο της λίστας είναι array με τους λόγους
	// του πατρικού είδους παράβασης.

	Proklisi.paralogosList = {};

	$.post({
		'url': '../lib/paralogos_list.php',
		'success': (rsp) => {
			let list = rsp.split(/[\n\r]+/);
			list.pop();
			pd.arrayWalk(list, (x, i) => {
				// Μετατρέπουμε σε "Dimas.paralogos" object
				// τον λόγο παράβασης και αφού κρατήσουμε σε
				// μεταβλητή το είδος παράβασης, διαγράφουμε
				// το είδος από το νεόκοπο object, καθώς το
				// είδος παράβασης βρίσκεται ήδη στο πατρικό
				// στοιχείο της λίστας λόγων παράβασης.

				let l = Dimas.paralogos.fromParalogosList(x);
				let p = l.paravidos;
				delete l.paravidos;

				// Αν το είδος παράβασης του ανά χείρας λόγου
				// παράβασης δεν βρίσκεται ήδη στην πατρική
				// λίστα λόγων παράβασης, εισάγουμε το είδος
				// παράβασης στη λίστα ως κενό array λόγων
				// παράβασης του συγκεκριμένου είδους.

				if (!Proklisi.paralogosList.hasOwnProperty(p))
				Proklisi.paralogosList[p] = [];

				// Τέλος, προσθέτουμε τον ανά χείρας λόγο
				// παράβασης στο array λόγων παράβασης του
				// συγκεκριμένου είδους παράβασης.

				Proklisi.paralogosList[p].push(l);
			});
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
