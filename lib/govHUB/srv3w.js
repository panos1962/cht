///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// 3wsrv.js -- node web server που εξυπηρετεί αιτήματα αναζήτησης στοιχείων
// οχημάτων/κατόχων μέσω αριθμού κυκλοφορίας οχήματος, και στοιχείων φυσικών
// και νομικών προσώπων.
//
// Updated: 2019-12-20
// Updated: 2019-12-19
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const srv3w = {};
module.exports = srv3w;

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const http = require('http');
const qs = require('querystring');
const util = require('util');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const gh = require(`${pd.env('CHT_BASEDIR:=/var/opt/cht')}/lib/govHUB/api.js`);

srv3w.init = (opts) => {
	if (opts === undefined)
	opts = {};

	if (!opts.hasOwnProperty('conf'))
	opts.conf = `${process.env.CHT_BASEDIR}/private/govHUB.cf`;

	if (!opts.hasOwnProperty('monitor'))
	opts.monitor = false;

	pd.ttyMute(!opts.monitor);
	gh.confRead(opts.conf, (conf) => {
		srv3w.listen(conf);
	});
};

srv3w.listen = (conf) => {
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
