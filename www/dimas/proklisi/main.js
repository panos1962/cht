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
// @HISTORY BEGIN
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

const Proklisi = {};

Proklisi.param = {
	'menuShrinkDuration': 300,
};

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
	menuSetup().
	bebeosiSetup().
	oximaSetup().
	toposSetup().
	loadData();
});

///////////////////////////////////////////////////////////////////////////////@

Proklisi.menuSetup = () => {
	Proklisi.menuDOM = $('<div>').
	addClass('proklisiMenu').
	addClass('proklisiEnotita').
	addClass('proklisiEnotitaActive').
	css('height', 'auto').

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.menuBasicDOM = $('<div>').
	data('exec', Proklisi.bebeosiExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabText').
	html('Στοιχεία Βεβαίωσης'))).

	append(Proklisi.menuOxima = $('<div>').
	data('exec', Proklisi.oximaExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabText').
	html('Στοιχεία Οχήματος'))).

	append(Proklisi.menuTopos = $('<div>').
	data('exec', Proklisi.toposExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabText').
	html('Τοποθεσία Παράβασης')))).

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.menuParavasi = $('<div>').
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabText').
	html('Στοιχεία Παράβασης'))).

	append(Proklisi.menuInfo = $('<div>').
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabText').
	html('Παρατηρήσεις'))).

	append(Proklisi.menuEpiskopisi = $('<div>').
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabText').
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
	});
};

Proklisi.menuBarDOM = () => {
	let menuBarDOM = $('<div>').
	addClass('proklisiMenuBar').
	text('Αρχικό Μενού Επιλογών');

	return menuBarDOM;
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
	Proklisi.oximaDOM = Proklisi.enotitaDOM().
	append(pd.paleta({
		'paleta': [
			pd.paletaList['latin'],
			pd.paletaList['greek'],
		],
		'keyboard': php.requestIsYes('keyboard'),
	}));

	return Proklisi;
};

Proklisi.oximaExec = () => {
	Proklisi.enotitaActivate(Proklisi.oximaDOM);

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
		'scribe': (paletaDOM) => {
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
		},
	}));

	return Proklisi;
};

Proklisi.toposExec = () => {
	Proklisi.enotitaActivate(Proklisi.toposDOM);

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
	let next = Proklisi.paravasiLoad;

	$.post({
		'url': '../lib/odos_list.php',
		'success': (rsp) => {
			Proklisi.odosList = rsp.split(/[\n\r]+/);
			next();
		},
		'error': (err) => {
			console.error(err);
			next();
		},
	});

	return Proklisi;
};

Proklisi.paravasiLoad = () => {
	let next = Proklisi.astinomosLoad;

	$.post({
		'url': '../lib/paravasi_list.php',
		'success': (rsp) => {
			Proklisi.paravasiList = rsp.split(/[\n\r]+/);
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
