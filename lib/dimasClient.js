///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
// @COPYRIGHT BEGIN
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascript
// @FILETYPE END
//
// @FILE BEGIN
// lib/dimasClient.js —— dimas JavaScript API (client module)
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-02-07
// @HISTORY END
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd = require('../mnt/pandora/lib/pandoraClient.js');
const Dimas = require('./dimasCore.js');
module.exports = Dimas;

///////////////////////////////////////////////////////////////////////////////@

Dimas.ipalilos.prototype.toolbarXristisRefresh = function(dom) {
	if (this.hasOwnProperty('kodikos'))
	dom.append($('<div>').
	addClass('chtToolbarXristisKodikos').
	text(this.kodikos));

	if (this.hasOwnProperty('onomateponimo'))
	dom.append($('<div>').
	addClass('chtToolbarXristisOnomateponimo').
	text(this.onomateponimo));

	return this;
};
