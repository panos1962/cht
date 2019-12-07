///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
///////////////////////////////////////////////////////////////////////////////@

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const request = require('request');

if (process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(process.env.PANDORA_BASEDIR + '/lib/pandora')(
	fs,
	path,
);

pd.envchk('CHT_BASEDIR', '/var/opt/cht');

///////////////////////////////////////////////////////////////////////////////@

carget = {};

carget.confRead = (conf) => {
	pd.ttymsg('Reading configuration...');
	fs.readFile(conf, 'utf8', (err, data) => {
		pd.errchk(err);
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
		pd.errchk(err);
		conf.dataget.token = JSON.parse(body).access_token;

		if (conf.dataget.token)
		return carget.carRead(conf.dataget);

		pd.ttymsg();
		pd.errmsg('undefined access token');
		process.exit(2);
	})
};

carget.carRead = function(conf) {
	pd.ttymsg('\nReading cars...\n');
	readline.createInterface({
		'input': process.stdin,
		'crlfDelay': Infinity,
	}).on('line', function(line) {
		carget.carGet(line, conf);
	});
};

carget.carGet = (line, conf) => {
	var data;

	if (typeof(line) === 'string')
	data = {
		'oxima': line,
	};

	try {
		data = JSON.parse(line);
	}
	catch (e) {
		pd.errmsg(line + ': syntax error');
		return;
	}

	if (!data.hasOwnProperty('oxima'))
	return pd.errmsg(line + ': missing "oxima"');

	if (!data.hasOwnProperty('date'))
	data.date = (new Date()).toISOString().substring(0, 10);

	pd.ttymsg('Requesting data for "' + data.oxima + '"...');
	const req = request({
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
				'arithmosKykloforias': data.oxima,
				'requestDate': data.date,
			},
		}),
	}, (err, rsp, body) => {
		pd.ttymsg('\n').errchk(err);
		carget.carProcess(data.oxima, body);
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

	if (carget.carError(oxima, data))
	return;

	if (!data.hasOwnProperty('getVehicleInformationOutputRecord'))
	return pd.errmsg(oxima + ': no vehicle data returned');

	console.log(data.getVehicleInformationOutputRecord);
};

carget.carError = (oxima, data) => {
	if (!data.hasOwnProperty('errorRecord'))
	return;

	let err = data.errorRecord;
	let msg = '';

	if (err.hasOwnProperty('errorCode') && err.errorCode)
	msg += ': ' + err.errorCode;

	if (err.hasOwnProperty('errorDescr') && err.errorDescr)
	msg += ': ' + err.errorDescr;

	if (msg !== '')
	return pd.errmsg(oxima + msg);
};

carget.confRead(pd.envget('CHT_BASEDIR') + '/private/govHUB.cf');
