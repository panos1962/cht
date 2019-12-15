///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// govHUB.js -- JavaScript API σχετικό με ενέργειες που αφορούν στην πλατφόρμα
// "govHUB" του Υπουργείο Εσωτερικών, η οποία στο παρόν θα αναφέρεται και απλώς
// ως «πλατφόρμα».
//
// Last update: 2019-12-15
//
///////////////////////////////////////////////////////////////////////////////@
//
// Στο παρόν ορίζουμε το "govHUB" module το οποίο αποτελεί wrapper του API
// που παρέχει η ομώνυμη πλατφόρμα. Η συνήθης χρήση του module είναι:
//
//	const chtBasedir = process.env.CHT_BASEDIR;
//	const lblr = require('line-by-line');
//	const gh = require(`${chtBasedir}/lib/govHUB/api.js`);
//
//	gh.confRead(`${chtBasedir}/private/govHUB.cf`, (cfs) => {
//		gh.tokenGet(cfs, (conf) => {
//			const rl = new lblr(process.stdin, {
//				'ecnoding': 'utf8',
//				'skipEmptyLines': true,
//			}).on('line', ({
//				rl.pause();
//				carget.processInput({
//					'conf': conf,
//					'rawData': line,
//					'reqData': {},
//				},
//			}, (x) => {
//				delete x.conf;
//				carget.processOutput(x);
//				rl.resume();
//			});
//		});
//	});
//
///////////////////////////////////////////////////////////////////////////////@

const gh = {};
module.exports = gh;

gh.opts = {};

///////////////////////////////////////////////////////////////////////////////@

gh.debugSet = (x) => {
	if (x === undefined)
	x = true;

	gh.opts.debug = x;
	return gh;
};

gh.debugSet(false);

gh.debugOn = () => {
	return gh.opts.debug;
};

gh.debugOff = () => {
	return !gh.debugOn();
};

gh.debug = (msg, stream) => {
	if (gh.debugOff())
	return gh;

	pd.debug(msg, stream);
	return gh;
};

///////////////////////////////////////////////////////////////////////////////@

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const util = require('util');
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

		// Συνήθως η callback function εκκινεί με τη διασφάλιση του
		// απαραίτητου access token προκειμένου να καταστεί δυνατή
		// οποιαδήποτε αναζήτηση στοιχείων μέσω της πλατφόρμας
		// "govHUB", συνεπώς κάπου στην αρχή της callback function
		// θα πρέπει να καλείται η function "tokenGet" (βλ.παρακάτω).

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

gh.carGetError = (rsp, msg, callback) => {
	rsp.error = msg;
	callback(rsp);
};

gh.validResponseProperties = {
	"getVehicleInformationOutputRecord": true,
	"callSequenceId": false,
	"callSequenceIdSpecified": false,
	"callSequenceDate": false,
	"callSequenceDateSpecified": false,
	"errorRecord": true,

	"errors": true,
	"type": false,
	"title": true,
	"status": false,
	"traceId": false,
};

gh.carGetResponseCheck = (rsp, body, callback) => {
	let errMsg = undefined;
	let propSM;

	if (gh.debugOn())
	gh.debug(util.inspect(body, {
		'depth': Infinity,
		'compact': false,
		'colors': process.stderr.isTTY,
	}));

	if (body.hasOwnProperty('errors')) {
		gh.carGetError(rsp, 'response errors encountered', callback);
		return true;
	}

	for (let i in body) {
		if (gh.validResponseProperties.hasOwnProperty(i))
		continue;

		if (errMsg) {
			errMsg += ', ' + i;
			propSM = "properties";
		}

		else {
			errMsg = rsp.rawData + ': WARNING: ' + i;
			propSM = "property";
		}
	}

	if (!errMsg)
	return false;

	errMsg += ': unexpected ' + propSM;
	gh.carGetError(rsp, errMsg, callback);
	return true;
}

gh.carGetResponseError = (rsp, body, callback) => {
	if (!body.hasOwnProperty('errorRecord'))
	return false;

	var errRec = body.errorRecord;
	var errMsg;

	if (errRec.hasOwnProperty('errorCode') && errRec.errorCode)
	errMsg = errRec.errorCode;

	if (errRec.hasOwnProperty('errorDescr') && errRec.errorDescr) {
		if (errMsg)
		errMsg += ': ';

		errMsg += errRec.errorDescr;
	}

	if (!errMsg)
	return false;

	gh.carGetError(rsp, errMsg, callback);
	return true;
}

gh.txId = 0;

/*

{
	conf: { … },
	rawData: [ input line ως string ],
	reqData: {
		oxima: [ αριθμός κυκλοφορίας οχήματος ως string ]
		date: [ ημερομηνία είτε ως Date είτε ως "YYYY-MM-DD" ]
	}
}

*/

gh.carGet = (rsp, callback) => {
	if (!callback)
	callback = (x) => {
		console.log(x);
	};

	if (!rsp.hasOwnProperty('reqData'))
	return gh.cargetError('missing request key data');

	if (!rsp.reqData.hasOwnProperty('oxima'))
	return gh.carGetError(rsp, 'missing oxima', callback);

	var reqData = rsp.reqData;

	// Ακολουθεί φιξάρισμα του αριθμού κυκλοφορίας οχήματος. Ουσιαστικά
	// γίνεται μετατροπή των γραμμάτων σε κεφαλαία και παρεμπιπτόντως
	// ελέγχεται αν είναι string.

	try {
		reqData.oxima = rsp.reqData.oxima.toString().toUpperCase();
	}

	catch (e) {
		return gh.carGetError(rsp, 'invalid "oxima" property value', callback);
	}

	// Το δεύτερο συστατικό των αιτημάτων αναζήτησης στοιχείων οχημάτων
	// και κατόχων είναι η ημερομηνία για την οποία αναζήτούμε στοιχεία.
	// Αν δεν καθοριστεί υποτίθεται η τρέχουσα ημερομηνία.

	if (!reqData.hasOwnProperty('date'))
	reqData.date = (new Date()).toISOString().substring(0, 10);

	else if ((typeof(reqData.date) === 'object') && (reqData.date instanceof Date))
	reqData.date = reqData.date.toISOString().substring(0, 10);

	else if (typeof(reqData.date) !== 'string')
	return gh.carGetError(rsp, 'invalid date', callback);

	var conf = rsp.conf;
	gh.txId++;

	pd.ttymsg('Requesting data for "' + reqData.oxima + '"...\n');
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
				'arithmosKykloforias': rsp.reqData.oxima,
				'requestDate': rsp.reqData.date,
			},
		}),
	}, (err, response, body) => {
		pd.errchk(err);

		try {
			body = JSON.parse(body);
		}

		catch (e) {
			return gh.carGetError(rsp, 'invalid returned data', callback);
		}

		if (gh.carGetResponseCheck(rsp, body, callback))
		return;

		if (gh.carGetResponseError(rsp, body, callback))
		return;

		if (!body.hasOwnProperty('getVehicleInformationOutputRecord'))
		return gh.carGetError(rsp, 'δεν επεστράφησαν στοιχεία οχήματος', callback);

		let oxima = body.getVehicleInformationOutputRecord;

		if (oxima.arithmosKykloforias !== rsp.reqData.oxima)
		gh.carGetError(rsp, 'επεστράφη διαφορετικός αρ. κυκλοφορίας', callbak);

		try {
			oxima = (new gh.oxima()).fromGovHUB(rsp, oxima);
		}

		catch (e) {
			console.error(e);
			gh.carGetError(rsp, 'σφάλμα μετατροπής δεδομένων οχήματος', callback);
			return;
		}

		if (oxima.totalPososto() !== 100)
		return gh.carGetError(rsp, 'συνολικό ποσοστό <> 100', callback);

		rsp.oxima = oxima;
		callback(rsp);
	});
};

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

gh.fromGovHUBData = function(rsp, objClass, target, govHUBData, propMap) {
	for (let i in govHUBData) {
		if (!propMap.hasOwnProperty(i)) {
			console.error(i + ': WARNING: unexpected property');
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

gh.katoxos.prototype.fromGovHUB = function(rsp, govHUBData) {
	return gh.fromGovHUBData(rsp, 'katoxos', this, govHUBData, {
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
	errorCheck().
	eponimoFix().
	diefFix();
};

gh.katoxos.prototype.errorCheck = function() {
	if (!this.hasOwnProperty('katoxosErrorInfo'))
	return this;

	console.error(this.katoxosErrorInfo);
	return this;
};

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

// XXX apellationFix

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

gh.oxima.prototype.fromGovHUB = function(rsp, govHUBData) {
	gh.fromGovHUBData(rsp, 'oxima', this, govHUBData, {
		"arithmosKykloforias": "pinakida",
		"arithmosPlaisioy": "sasinum",
		"marka": "marka",
		"xrwma": "xroma",
		"typosOxhmatos": "tipos",
		"katastashOxhmatos": "katastasi",
		"katoxoiList": "katoxos",
	});

	return this.katoxosWalk((govHUBData, i) => {
		this.katoxos[i] = (new gh.katoxos()).fromGovHUB(rsp, govHUBData);
	});
};
