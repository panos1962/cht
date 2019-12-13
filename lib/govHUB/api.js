///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// govHUB.js -- JavaScript API σχετικό με ενέργειες που αφορούν στην πλατφόρμα
// "govHUB" του Υπουργείο Εσωτερικών.
//
///////////////////////////////////////////////////////////////////////////////@
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

// Η function "fromGovHUBData" δέχεται ως παραμέτρους ένα target object, ένα
// source object και έναν πίνακα αντιστοίχισης πεδίων (map), και αντιγράφει
// τα πεδία του source object στο target object παραλλάσσοντας τα ονόματα των
// πεδίων σύμφωνα με το δοθέν map. Πεδία τα οποία είναι undefined ή έχουν
// null τιμή δεν αντιγράφονται, ενώ όλα τα string πεδία γίνονται trim.
//
// Πεδία που δεν θέλουμε να αντιγραφούν φέρουν false τιμή στο map, ενώ πεδία
// που δεν είναι καταγεγραμμένα στο map εκτυπώνονται ως warnings στο standard
// error προκειμένου να τα εντάξουμε στο map όταν και αν αυτά εμφανιστούν στα
// δεδομένα που επιστρέφονται από την πλατφόρμα.

gh.fromGovHUBData = function(target, govHUBData, propMap) {
	for (let i in govHUBData) {
		if (!propMap.hasOwnProperty(i)) {
			console.error(i + ': WARNING: not in "govHUB.oxima.propMap"');
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
// την πλατφόρμα πλην όμως με διαφορετικές ονομασίες, ενώ μπορούμε να έχουμε
// και άλλα πεδία, όπως πεδία από τα τοπικά πληροφοριακά συστήματα, παράγωγα
// πεδία κοκ.

gh.katoxos = function(x) {
	pd.objectInit(this, x);
}

// Η μέθοδος "fromGovHUB" δέχεται ένα JSON object «κατόχου» όπως αυτό παρέχεται
// από την πλατφόρμα (μέσω του JSON object δεδομένων οχήματος) και θέτει
// αναλόγως τα πεδία τού ανά χείρας "katoxos" object.

gh.katoxos.prototype.fromGovHUB = function(govHUBData) {
	return gh.fromGovHUBData(this, govHUBData, {
		"afm": "afm",
		"percent": "pososto",
		"doy": "doi",
		"doyDesc": "doiDesc",
		"appelation": "eponimia",
		"legalStatusDesc": "morfi",
		"surname": "eponimo1",
		"secondSurname": "eponimo2",
		"firstName": "onoma",
		"fathersFirstName": "pname",
		"mothersFirstName": "mname",
		"address": "odos",
		"addressNo": "odar",
		"parZipCode": "tk",
		"parDescription": "perioxi",
		"katoxosErrorInfo": "errorInfo",
	}).
	eponimoFix().
	diefFix();
}

// Η μέθοδος "colvalSet" αποτελεί εργαλείο με το οποίο θέτουμε τιμή (παράμετρος
// "val") σε κάποιο πεδίο (παράμετρος "col") του ανά χείρας "katoxos" object.
// Αν η τιμή είναι κενή ή μηδενική, τότε διαγράφουμε το εν λόγω πεδίο.

gh.katoxos.prototype.colvalSet = function(col, val) {
	if (val) {
		this[col] = val;
		return this;
	}

	if (this.hasOwnProperty(col))
	delete this[col];

	return this;
};

gh.katoxos.prototype.eponimoSet = function(eponimo) {
	return this.colvalSet('eponimo', eponimo);
};

gh.katoxos.prototype.diefSet = function(dief) {
	return this.colvalSet('dief', dief);
};

gh.katoxos.prototype.eponimoFix = function() {
	let eponimo1 = this.eponimo1;
	let eponimo2 = this.eponimo2;

	if (this.hasOwnProperty('eponimo1'))
	delete this.eponimo1;

	if (this.hasOwnProperty('eponimo2'))
	delete this.eponimo2;

	if (eponimo1 && eponimo2)
	return this.eponimoSet(eponimo1 + '-' + eponimo2);

	if (eponimo1)
	return this.eponimoSet(eponimo1);

	return this.eponimoSet(eponimo2);
};

gh.katoxos.prototype.diefFix = function() {
	let odos = this.odos;
	let odar = this.odar;

	if (this.hasOwnProperty('odos'))
	delete this.odos;

	if (this.hasOwnProperty('odar'))
	delete this.odar;

	if (odos && odar)
	return this.diefSet(odos + ' ' + odar);

	if (odos)
	return this.diefSet(odos);

	return this.diefSet(odar);
};

gh.katoxos.prototype.posostoGet = function() {
	if (!this.hasOwnProperty('pososto'))
	return 0;

	if (isNaN(this.pososto))
	return 0;

	return this.pososto;
};

///////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί ο ορισμός της κλάσης "oxima" που απεικονίζει οχήματα. Τα πεδία
// ενός οχήματος είναι εν πολλοίς αυτά που παραλαμβάνουμε από την πλατφόρμα
// πλην όμως με διαφορετικές ονομασίες, ενώ μπορούμε να έχουμε και άλλα πεδία,
// όπως πεδία από τα τοπικά πληροφοριακά συστήματα, παράγωγα πεδία κλπ.

gh.oxima = function(x) {
	pd.objectInit(this, x);
}

gh.oxima.prototype.isKatoxos = function() {
	if (this.hasOwnProperty('katoxos'))
	return this.katoxos.length;

	return false;
};

gh.oxima.prototype.noKatoxos = function() {
	return !this.isKatoxos();
};

gh.oxima.prototype.katoxosWalk = function(callback) {
	let n = this.isKatoxos();

	if (!n)
	return this;

	for (let i = 0; i < n; i++)
	callback(this.katoxos[i], i);

	return this;
};

gh.oxima.prototype.totalPososto = function() {
	let tot = 0;

	this.katoxosWalk((katoxos) => {
		tot += katoxos.posostoGet();
	});

	return tot;
};

// Η μέθοδος "fromGovHUB" δέχεται ένα JSON object «οχήματος» όπως αυτό
// παρέχεται από την πλατφόρμα, και θέτει αναλόγως τα πεδία του ανά χείρας
// "oxima" object.

gh.oxima.prototype.fromGovHUB = function(govHUBData) {
	gh.fromGovHUBData(this, govHUBData, {
		"arithmosKykloforias": "pinakida",
		"arithmosPlaisioy": "sasinum",
		"marka": "marka",
		"xrwma": "xroma",
		"typosOxhmatos": "tipos",
		"katastashOxhmatos": "katastasi",
		"katoxoiList": "katoxos",
	});

	return this.katoxosWalk((govHUBData, i) => {
		this.katoxos[i] = (new gh.katoxos()).fromGovHUB(govHUBData);
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
// το οποίο περιέχει τα στοιχεία επικοινωνίας μας με την πλατφόρμα "govHUB"·
// τα στοιχεία είναι γραμμένα ως ένα ενιαίο JSON object. Ως δεύτερη παράμετρο
// μπορούμε να περάσουμε μια callback function η οποία θα κληθεί με παράμετρο
// το configuration object· αν δεν καθοριστεί callback function, τότε απλώς
// εκτυπώνεται το configuration object στο standard output.

gh.confRead = (conf, callback) => {
	pd.ttymsg('Reading configuration...\n');
	fs.readFile(conf, 'utf8', (err, conf) => {
		pd.errchk(err);

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

gh.tokenGet = (conf, callback) => {
	const connect = conf.connect;

	pd.ttymsg('Requesting connect token...\n');
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
		pd.errchk(err);
		conf.connect.accessToken = JSON.parse(body).access_token;

		if (!conf.connect.accessToken)
		throw 'govHUB: undefined access token';

		if (!callback)
		return console.log(conf.connect.accessToken);

		callback(conf);
	})
};

///////////////////////////////////////////////////////////////////////////////@

gh.txId = 0;

//	input {
//		conf: {},
//		reqData: {
//			oxima: "xxx",
//			date: "xxx",
//		},
//		rawData: [ input as string for error reporting ],
//		opts: {}
//	}

gh.carGet = (rsp, callback) => {
	if (!callback)
	callback = (x) => {
		console.log(x);
	};

	var input = rsp.input;

	if (!input.hasOwnProperty('reqData')) {
		rsp.error = "missing request key data";
		callback(rsp);
		return;
	}

	if (!input.reqData.hasOwnProperty('oxima')) {
		rsp.error = "missing oxima";
		callback(rsp);
		return;
	}

	// Ακολουθεί φιξάρισμα του αριθμού κυκλοφορίας οχήματος. Ουσιαστικά
	// γίνεται μετατροπή των γραμμάτων σε κεφαλαία και παρεμπιπτόντως
	// ελέγχεται αν είναι string.

	try {
		input.reqData.oxima = input.reqData.oxima.toString().toUpperCase();
	}

	catch (e) {
		rsp.error = "invalid 'oxima' property value";
		callback(rsp);
		return;
	}

	// Το δεύτερο συστατικό των αιτημάτων αναζήτησης στοιχείων οχημάτων
	// και κατόχων είναι η ημερομηνία για την οποία αναζήτούμε στοιχεία.
	// Αν δεν καθοριστεί υποτίθεται η τρέχουσα ημερομηνία.

	if (!input.reqData.hasOwnProperty('date'))
	input.reqData.date = (new Date()).toISOString().substring(0, 10);

	else if ((typeof(input.reqData.date) === 'object') &&
		(input.reqData.date instanceof Date))
	input.reqData.date = input.reqData.date.toISOString().substring(0, 10);

	else if (typeof(input.reqData.date) !== 'string') {
		rsp.error = 'invalid date';
		callback(rsp);
		return;
	}

	gh.txId++;

	pd.ttymsg('Requesting data for "' + input.reqData.oxima + '"...\n');
	request.post({
		'url': input.conf.vehicleInfo.url,
		'headers': {
			'Authorization': 'Bearer ' + input.conf.connect.accessToken,
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify({
			'auditRecord': {
				'auditUserId': input.conf.userPool[0],
				'auditUserIp': input.conf.ipPool[0],
				'auditTransactionId': gh.txId,
			},
			'getVehicleInformationInputRecord': {
				'arithmosKykloforias': input.reqData.oxima,
				'requestDate': input.reqData.date,
			},
		}),
	}, (err, response, body) => {
		pd.errchk(err);

		try {
			body = JSON.parse(body);
		}

		catch (e) {
			rsp.error = 'invalid returned data';
			callback(rsp);
			return;
		}

		if (!body.hasOwnProperty('getVehicleInformationOutputRecord')) {
			rsp.error = 'δεν επεστράφησαν στοιχεία οχήματος';
			callback(rsp);
			return;
		}

		if (body.hasOwnProperty('errorRecord')) {
			let err = '';

			if (body.errorRecord.hasOwnProperty('errorCode'))
			err = body.errorRecord.errorCode;

			if (body.errorRecord.hasOwnProperty('errorDescr')) {
				if (err)
				err += ': ';

				err += body.errorRecord.errorDescr;
			}

			if (err) {
				rsp.error = err;
				callback(rsp);
				return;
			}
		}

		let oxima = body.getVehicleInformationOutputRecord;

		if (oxima.arithmosKykloforias !== input.reqData.oxima) {
			rsp.error = 'επεστράφη διαφορετικός αρ. κυκλοφορίας';
			callback(rsp);
			return;
		}

		try {
			oxima = (new gh.oxima()).fromGovHUB(oxima);
		}

		catch (e) {
			console.error(e);
			rsp.error = 'σφάλμα μετατροπής δεδομένων οχήματος';
			callback(rsp);
			return;
		}

		if (oxima.totalPososto() !== 100) {
			rsp.error = 'συνολικό ποσοστό <> 100';
			callback(rsp);
			return;
		}

		rsp.oxima = oxima;
		callback(rsp);
	});
};
