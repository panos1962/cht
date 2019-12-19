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
const qs = require('querystring');
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
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type', 'application/json');

		if (req.method === 'POST') {
			let body = '';

			req.
			on('data', chunk => {
				body += chunk.toString();
			}).
			on('end', () => {
				try {
					var data = qs.parse(body);
				} catch (e) {
					res.end('{"error":"Errors encountered!"}');
					return;
				}

				res.end(JSON.stringify(data));
			});
		}
	}).listen(11123);
};

wwwsrv.init();
