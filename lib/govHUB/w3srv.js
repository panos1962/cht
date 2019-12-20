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

const w3srv = {};
module.exports = w3srv;

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const http = require('http');
const qs = require('querystring');
const url = require('url');
const util = require('util');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const gh = require(`${pd.env('CHT_BASEDIR:=/var/opt/cht')}/lib/govHUB/api.js`);

w3srv.init = (opts) => {
	if (opts === undefined)
	opts = {};

	if (!opts.hasOwnProperty('conf'))
	opts.conf = `${process.env.CHT_BASEDIR}/private/govHUB.cf`;

	if (!opts.hasOwnProperty('maxBodyLength'))
	opts.maxBodyLength = 100000;

	if (!opts.hasOwnProperty('monitor'))
	opts.monitor = false;

	if (!opts.hasOwnProperty('verbose'))
	opts.verbose = true;

	pd.ttyMute(!opts.monitor);
	w3srv.opts = opts;

	gh.confRead(opts.conf, (conf) => {
		w3srv.opts.conf = conf;
		w3srv.createServer();
	});
};

w3srv.createServer = () => {
	w3srv.logmsg('Creating server');

	if (!w3srv.opts.conf.connect.w3srv.hasOwnProperty('portNumber'))
	w3srv.opts.conf.connect.w3srv.portNumber = 11123;

	http.createServer((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type', 'application/json');

		if (req.method === 'POST')
		w3srv.parsePostData(req, res)

		else
		w3srv.parseGetData(req, res);
	}).
	listen(w3srv.opts.conf.connect.w3srv.portNumber);

	w3srv.logmsg('Server listening at port ' + w3srv.opts.conf.connect.w3srv.portNumber);
	return w3srv;
};

w3srv.parsePostData = (req, res) => {
	let body = '';
	let data;

	req.
	on('data', (chunk) => {
		body += chunk.toString();

		if (body.length > w3srv.opts.maxBodyLength)
		req.connection.destroy();
	}).
	on('end', () => {
		try {
			data = qs.parse(body);
res.end('{"rsp": "POST"}');
		}

		catch (e) {
			res.end('{"error":"POST ERROR"}');
			return w3srv;
		}
	});

	return w3srv;
};

w3srv.parseGetData = (req, res) => {
	let data;

	try {
		data = url.parse(req.url, true).query;
res.end('{"rsp": "POST"}');
	}

	catch (e) {
		res.end('{"error":"GET ERROR"}');
		return w3srv;
	}

	return w3srv;
};

w3srv.verbose = () => {
	return w3srv.opts.verbose;
};

w3srv.silent = () => {
	return !w3srv.verbose();
};

w3srv.logmsg = (msg) => {
	if (w3srv.silent())
	return w3srv;

	console.log(pd.dateTime() + ': ' + msg);
	return w3srv;
};
