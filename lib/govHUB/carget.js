///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
///////////////////////////////////////////////////////////////////////////////@

process.env.PANDORA_BASEDIR ||
(process.env.PANDORA_BASEDIR = '/var/opt/pandora');

process.env.CHT_BASEDIR ||
(process.env.CHT_BASEDIR = '/var/opt/cht');

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const request = require('request');
const pd = require(process.env.PANDORA_BASEDIR + '/lib/pandora')(
	fs,
	path,
);

///////////////////////////////////////////////////////////////////////////////@
carget = {};

carget.confRead = (conf) => {
	pd.ttymsg('Reading configuration...');
	fs.readFile(conf, 'utf8', (err, data) => {
		if (err)
		throw err;

		carget.tokenGet(JSON.parse('{' + data + '}').oxima);
	});
};

carget.tokenGet = (conf) => {
	pd.ttymsg('\nRequesting connect token...');
	request({
		'url': conf.token.url,
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/form',
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		'form': {
			'grant_type': 'client_credentials',
			'response_type': 'code token',
			'client_id': conf.token.client.id,
			'client_secret': conf.token.client.secret,
			'scope': 'GovHub.GsisVehicle.Basic',
		},
	}, (err, rsp, body) => {
		if (err)
		throw err;

		conf.dataget.token = JSON.parse(body).access_token;

		if (conf.dataget.token)
		return carget.carRead(conf.dataget);

		pd.ttymsg();
		pd.errmsg('undefined access token');
		process.exit(2);
	})
};

carget.carRead = function(conf) {
	const clist = [];

	pd.ttymsg('\nReading cars...\n');
	readline.createInterface({
		'input': process.stdin,
		'crlfDelay': Infinity,
	}).on('line', function(line) {
		clist.push(line);

		if (carget.busy)
		return;

		carget.carGet(clist, conf);
	}).on('close', () => {
		carget.carGet(clist, conf, true);
	});
};

carget.carGet = (clist, conf, cont) => {
	let oxima = clist.shift();

	if (!oxima)
	return (carget.busy = false);

	carget.busy = true;
	pd.ttymsg('Requesting data for "' + oxima + '"...');

	request({
		'url': conf.url,
		'method': 'POST',
		'headers': {
			'Accept': 'text/plain',
			'Authorization': 'Bearer ' + conf.token,
			'Content-Type': 'application/json',
			'Content-Encoding': 'utf8',
		},
		'body': JSON.stringify({
			'auditRecord': {
				'auditUserId': conf.user.id,
				'auditUserIp': conf.user.ip,
				'auditTransactionId': 1,
				'auditProtocolNumber': 1,
				'auditProtocolDate': '2019-12-03',
			},
			'getVehicleInformationInputRecord': {
				'arithmosKykloforias': oxima,
				'requestDate': '2019-12-03',
			},
		}),
	}, (err, rsp, body) => {
		pd.ttymsg('\n');

		if (err)
		throw err;

		carget.carProcess(oxima, body);
		carget.busy = false;

		if (cont)
		carget.carGet(clist, conf, true);
	});
};

carget.carProcess = (oxima, data) => {
	try {
		data = JSON.parse(data);
	}
	catch (e) {
		pd.errmsg(oxima + ': request failed');
		return;
	}

	if (carget.carError(data))
	return;

	if (!data.hasOwnProperty('getVehicleInformationOutputRecord'))
	return pd.errmsg(oxima + ': no vehicle data returned');

	console.log(data.getVehicleInformationOutputRecord);
};

carget.carError = (data) => {
	if (!data.hasOwnProperty('errorRecord'))
	return;

	let err = data.errorRecord;
	let msg = '';

	if (err.hasOwnProperty('errorCode') && err.errorCode)
	msg += ': ' + err.errorCode;

	if (err.hasOwnProperty('errorDescr') && err.errorDescr)
	msg += ': ' + err.errorDescr;

	if (msg === '')
	return pd.errmsg(oxima + msg);
};

carget.confRead(process.env.CHT_BASEDIR + '/private/govHUBjson.cf');
