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
		return w3srv.reserr(res, 'Ακαθόριστη διαδικασία αναζήτησης')

		if (!w3srv.anazitisi.hasOwnProperty(data.idos))
		return w3srv.reserr(res, data.idos + ': άγνωστη διαδικασία αναζήτησης')

		w3srv.anazitisi[data.idos](res, data);
	});

	return w3srv;
};

w3srv.anazitisi = {};

w3srv.anazitisi.oxima = (res, data, noMore) => {
	let keyData = {};

	if (!data.oxima)
	return w3srv.reserr(res, 'Ακαθόριστος αριθμός κυκλοφορίας οχήματος');

	keyData.oxima = data.oxima;

	if (data.imerominia)
	keyData.date = data.imerominia;

	if (w3srv.oximaNoToken()) {
		if (noMore)
		return w3srv.reserr(res, 'Άρνηση πρόσβασης αναζήτησης στοιχείων οχήματος/κατόχων');

		w3srv.logmsg('Αίτημα πρόσβασης αναζήτησης στοιχείων οχήματος/κατόχων');
		gh.tokenGet(w3srv.opts.conf, 'oxima', (conf) => {
			w3srv.opts.oximaToken = conf.connect.accessToken;
			w3srv.anazitisi.oxima(res, data, true);
		});

		return w3srv;
	}

	w3srv.logmsg(keyData.oxima + ': αναζήτηση στοιχείων οχήματος/κατόχων');
	w3srv.opts.conf.connect.accessToken = w3srv.opts.oximaToken;
	gh.oximaGet({
		'conf': w3srv.opts.conf,
		'keyData': keyData,
		'rawData': data.info,
	}, (x) => {
		res.end(JSON.stringify(x.oxima));
	});

	return w3srv;
};

w3srv.oximaNoToken = () => {
	if (!w3srv.opts.hasOwnProperty('oximaToken'))
	return true;

	return false;
};

w3srv.anazitisi.prosopo = (res, data, noMore) => {
	let keyData = {};

	if (!data.afm)
	return w3srv.reserr(res, 'Ακαθόριστος ΑΦΜ');

	keyData.afm = data.afm;

	if (w3srv.prosopoNoToken()) {
		if (noMore)
		return w3srv.reserr(res, 'Άρνηση πρόσβασης αναζήτησης με βάση το ΑΦΜ');

		w3srv.logmsg('Αίτημα πρόσβασης αναζήτησης με βάση το ΑΦΜ');
		gh.tokenGet(w3srv.opts.conf, 'prosopo', (conf) => {
			w3srv.opts.prosopoToken = conf.connect.accessToken;
			w3srv.anazitisi.prosopo(res, data, true);
		});

		return w3srv;
	}

	w3srv.logmsg(keyData.afm + ': αναζήτηση στοιχείων με βάση το ΑΦΜ');
	w3srv.opts.conf.connect.accessToken = w3srv.opts.prosopoToken;
	gh.afmGet({
		'conf': w3srv.opts.conf,
		'keyData': keyData,
		'rawData': data.info,
	}, (x) => {
		res.end(JSON.stringify(x.prosopo));
	});

	return w3srv;
};

w3srv.prosopoNoToken = () => {
	if (!w3srv.opts.hasOwnProperty('prosopoToken'))
	return true;

	return false;
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
