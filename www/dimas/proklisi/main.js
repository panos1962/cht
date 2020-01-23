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
	selidaSetup().
	loadData();
});

///////////////////////////////////////////////////////////////////////////////@

const Proklisi = {};

Proklisi.selidaSetup = () => {
	pd.bodyDOM.
	on('mouseenter', '.proklisiMenuTab', function(e) {
		e.stopPropagation()
		$('.proklisiMenuTab').addClass('proklisiMenuTabAtono');
		$(this).addClass('proklisiMenuTabCandi');
	}).
	on('mouseleave', '.proklisiMenuTab', function(e) {
		e.stopPropagation()
		$('.proklisiMenuTabAtono').removeClass('proklisiMenuTabAtono');
		$(this).removeClass('proklisiMenuTabCandi');
	});

	return Proklisi;
};

Proklisi.menuSetup = () => {
	Proklisi.menuDOM = $('<div>').
	addClass('proklisiMenu').

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.menuBasicDOM = $('<div>').
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabText').
	html('Στοιχεία Βεβαίωσης'))).

	append(Proklisi.menuOxima = $('<div>').
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabText').
	html('Στοιχεία Οχήματος'))).

	append(Proklisi.menuTopos = $('<div>').
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

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.loadData = () => {
	Proklisi.odosLoad();
	return Proklisi;
};

Proklisi.odosLoad = () => {
	let xxx = Proklisi.paravasiLoad;

	$.post({
		'url': '../lib/odos_list.php',
		'success': (rsp) => {
			Proklisi.odosList = rsp.split(/[\n\r]+/);
			next();
		},
		'error': (err) => {
			console.error(err);
			xxx();
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
	let next = Proklisi.menuSetup;

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
