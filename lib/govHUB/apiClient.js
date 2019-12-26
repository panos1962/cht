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
	return $('<div>').addClass('resultBox resultProsopo').
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
	let html = $('<div>').addClass('resultBox resultKatoxos');
	let data = $('<table>').appendTo(html);

	data.
	append($('<tr>').
	append($('<td>').addClass('column').text('ΑΦΜ')).
	append($('<td>').addClass('value').text(this.afm)));

	if (this.pososto != 100)
	data.
	append($('<tr>').
	append($('<td>').addClass('column').text('ΣΥΝΙΔΙΟΚΤΗΣΙΑ')).
	append($('<td>').addClass('value').text(this.pososto + '%')));

	data.
	append($('<tr>').
	append($('<td>').addClass('column').text('ΕΠΩΝΥΜΟ')).
	append($('<td>').addClass('value').text(this.eponimo))).
	append($('<tr>').
	append($('<td>').addClass('column').text('ΟΝΟΜΑ')).
	append($('<td>').addClass('value').text(this.onoma))).
	append($('<tr>').
	append($('<td>').addClass('column').text('ΠΑΤΡΩΝΥΜΟ')).
	append($('<td>').addClass('value').text(this.patronimo)));

	let dief = '';
	let enotiko = '';

	if (this.dief) {
		dief += this.dief;
		enotiko = '<br>';
	}

	if (this.perioxi) {
		dief += enotiko + this.perioxi;
		enotiko = '<span class="colinval">, ';
	}

	if (this.tk) {
		dief += enotiko + 'ΤΚ&nbsp;</span>' + this.tk;
	}

	if (dief)
	data.
	append($('<tr>').
	append($('<td>').addClass('column').text('ΔΙΕΥΘΥΝΣΗ')).
	append($('<td>').addClass('value').html(dief)));

	return html;
};

///////////////////////////////////////////////////////////////////////////////@

gh.oxima.prototype.html = function() {
	let html = $('<div>');

	html.append($('<div>').addClass('resultBox resultOxima').
		append($('<table>').
		append($('<tr>').
		append($('<td>').addClass('column').text('ΠΙΝΑΚΙΔΑ')).
		append($('<td>').addClass('value').text(this.pinakida))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΜΑΡΚΑ')).
		append($('<td>').addClass('value').text(this.marka))).
		append($('<tr>').
		append($('<td>').addClass('column').text('ΧΡΩΜΑ')).
		append($('<td>').addClass('value').text(this.xroma)))));

	this.katoxosWalk((k) => {
		html.append(k.html());
	});

	return html;
};

///////////////////////////////////////////////////////////////////////////////@
