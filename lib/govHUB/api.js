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
//		govHUB.tokenGet(cfs, (conf) => {
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

govHUB.katoxos = function(x) {
	pd.objectInit(this, x);
}

govHUB.katoxos.propMap = {
	"percent": "pososto",
	"doy": "doi",
	"doyDesc": "doiDesc",
	"appelation": "eponimia",
	"legalStatusDesc": "morfi",
	"surname": "eponimo",
	"secondSurname": "eponimo2",
	"firstName": "onoma",
	"fathersFirstName": "patronimo",
	"mothersFirstName": "mitronimo",
	"address": "odos",
	"addressNo": "arithmos",
	"parZipCode": "tk",
	"parDescription": "perioxi",
	"katoxosErrorInfo": "errorInfo",
};

govHUB.katoxos.prototype.govHUBFix = function() {
	for (let i in this) {
		if (typeof(this[i]) === 'string')
		this[i] = this[i].trim();

		if (govHUB.katoxos.propMap.hasOwnProperty(i)) {
			this[govHUB.katoxos.propMap[i]] = this[i];
			delete this[i];
		}
	}

	return this;
};

///////////////////////////////////////////////////////////////////////////////@

govHUB.oxima = function(x) {
	pd.objectInit(this, x);
}

govHUB.oxima.propMap = {
	"pinakida": "pinakida",
	"arithmosPlaisioy": "plesio",
	"marka": "marka",
	"xrwma": "xroma",
	"typosOxhmatos": "tipos",
	"katastashOxhmatos": "katastasi",
	"katoxoiList": "katoxos",
};

govHUB.oxima.prototype.govHUBFix = function() {
	for (let i in this) {
		if (!govHUB.oxima.propMap.hasOwnProperty(i)) {
			delete this[i];
			continue;
		}

		if (this[i] === null) {
			delete this[i];
			continue;
		}

		if (typeof(this[i]) === 'string')
		this[i] = this[i].trim();

		if (govHUB.oxima.propMap[i] === i)
		continue;

		this[govHUB.oxima.propMap[i]] = this[i];
		delete this[i];
	}

	return this;
};

///////////////////////////////////////////////////////////////////////////////@

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const fs = require('fs');
const request = require('request');

///////////////////////////////////////////////////////////////////////////////@

// Η function "confRead" δέχεται ως παράμετρο το όνομα του configuration file
// το οποίο περιέχει τα στοιχεία επικοινωνίας μας με την πλατφόρμα "govHUB"·
// τα στοιχεία είναι γραμμένα ως ένα ενιαίο JSON object. Ως δεύτερη παράμετρο
// μπορούμε να περάσουμε μια callback function η οποία θα κληθεί με παράμετρο
// το configuration object· αν δεν καθοριστεί callback function, τότε απλώς
// εκτυπώνεται το configuration object στο standard output.

govHUB.confRead = (conf, callback) => {
	pd.ttymsg('Reading configuration...');
	fs.readFile(conf, 'utf8', (err, conf) => {
		pd.ttymsg().errchk(err);

		try {
			conf = JSON.parse(conf);
		} catch (e) {
			pd.errchk(e);
		}

		if (!callback)
		return console.log(conf);

		callback(conf);
	});
};

// Για να επικοινωνήσουμε με την πλατφόρμα "govHUB" χρειαζόμαστε ένα access
// token· πρόκειται για ένα μεγάλο string που παράγεται από τον server τής
// παλτφόρμας και μας επιστρέφεται εφόσον κάνουμε την κατάλληλη κλήση με τα
// στοιχεία επικοινωνίας που διαβάσαμε από το configuration file. Η function
// δέχεται ως παράμετρο configuration JSON object, ενώ ως δεύτερη παράμετρο
// μπορούμε να περάσουμε callback function η οποία θα κληθεί με παράμετρο
// το configuration object εμπλουτισμένο με το νεοαποκτηθέν access token ως
// property "connect.accessToken". Αν δεν καθορίσουμε callback function, τότε
// η function απλώς εκτυπώνει το access token στο standard output.

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
		conf.connect.accessToken = JSON.parse(body).access_token;

		if (!conf.connect.accessToken)
		throw 'undefined access token';

		if (!callback)
		return console.log(conf.connect.accessToken);

		callback(conf);
	})
};

govHUB.txId = 0;

govHUB.carGet = (data, conf, callback) => {
	if (!data.hasOwnProperty('oxima'))
	return pd.errmsg(line + ': missing "oxima"');

	try {
		data.pinakida = data.oxima.toString().toUpperCase();
	}

	catch (e) {
		return pd.errmsg(line + ': invalid "oxima" value');
	}

	if (!data.hasOwnProperty('date'))
	data.date = (new Date()).toISOString().substring(0, 10);

	else if ((typeof(data.date) === 'object') &&
		(data.date instanceof Date))
	data.date = data.date.toISOString().substring(0, 10);

	else if (typeof(data.date) !== 'string')
	return pd.errmsg(line + ': invalid "date" value');

	govHUB.txId++;
	pd.ttymsg('Requesting data for "' + data.pinakida + '"...');
	request.post({
		'url': conf.vehicleInfo.url,
		'headers': {
			'Authorization': 'Bearer ' + conf.connect.accessToken,
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify({
			'auditRecord': {
				'auditUserId': conf.userPool[0],
				'auditUserIp': conf.ipPool[0],
				'auditTransactionId': govHUB.txId,
			},
			'getVehicleInformationInputRecord': {
				'arithmosKykloforias': data.pinakida,
				'requestDate': data.date,
			},
		}),
	}, (err, rsp, body) => {
		pd.ttymsg().errchk(err);
		govHUB.carProcess(data, body, callback);
	});
};

govHUB.carProcess = (oxima, data, callback) => {
	try {
		data = JSON.parse(data);
	}
	catch (e) {
		pd.errmsg(oxima.pinakida + ': request failed');

		if (callback)
		callback();

		return;
	}

	if (govHUB.carError(oxima, data)) {
		if (callback)
		callback();

		return;
	}

	if (!data.hasOwnProperty('getVehicleInformationOutputRecord'))
	return pd.errmsg(oxima.pinakida + ': δεν επεστράφησαν στοιχεία οχήματος');

	let vehicle = data.getVehicleInformationOutputRecord;

	if (oxima.pinakida != vehicle.arithmosKykloforias)
	return pd.errmsg(oxima.pinakida + ': επεστράφη διαφορετικός αρ. κυκλοφορίας');

	oxima = (new govHUB.oxima(vehicle)).govHUBFix();

	try {
		for (let i = 0; i < oxima.katoxos.length; i++)
		oxima.katoxos[i] = (new govHUB.katoxos(oxima.katoxos[i])).govHUBFix();
	}

	catch (e) {
		delete oxima.katoxos;
	}

	if (!callback)
	return console.log(oxima);

	callback(oxima);
};

govHUB.carError = (oxima, data) => {
	if (!data.hasOwnProperty('errorRecord'))
	return false;

	var err = data.errorRecord;
	var msg = '';

	if (err.hasOwnProperty('errorCode') && err.errorCode)
	msg += ': ' + err.errorCode;

	if (err.hasOwnProperty('errorDescr') && err.errorDescr)
	msg += ': ' + err.errorDescr;

	if (msg === '')
	return false;

	pd.errmsg(oxima.pinakida + msg);
	return true;
};
