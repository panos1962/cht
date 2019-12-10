///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// govHUB.js -- JavaScript API σχετικό με ενέργειες που αφορούν στην πλατφόρμα
// "govHUB" του Υπουργείο Εσωτερικών.
//
// Στο παρόν ορίζουμε το "govHUB" module το οποίο αποτελεί wrapper του API
// που παρέχει η ομώνυμη πλατφόρμα. Η συνήθης χρήση του module είναι:
//
//	const chtBasedir = process.env.CHT_BASEDIR;
//	const readline = require('readline');
//	const gh = require(chtBasedir + '/lib/govHUB/api.js');
//
//	gh.confRead(chtBasedir + '/private/govHUB.cf`, (cfs) => {
//		gh.tokenGet(cfs, (conf) => {
//			readline.createInterface({
//				'input': process.stdin,
//			}).on('line', (line) => {
//				gh.carGet(line, conf);
//			});
//		});
//
///////////////////////////////////////////////////////////////////////////////@

const gh = {};
module.exports = gh;

///////////////////////////////////////////////////////////////////////////////@

// Η function "fromGovHUBData" δέχεται ως παράμετρο ένα target object, ένα
// source object και έναν πίνακα αντιστοίχισης πεδίων (map), και αντιγράφει
// τα τα πεδία του source object στο target object παραλλάζοντας τα ονόματα
// των πεδίων σύμφωνα με το δοθέν map. Πεδία τα οποία είναι undefined ή null
// δεν αντιγράφονται, ενώ όλα τα string πεδία γίνονται trim.
//
// Πεδία που δεν θέλουμε να αντιγραφούν φέρουν null τιμή στο map, ενώ πεδία
// που δεν είναι καταγεγραμμένα στο map εκτυπώνονται ως warnings στο standard
// error προκειμένου να τα εντάξουμε στο map όταν και αν αυτά εμφανιστούν στα
// δεδομένα που επιστρέφονται από την πλατφόρμα.

gh.fromGovHUBData = function(target, govHUBData, propMap) {
	for (let i in govHUBData) {
		if (!propMap.hasOwnProperty(i)) {
			console.error(i + ': not in "govHUB.oxima.propMap"');
			continue;
		}

		if (!propMap[i])
		continue;

		if (govHUBData[i] === undefined)
		continue;

		if (govHUBData[i] === null)
		continue;

		if (typeof(govHUBData[i]) === 'string') {
			target[propMap[i]] = govHUBData[i].trim();
			continue;
		}

		target[propMap[i]] = govHUBData[i];
	}

	return target;
};

///////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί ο ορισμός της κλάσης "katoxos" που απεικονίζει κατόχους οχημάτων.
// Τα πεδία κάθε κατόχου οχήματος είναι εν πολλοίς αυτά που παραλαμβάνουμε από
// την πλατφόρμα, αλλά μπορούμε να προσθέσουμε και άλλα πεδία που αφορούν σε
// στοιχεία που παρέχονται από τα δικά μας πληροφοριακά συστήματα.

gh.katoxos = function(x) {
	pd.objectInit(this, x);
}

gh.katoxos.prototype.fromGovHUB = function(govHUBData) {
	return gh.fromGovHUBData(this, govHUBData, {
		"afm": "afm",
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
	})
};

///////////////////////////////////////////////////////////////////////////////@

gh.oxima = function(x) {
	pd.objectInit(this, x);
}

gh.oxima.prototype.fromGovHUB = function(govHUBData) {
	return gh.fromGovHUBData(this, govHUBData, {
		"pinakida": "pinakida",
		"arithmosPlaisioy": "plesio",
		"marka": "marka",
		"xrwma": "xroma",
		"typosOxhmatos": "tipos",
		"katastashOxhmatos": "katastasi",
		"katoxoiList": "katoxos",
		"arithmosKykloforias": false,
	});
};

///////////////////////////////////////////////////////////////////////////////@

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const fs = require('fs');
const request = require('request');

///////////////////////////////////////////////////////////////////////////////@

// Η function "confRead" δέχεται ως παράμετρο το όνομα του configuration file
// το οποίο περιέχει τα στοιχεία επικοινωνίας μας με την πλατφόρμα "gh"·
// τα στοιχεία είναι γραμμένα ως ένα ενιαίο JSON object. Ως δεύτερη παράμετρο
// μπορούμε να περάσουμε μια callback function η οποία θα κληθεί με παράμετρο
// το configuration object· αν δεν καθοριστεί callback function, τότε απλώς
// εκτυπώνεται το configuration object στο standard output.

gh.confRead = (conf, callback) => {
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

// Για να επικοινωνήσουμε με την πλατφόρμα "gh" χρειαζόμαστε ένα access
// token· πρόκειται για ένα μεγάλο string που παράγεται από τον server τής
// παλτφόρμας και μας επιστρέφεται εφόσον κάνουμε την κατάλληλη κλήση με τα
// στοιχεία επικοινωνίας που διαβάσαμε από το configuration file. Η function
// δέχεται ως παράμετρο configuration JSON object, ενώ ως δεύτερη παράμετρο
// μπορούμε να περάσουμε callback function η οποία θα κληθεί με παράμετρο
// το configuration object εμπλουτισμένο με το νεοαποκτηθέν access token ως
// property "connect.accessToken". Αν δεν καθορίσουμε callback function, τότε
// η function απλώς εκτυπώνει το access token στο standard output.

gh.tokenGet = (conf, callback) => {
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

gh.txId = 0;

gh.carGet = (data, conf, callback) => {
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

	gh.txId++;
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
				'auditTransactionId': gh.txId,
			},
			'getVehicleInformationInputRecord': {
				'arithmosKykloforias': data.pinakida,
				'requestDate': data.date,
			},
		}),
	}, (err, rsp, body) => {
		pd.ttymsg().errchk(err);
		gh.carProcess(data, body, callback);
	});
};

gh.carProcess = (oxima, data, callback) => {
	try {
		data = JSON.parse(data);
	}
	catch (e) {
		pd.errmsg(oxima.pinakida + ': request failed');

		if (callback)
		callback();

		return;
	}

	if (gh.carError(oxima, data)) {
		if (callback)
		callback();

		return;
	}

	if (!data.hasOwnProperty('getVehicleInformationOutputRecord'))
	return pd.errmsg(oxima.pinakida + ': δεν επεστράφησαν στοιχεία οχήματος');

	let vehicle = data.getVehicleInformationOutputRecord;

	if (oxima.pinakida != vehicle.arithmosKykloforias)
	return pd.errmsg(oxima.pinakida + ': επεστράφη διαφορετικός αρ. κυκλοφορίας');

	oxima = (new gh.oxima()).fromGovHUB(vehicle);

	try {
		for (let i = 0; i < oxima.katoxos.length; i++)
		oxima.katoxos[i] = (new gh.katoxos()).fromGovHUB(oxima.katoxos[i]);
	}

	catch (e) {
		delete oxima.katoxos;
	}

	if (!callback)
	return console.log(oxima);

	callback(oxima);
};

gh.carError = (oxima, data) => {
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
