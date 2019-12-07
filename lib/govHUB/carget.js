///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
///////////////////////////////////////////////////////////////////////////////@

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(process.env.PANDORA_BASEDIR + '/lib/pandora.js')({
	"fs": require('fs'),
	"path": require('path'),
	"readline": require('readline'),
	"request": require('request'),
});

pd.env({
	'name': 'CHT_BASEDIR',
	'value': '/var/opt/cht',
});

///////////////////////////////////////////////////////////////////////////////@

carget = {};

carget.confRead = (conf) => {
	pd.ttymsg('Reading configuration...');
	pd.fs.readFile(conf, 'utf8', (err, data) => {
		pd.errchk(err);
		carget.tokenGet(JSON.parse('{' + data + '}').oxima);
	});
};

carget.tokenGet = (conf) => {
	pd.ttymsg('\nRequesting connect token...');
	pd.request.post({
		'url': conf.token.url,
		'headers': {
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		'form': {
			'grant_type': 'client_credentials',
			'client_id': conf.token.client.id,
			'client_secret': conf.token.client.secret,
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
	pd.readline.createInterface({
		'input': process.stdin,
		'crlfDelay': Infinity,
	}).on('line', function(line) {
		carget.carGet(line, conf);
	});
};

carget.txId = 0;

carget.carGet = (line, conf) => {
	var data;

	if (typeof(line) === 'string')
	data = {
		'oxima': line,
	};

	else {
		try {
			data = JSON.parse(line);
		}
		catch (e) {
			pd.errmsg(line + ': syntax error');
			return;
		}
	}

	if (!data.hasOwnProperty('oxima'))
	return pd.errmsg(line + ': missing "oxima"');

	data.oxima = data.oxima.toUpperCase();

	if (!data.hasOwnProperty('date'))
	data.date = (new Date()).toISOString().substring(0, 10);

	carget.txId++;
	pd.ttymsg('Requesting data for "' + data.oxima + '"...');
	pd.request.post({
		'url': conf.url,
		'headers': {
			'Authorization': 'Bearer ' + conf.token,
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify({
			'auditRecord': {
				'auditUserId': conf.user.id,
				'auditUserIp': conf.user.ip,
				'auditTransactionId': carget.txId,
			},
			'getVehicleInformationInputRecord': {
				'arithmosKykloforias': data.oxima,
				'requestDate': data.date,
			},
		}),
	}, (err, rsp, body) => {
		pd.ttymsg('\n').errchk(err);
		carget.carProcess(data, body);
console.log(data);
	});
};

carget.carProcess = (oxima, data) => {
	try {
		data = JSON.parse(data);
	}
	catch (e) {
		pd.errmsg(oxima.oxima + ': request failed');
		return;
	}

	if (carget.carError(oxima, data))
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
	return pd.errmsg(oxima.oxima + msg);
};

carget.confRead(pd.env('CHT_BASEDIR') + '/private/govHUB.cf');
