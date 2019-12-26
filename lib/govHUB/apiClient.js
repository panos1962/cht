///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Updated: 2019-12-25
// Updated: 2019-12-24
// Updated: 2019-12-21
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

if (!process.env.CHT_BASEDIR)
process.env.CHT_BASEDIR = '/var/opt/cht';

const gh = require(`${process.env.CHT_BASEDIR}/lib/govHUB/apiCore.js`);
module.exports = gh;

///////////////////////////////////////////////////////////////////////////////@

gh.prosopo.prototype.html = function() {
	return $('<div>').addClass('resultBox').
		append($('<table>').
		append($('<tr>').
		append($('<td>').addClass('column').text('ΑΦΜ')).
		append($('<td>').addClass('value').text(this.afm))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΕΠΩΝΥΜΟ')).
		append($('<td>').addClass('value').text(this.eponimo))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΟΝΟΜΑ')).
		append($('<td>').addClass('value').text(this.onoma))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΠΑΤΡΩΝΥΜΟ')).
		append($('<td>').addClass('value').text(this.patronimo))));
};

///////////////////////////////////////////////////////////////////////////////@

gh.katoxos.prototype.html = function() {
	return $('<div>').
		append($('<div>').text(this.afm)).
		append($('<div>').text(this.eponimo));
};

///////////////////////////////////////////////////////////////////////////////@

gh.oxima.prototype.html = function() {
console.log(this);
	return $('<div>').addClass('resultBox').
		append($('<table>').
		append($('<tr>').
		append($('<td>').addClass('column').text('ΠΙΝΑΚΙΔΑ')).
		append($('<td>').addClass('value').text(this.pinakida))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΜΑΡΚΑ')).
		append($('<td>').addClass('value').text(this.marka))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΧΡΩΜΑ')).
		append($('<td>').addClass('value').text(this.xroma))));
};

///////////////////////////////////////////////////////////////////////////////@
