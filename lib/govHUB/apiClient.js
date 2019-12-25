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
return 'XXX';
	return $('<div>').
		append($('<div>').text(this.afm)).
		append($('<div>').text(this.eponimo));
};

///////////////////////////////////////////////////////////////////////////////@

gh.katoxos.prototype.html = () => {
return 'YYY';
	return $('<div>').
		append($('<div>').text(this.afm)).
		append($('<div>').text(this.eponimo));
};

///////////////////////////////////////////////////////////////////////////////@

gh.oxima.prototype.html = () => {
return 'ABC';
	return $('<div>').
		append($('<div>').text(this.pinakida)).
		append($('<div>').text(this.marka)).
		append($('<div>').text(this.xroma));
};

///////////////////////////////////////////////////////////////////////////////@
