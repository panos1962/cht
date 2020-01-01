///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// 3wsrv.js -- node web server που εξυπηρετεί αιτήματα αναζήτησης στοιχείων
// οχημάτων/κατόχων μέσω αριθμού κυκλοφορίας οχήματος, και στοιχείων φυσικών
// και νομικών προσώπων.
//
// Updated: 2019-12-25
// Updated: 2019-12-20
// Updated: 2019-12-19
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const w3srv = {};
module.exports = w3srv;

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

if (!process.env.CHT_BASEDIR)
process.env.CHT_BASEDIR = '/var/opt/cht';

const http = require('http');
const qs = require('querystring');
const url = require('url');
const util = require('util');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraServer.js`);
const gh = require(`${process.env.CHT_BASEDIR}/lib/govHUB/apiServer.js`);

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

	try {
		if (!w3srv.opts.conf.connect.w3srv.hasOwnProperty('portNumber'))
		w3srv.opts.conf.connect.w3srv.portNumber = 12345;
	}

	catch (e) {
		throw new Error('configuration file error: unspecified port number');
	}

	http.createServer((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type', 'application/json; charset=utf8');
		w3srv.parsePostData(req, res)
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
		}

		catch (e) {
			res.end('"error":"POST ERROR"');
			return w3srv;
		}

		if (!data.idos)
		return w3srv.reserr(res, 'ακαθόριστη διαδικασία αναζήτησης')

		if (!w3srv.anazitisi.hasOwnProperty(data.idos))
		return w3srv.reserr(res, data.idos + ': άγνωστη διαδικασία αναζήτησης')

		w3srv.anazitisi[data.idos](res, data);
	});

	return w3srv;
};

w3srv.anazitisi = {};

w3srv.anazitisi.oxima = (res, data, noMore) => {
	let keyData = {};

	if (!data.key)
	return w3srv.reserr(res, 'ακαθόριστος αριθμός κυκλοφορίας οχήματος');

	keyData.oxima = data.key;

	if (data.imerominia)
	keyData.date = data.imerominia;

	w3srv.logmsg(keyData.oxima + ': αναζήτηση στοιχείων οχήματος/κατόχων');
	gh.oximaGet({
		'conf': w3srv.opts.conf,
		'keyData': keyData,
		'rawData': data.info,
	}, (x) => {
		let p = {};

		p.idos = 'oxima';

		if (x.hasOwnProperty('oxima'))
		p.data = x.oxima;

		if (x.hasOwnProperty('error'))
		p.error = x.error;

		res.end(JSON.stringify(p));
	});

	return w3srv;
};

w3srv.anazitisi.prosopo = (res, data, noMore) => {
	let keyData = {};

	if (!data.key)
	return w3srv.reserr(res, 'ακαθόριστος ΑΦΜ');

	keyData.afm = data.key;

	w3srv.logmsg(keyData.afm + ': αναζήτηση στοιχείων με βάση το ΑΦΜ');
	gh.afmGet({
		'conf': w3srv.opts.conf,
		'keyData': keyData,
		'rawData': data.info,
	}, (x) => {
		let p = {};

		p.idos = 'prosopo';

		if (x.hasOwnProperty('prosopo'))
		p.data = x.prosopo;

		if (x.hasOwnProperty('error'))
		p.error = x.error;

		res.end(JSON.stringify(p));
	});

	return w3srv;
};

w3srv.reserr = (res, msg) => {
	res.end(JSON.stringify({
		'error': msg,
	}));

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
