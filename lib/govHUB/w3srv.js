///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// 3wsrv.js -- node web server που εξυπηρετεί αιτήματα αναζήτησης στοιχείων
// οχημάτων/κατόχων μέσω αριθμού κυκλοφορίας οχήματος, και στοιχείων φυσικών
// και νομικών προσώπων.
//
// Updated: 2021-03-07
// Updated: 2019-12-25
// Updated: 2019-12-20
// Updated: 2019-12-19
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const w3srv = {};
module.exports = w3srv;

const qs = require('querystring');
const url = require('url');
const util = require('util');
const pd = require('../../mnt/pandora/lib/pandoraServer.js');
const gh = require('./apiServer.js');

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

	const connOpts = w3srv.opts.conf.connect.w3srv;

	try {
		if (!connOpts.hasOwnProperty('protocol'))
		connOpts.protocol = 'http';

		if (!connOpts.hasOwnProperty('portNumber'))
		connOpts.portNumber = 8001;
	}

	catch (e) {
		throw new Error('configuration file error: unspecified port number');
	}

	switch (connOpts.protocol) {
	case 'https':
		const ssldir = `${process.env.CHT_BASEDIR}/private/ssl`;
		const fs = require('fs');
		require('https').createServer({
			'key': fs.readFileSync(ssldir + '/key.pem'),
			'cert': fs.readFileSync(ssldir + '/cert.pem')
		}, w3srv.processRequest).
		listen(connOpts.portNumber);
		break;
	default:
		require('http').createServer(w3srv.processRequest).
		listen(connOpts.portNumber);
		break;
	}

	w3srv.logmsg('Server listening at port ' + connOpts.portNumber);
	return w3srv;
};

w3srv.processRequest = (req, res) => {
	let body = '';
	let data;

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json; charset=utf8');

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

		if (!data.sesami)
		return w3srv.reserr(res, 'ακαθόριστο κλειδί ασφαλείας');

		if (data.sesami !== w3srv.opts.conf.connect.w3srv.sesami)
		return w3srv.reserr(res, 'λανθασμένο κλειδί ασφαλείας');

		if (!data.idos)
		return w3srv.reserr(res, 'ακαθόριστη διαδικασία αναζήτησης')

		if (!w3srv.anazitisi.hasOwnProperty(data.idos))
		return w3srv.reserr(res, data.idos + ': άγνωστη διαδικασία αναζήτησης')

		w3srv.anazitisi[data.idos](res, data);
	});
};

w3srv.anazitisi = {};

w3srv.anazitisi.oxima = (res, data, noMore) => {
	let keyData = {};

	if (!data.key)
	return w3srv.reserr(res, 'ακαθόριστος αριθμός κυκλοφορίας οχήματος');

	keyData.oxima = data.key;

	if (data.imerominia)
	keyData.date = data.imerominia;

	let msg = keyData.oxima;

	if (keyData.date)
	msg += '@' + keyData.date;

	if (data.origin)
	msg += ':' + data.origin;

	msg += ': αναζήτηση στοιχείων οχήματος/κατόχων';
	w3srv.logmsg(msg);

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
