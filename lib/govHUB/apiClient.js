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

gh.prosopo.prototype.html = () => {
	return $('<div>').
		append($('<div>').text(this.afm)).
		append($('<div>').text(this.onomasiaGet()));
};

///////////////////////////////////////////////////////////////////////////////@

gh.katoxos.prototype.html = () => {
	return $('<div>').
		append($('<div>').text(this.afm)).
		append($('<div>').text(this.onomasiaGet()));
};

///////////////////////////////////////////////////////////////////////////////@

gh.oxima.prototype.html = () => {
	return $('<div>').
		append($('<div>').text(this.pinakida)).
		append($('<div>').text(this.marka));
};

///////////////////////////////////////////////////////////////////////////////@
