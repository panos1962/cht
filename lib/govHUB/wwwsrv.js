///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// wwwsrv.js -- node program το εξυπηρετεί αιτήματα μέσω διαδικτύου.
//
// Last update: 2019-12-19
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const http = require('http');
const util = require('util');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const gh = require(`${pd.env('CHT_BASEDIR:=/var/opt/cht')}/lib/govHUB/api.js`);

const wwwsrv = {};

wwwsrv.init = (conf) => {
	if (conf === undefined)
	conf = `${process.env.CHT_BASEDIR}/private/govHUB.cf`;

	gh.confRead(conf, (conf) => {
		wwwsrv.listen(conf);
	});
};

wwwsrv.listen = (conf) => {
	http.createServer((req, res) => {
		res.write('Hello World!');
		res.end();
	}).listen(11123);
};

wwwsrv.init();
