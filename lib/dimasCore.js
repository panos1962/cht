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
// www/lib/dimasCore.js —— "Dimas" JavaScript core module
// @FILE END
//
// @DESCRIPTION BEGIN
// Δομές και functions που αφορούν στο υποσύστημα της Δημοτικής Αστυνομίας.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-01-26
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const Dimas = {};
module.exports = Dimas;

const pd = require("../mnt/pandora/lib/pandoraCore.js");

///////////////////////////////////////////////////////////////////////////////@

Dimas.paravidos = function(obj) {
	pd.objectInit(this, obj);
};

Dimas.paravidos.fromParavidosList = function(s) {
	return eval('new Dimas.paravidos(' + s + ');');
};

Dimas.paravidos.prototype.diataxiGet = function() {
	if (this.hasOwnProperty('diataxi'))
	return this.diataxi;

	let diataxi = '';
	let kodikos = this.kodikos.split('');

	if (!kodikos.length)
	return (this.diataxi = diataxi);

	if (kodikos.shift() !== 'Α')
	return (this.diataxi = diataxi);

	let c;
	let s = '';

	while (((c = kodikos.shift()) !== undefined) && c.match(/[0-9]/))
	s += c;

	if (!s)
	return (this.diataxi = diataxi);

	diataxi = 'Άρ. ' + s;

	if (c !== 'Π')
	return (this.diataxi = diataxi);

	if (!kodikos.length)
	return (this.diataxi = diataxi);

	s = '';

	while (((c = kodikos.shift()) !== undefined) && c.match(/[0-9]/))
	s += c;

	if (!s)
	return (this.diataxi = diataxi);

	diataxi += ', παρ. ' + s;

	if (!c)
	return (this.diataxi = diataxi);

	if ((c === 'Ρ') && kodikos.length)
	s = '(P-';

	else
	s = 'περ. ' + c;

	while (c = kodikos.shift())
	s += c;

	diataxi += ', ' + s + ')';
	return (this.diataxi = diataxi);
};

Dimas.paravidos.prototype.plirisPerigrafiGet = function() {
	let s = this.kodikos + this.perigrafi;

	return s;
};

///////////////////////////////////////////////////////////////////////////////@
