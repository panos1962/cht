///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
///////////////////////////////////////////////////////////////////////////////@
//
// Στο παρόν module ορίζουμε το "govHUB" module το οποίο αποτελεί wrapper του
// API που παρέχει η ομώνυμη πλατφόρμα. Η συνήθης χρήση του module είναι:
//
//	const chtBasedir = process.env.CHT_BASEDIR;
//	const readline = require('readline');
//	const govHUB = require(chtBasedir + '/lib/govHUB/api.js');
//
//	govHUB.confRead(chtBasedir + '/private/govHUB.cf`, (cfs) => {
//		govHUB.tokenGet(JSON.parse('{' + cfs + '}'), (conf) => {
//			readline.createInterface({
//				'input': process.stdin,
//			}).on('line', (line) => {
//				govHUB.carGet(line, conf);
//			});
//		});
///////////////////////////////////////////////////////////////////////////////@

const govHUB = {};
module.exports = govHUB;

///////////////////////////////////////////////////////////////////////////////@

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const fs = require('fs');
const request = require('request');

///////////////////////////////////////////////////////////////////////////////@

govHUB.confRead = (conf, callback) => {
	pd.ttymsg('Reading configuration...');
	fs.readFile(conf, 'utf8', (err, conf) => {
		pd.ttymsg().errchk(err);

		if (!callback)
		return console.log(conf);

		callback(conf);
	});
};

govHUB.tokenGet = (conf, callback) => {
	const connect = conf.connect;

	pd.ttymsg('Requesting connect token...');
	request.post({
		'url': connect.url,
		'headers': {
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		'form': {
			'grant_type': 'client_credentials',
			'client_id': connect.clientPool[0].id,
			'client_secret': connect.clientPool[0].secret,
		},
	}, (err, rsp, body) => {
		pd.ttymsg().errchk(err);
		conf.vehicleInfo.accessToken = JSON.parse(body).access_token;

		if (!conf.vehicleInfo.accessToken)
		throw 'undefined access token';

		if (!callback)
		return console.log(conf.vehicleInfo.accessToken);

		callback(conf);
	})
};

govHUB.txId = 0;

govHUB.carGet = (data, conf, callback) => {
	if (!data.hasOwnProperty('oxima'))
	return pd.errmsg(line + ': missing "oxima"');

	data.oxima = data.oxima.toUpperCase();

	if (!data.hasOwnProperty('date'))
	data.date = (new Date()).toISOString().substring(0, 10);

	govHUB.txId++;
	pd.ttymsg('Requesting data for "' + data.oxima + '"...');
	request.post({
		'url': conf.vehicleInfo.url,
		'headers': {
			'Authorization': 'Bearer ' + conf.vehicleInfo.accessToken,
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify({
			'auditRecord': {
				'auditUserId': conf.userPool[0],
				'auditUserIp': conf.ipPool[0],
				'auditTransactionId': govHUB.txId,
			},
			'getVehicleInformationInputRecord': {
				'arithmosKykloforias': data.oxima,
				'requestDate': data.date,
			},
		}),
	}, (err, rsp, body) => {
process.stdout.cork();
		pd.ttymsg().errchk(err);
		govHUB.carProcess(data, body, callback);
process.stdout.write('xxxx\n');
process.nextTick(() => process.stdout.uncork());
	});
};

govHUB.carProcess = (oxima, data, callback) => {
	try {
		data = JSON.parse(data);
	}
	catch (e) {
		pd.errmsg(oxima.oxima + ': request failed');
		return;
	}

	if (govHUB.carError(oxima, data))
	return;

	if (!data.hasOwnProperty('getVehicleInformationOutputRecord'))
	return pd.errmsg(oxima.oxima + ': δεν επεστράφησαν στοιχεία οχήματος');

	if (oxima.oxima != data.getVehicleInformationOutputRecord.arithmosKykloforias)
	return pd.errmsg(oxima.oxima + ': επεστράφη διαφορετικός αρ. κυκλοφορίας');

	oxima.marka = data.getVehicleInformationOutputRecord.marka;
	oxima.xroma = data.getVehicleInformationOutputRecord.xrwma;
	oxima.tipos = data.getVehicleInformationOutputRecord.typosOxhmatos;
	oxima.katastasi = data.getVehicleInformationOutputRecord.katastashOxhmatos;
	oxima.katoxos = data.getVehicleInformationOutputRecord.katoxoiList;

	if (!callback)
	return console.log(oxima);

	callback(oxima);
};

govHUB.carError = (oxima, data) => {
	if (!data.hasOwnProperty('errorRecord'))
	return;

	var err = data.errorRecord;
	var msg = '';

	if (err.hasOwnProperty('errorCode') && err.errorCode)
	msg += ': ' + err.errorCode;

	if (err.hasOwnProperty('errorDescr') && err.errorDescr)
	msg += ': ' + err.errorDescr;

	if (msg === '')
	return;

	pd.errmsg(oxima.oxima + msg);
console.log("ERROR");
};
