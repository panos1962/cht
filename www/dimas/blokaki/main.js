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
// www/dimas/blokaki/main.js —— Πρόγραμμα οδήγησης σελίδας προκαθορισμού
// αριθμών βεβαίωσης.
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
require('../../../mnt/pandora/lib/pandoraClient.js');
require('../../../mnt/pandora/www/lib/pandoraJQueryUI.js')(pd);

const Dimas = require('../../../lib/dimasClient.js');

const Blokaki = {};

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

	Blokaki.
	toolbarSetup().
	ribbonSetup()
	[pd.isXristis() ? 'eponimiXrisi' : 'anonimiXrisi']();
});

Blokaki.eponimiXrisi = () => {
	pd.keepAlive('../mnt/pandora');

	$('<div>').text('xxx').
	appendTo(pd.ofelimoDOM);

	return Blokaki;
};

Blokaki.anonimiXrisi = () => {
	window.location = '/cht/dimas';
	return Blokaki;
};

Blokaki.toolbarSetup = () => {
	pd.toolbarCenterDOM.
	addClass('blokakiToolbarTitlos');

	pd.toolbarRightDOM.
	append($('<div>').addClass('chtToolbarXristis'));

	return Blokaki;
};

Blokaki.ribbonSetup = () => {
	return Blokaki;
};
