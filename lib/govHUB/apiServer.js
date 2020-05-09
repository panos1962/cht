///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
// @COPYRIGHT BEGIN
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILE BEGIN
// lib/govHUB/apiServer.js —— govHUB JavaScript server-side API
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν αποτελεί JavaScript API που αφορά σε λειτουργίες που παρέχονται
// μέσω της πλατφόρμας "govHUB" του Υπουργείου Εσωτερικών, η οποία στο παρόν
// θα αναφέρεται απλώς ως «πλατφόρμα». Στο παρόν ορίζονται επίσης και δομές
// αντικειμένων που αφορούν στην πλατφόρμα, π.χ. φυσικά και νομικά πρόσωπα,
// οχήματα, κάτοχοι οχημάτων κλπ.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2019-02-14
// Updated: 2019-12-29
// Updated: 2019-12-24
// Updated: 2019-12-19
// Updated: 2019-12-18
// Updated: 2019-12-17
// Updated: 2019-12-15
// @HISTORY END
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const util = require('util');
const fs = require('fs');
const request = require('request');

const pd = require('../../mnt/pandora/lib/pandoraServer.js');
const gh = require('./apiCore.js');
module.exports = gh;

///////////////////////////////////////////////////////////////////////////////@

gh.opts = {};

///////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "fromGsis" δέχεται ένα JSON object «προσώπου» όπως αυτό παρέχεται
// από την ΓΓΠΣ (μέσω του JSON object δεδομένων φυσικού ή νομικού προσώπου)
// και θέτει αναλόγως τα πεδία τού ανά χείρας "prosopo" object παραλλάσσοντας
// τα ονόματα των πεδίων.

gh.prosopo.prototype.fromGsis = function(rsp, gsisData) {
	return gh.fromPlatform(rsp, 'prosopo', this, gsisData, {
		"afm": "afm",
		"deactivationFlag": "anenergo",
		"doy": "doi",
		"doyDescr": "doiDesc",
		"onomasia": "onomasia",
		"mothersFirstName": "mitronimo",
		"birthDate": "genisi",
		"birthPlace": "toposGenisis",
		"cntResidenceDescr": "kratos",
		"residenceParDescr": "perioxi",
		"residenceAddress": "odos",
		"residenceAddressNo": "odar",
		"residenceZipCode": "tk",
		"indPhone": "tilefono",

		"firmCommerTitle": "eteria",
		"firmParDescr": "perioxiEterias",
		"firmAddress": "odosEterias",
		"firmAddressNo": "odarEterias",
		"firmZipCode": "tkEterias",
		"firmPhone": "tilefonoEterias",
		"firmFax": "faxEterias",

		"iNiFlag": false,
		"assTxpActual": false,
		"firmFlag": false,
		"ninLegalPurposeSpecified": false,
		"ninLegalPurposeDescr": false,
		"ninLegalStatusSpecified": false,
		"ninLegalStatusDescr": false,
		"cardNo": false,
		"cardKind": false,
		"cntCitizenshipDescr": false,
		"birthDateSpecified": false,
		"deathDateSpecified": false,
		"postalAddress": false,
		"postalAddressNo": false,
		"postalZipCode": false,
		"postalParDescr": false,
		"firmDoy": false,
		"registDateSpecified": false,
		"stopDateSpecified": false,
		"facMainActivitySpecified": false,
		"actMainDescr": false,
		"countOfBranchesSpecified": false,
		"frmForOriginDescr": false,
		"frmBooksSpecified": false,
		"frmBooksDescr": false,
		"frmVatStatusSpecified": false,
		"frmVatStatusDescr": false,
		"frmExtExciseDescr": false,
		"frmFstStateDescr": false,
		"frmFirstAcntPrdEndSpecified": false,
		"frmEndAcntPeriod": false,
		"frmOrsStopDescr": false,
		"ninFPMState": false,
		"ninJntVentEndDateSpecified": false,
		"ninSaFileNo": false,
		"ninSharesDescr": false,
		"ninCapitalInfoSpecified": false,
		"ninJntVentDescr": false,
	}).
	onomasiaFix().
	imerominiaFix().
	diefFix();
};

gh.prosopo.prototype.onomasiaFix = function() {
	if (this.odosEterias) {
		this.odos = this.odosEterias;
		delete this.odosEterias;
	}

	if (this.odarEterias) {
		this.odar = this.odarEterias;
		delete this.odarEterias;
	}

	if (this.tkEterias) {
		this.tk = this.tkEterias;
		delete this.tkEterias;
	}

	if (this.perioxiEterias) {
		this.perioxi = this.perioxiEterias;
		delete this.perioxiEterias;
		delete this.kratos;
	}

	if (this.tilefonoEterias) {
		this.tilefono = this.tilefonoEterias;
		delete this.tilefonoEterias;
	}

	if (this.faxEterias) {
		this.fax = this.faxEterias;
		delete this.faxEterias;
	}

	delete this.onoma;
	delete this.patronimo;
	delete this.mitronimo;

	if (this.eteria) {
		this.eponimia = this.onomasia;
		delete this.onomasia;

		if (!this.eponimia)
		this.eponimia = this.eteria;

		return this;
	}

	if (!this.onomasia)
	return this;

	let a = this.onomasia.split(',');
	delete this.onomasia;

	let eponimo1 = '';
	let eponimo2 = '';

	switch (a.length) {
	case 1:
		this.eponimia = a[0];
		return this;

	case 2:
		eponimo1 = a[0];
		eponimo2 = a[1];
		break;
	case 3:
		eponimo1 = a[0];
		eponimo2 = a[1];
		this.onoma = a[2];
		break;
	default:
		eponimo1 = a[0];
		eponimo2 = a[1];
		this.onoma = a[2];
		this.patronimo = a[3];
		break;
	}

	if (eponimo1 && eponimo2)
	this.eponimo = eponimo1 + '-' + eponimo2;

	else if (eponimo1)
	this.eponimo = eponimo1;

	else
	this.eponimo = eponimo2;

	return this;
};

gh.prosopo.prototype.imerominiaFix = function() {
	try {
		this.genisi = pd.date(new Date(this.genisi));
	}

	catch (e) {
		delete this.genisi;
	}

	return this;
};

gh.prosopo.prototype.diefFix = function() {
	let odos = this.odos;
	let odar = this.odar;

	delete this.odos;
	delete this.odar;

	if (odar === '0')
	odar = undefined;

	if (odos && odar)
	return this.diefSet(odos + ' ' + odar);

	if (odos)
	return this.diefSet(odos);

	if (odar)
	return this.diefSet(odar);

	return this.diefSet('');
};

///////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "fromGovHUB" δέχεται ένα JSON object «κατόχου» όπως αυτό παρέχεται
// από την πλατφόρμα (μέσω του JSON object δεδομένων οχήματος) και θέτει
// αναλόγως τα πεδία τού ανά χείρας "katoxos" object.

gh.katoxos.prototype.fromGovHUB = function(rsp, govHUBData) {
	return gh.fromPlatform(rsp, 'katoxos', this, govHUBData, {
		"afm": "afm",
		"percent": "pososto",
		"doy": "doi",
		"doyDesc": "doiDesc",
		"appelation": "eponimia",
		"legalStatusDesc": "morfi",
		"surname": "eponimo1",
		"secondSurname": "eponimo2",
		"firstName": "onoma",
		"fathersFirstName": "patronimo",
		"mothersFirstName": "mitronimo",
		"address": "odos",
		"addressNo": "odar",
		"parZipCode": "tk",
		"parDescription": "perioxi",
		"katoxosErrorInfo": "error",
	}).
	errorCheck().
	posostoFix().
	eponimoFix().
	diefFix();
};

gh.katoxos.prototype.errorCheck = function() {
	if (!this.hasOwnProperty('error'))
	return this;

	console.error(this.error);
	return this;
};

gh.katoxos.prototype.posostoFix = function() {
	if (!this.hasOwnProperty('pososto'))
	return pd.colvalSet(this, 'pososto', 0);

	if (isNaN(this.pososto))
	return pd.colvalSet(this, 'pososto', 0);

	return this;
};

gh.katoxos.prototype.eponimoFix = function() {
	let eponimo1 = this.eponimo1;
	let eponimo2 = this.eponimo2;

	delete this.eponimo1;
	delete this.eponimo2;

	if (eponimo1 && eponimo2)
	return pd.colvalSet.call(this, 'eponimo', eponimo1 + '-' + eponimo2);

	if (eponimo1)
	return pd.colvalSet.call(this, 'eponimo', eponimo1);

	return pd.colvalSet.call(this, 'eponimo', eponimo2);
};

gh.katoxos.prototype.diefFix = function() {
	let odos = this.odos;
	let odar = this.odar;

	delete this.odos;
	delete this.odar;

	if (odar === '0')
	odar = undefined;

	if (odos && odar)
	return this.diefSet(odos + ' ' + odar);

	if (odos)
	return this.diefSet(odos);

	return pd.colvalSet.call(this, 'dief', odar);
};

///////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "fromGovHUB" δέχεται ένα JSON object «οχήματος» όπως αυτό
// παρέχεται από την πλατφόρμα, και θέτει αναλόγως τα πεδία του ανά χείρας
// "oxima" object.

gh.oxima.prototype.fromGovHUB = function(rsp, govHUBData) {
	gh.fromPlatform(rsp, 'oxima', this, govHUBData, {
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

///////////////////////////////////////////////////////////////////////////////@

gh.monitor = (msg) => {
	if (gh.monitorOff())
	return gh;

	pd.ttymsg(msg);
	return gh;
};

(gh.monitorSet = (x) => {
	if (x === undefined)
	x = true;

	gh.opts.monitor = x;
	return gh;
})(true);

gh.monitorOn = () => {
	return gh.opts.monitor;
};

gh.monitorOff = () => {
	return !gh.monitorOn();
};

///////////////////////////////////////////////////////////////////////////////@

gh.debug = (msg, stream) => {
	if (gh.debugOff())
	return gh;

	pd.debug(msg, stream);
	return gh;
};

(gh.debugSet = (x) => {
	if (x === undefined)
	x = true;

	gh.opts.debug = x;
	return gh;
})(false);

gh.debugOn = () => {
	return gh.opts.debug;
};

gh.debugOff = () => {
	return !gh.debugOn();
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "confRead" δέχεται ως παράμετρο το όνομα του configuration file
// το οποίο περιέχει τα στοιχεία επικοινωνίας μας με την πλατφόρμα "govHUB"·
// τα στοιχεία είναι γραμμένα ως ένα ενιαίο JSON object. Ως δεύτερη παράμετρο
// μπορούμε να περάσουμε μια callback function η οποία θα κληθεί με παράμετρο
// το configuration object· αν δεν καθοριστεί callback function, τότε απλώς
// εκτυπώνεται το configuration object στο standard output.

gh.confRead = (cfile, callback) => {
	if (cfile === undefined) {
		if (!process.env.CHT_BASEDIR)
		process.env.CHT_BASEDIR = '/var/opt/cht';

		cfile = `${process.env.CHT_BASEDIR}/private/govHUB.cf`;
	}

	gh.monitor('Reading configuration\n');
	fs.readFile(cfile, 'utf8', (err, conf) => {
		pd.errchk(err);

		try {
			conf = JSON.parse(conf);
		}

		catch (e) {
			pd.errchk(e);
		}

		conf.file = cfile;

		if (!callback)
		return console.log(conf);

		callback(conf);
	});
};

// Για να επικοινωνήσουμε με την πλατφόρμα "govHUB" χρειαζόμαστε ένα access
// token· πρόκειται για ένα μεγάλο string που παράγεται από τον server τής
// παλτφόρμας και μας επιστρέφεται εφόσον κάνουμε την κατάλληλη κλήση με τα
// στοιχεία επικοινωνίας που διαβάσαμε από το configuration file. Η function
// δέχεται ως παράμετρο το configuration JSON object, ενώ ως δεύτερη παράμετρο
// μπορούμε να περάσουμε callback function η οποία θα κληθεί με παράμετρο το
// configuration object εμπλουτισμένο με το νεοαποκτηθέν access token ως
// property "accessToken" του αιτηθέντος client. Αν δεν καθορίσουμε callback
// function, τότε η function απλώς εκτυπώνει το access token στο standard
// output.

gh.tokenGet = function(conf, what, callback, noMore) {
	if (noMore)
	throw new Error('failed to get access token');

	if (!conf.hasOwnProperty('connect'))
	return confRead(undefined, (cf) => {
		gh.tokenGet(cf, what, callback, true);
	});

	const connect = conf.connect;
	const client = connect.client[what];

	const form = {
		'grant_type': 'client_credentials',
		'client_id': client.id,
		'client_secret': client.secret,
		'scope': client.scope,
	};

	gh.monitor('Requesting "' + what + '" access token\n');
	request.post({
		'url': connect.tokenUrl,
		'headers': {
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		'form': form,
	}, (err, rsp, body) => {
		pd.errchk(err);

		body = JSON.parse(body);

		if (!body.hasOwnProperty('access_token'))
		throw new Error('govHUB: undefined access token');

		let now = new Date();
		body.expires_in = parseInt(body.expires_in * 0.8);
		now.setSeconds(now.getSeconds() + body.expires_in);
		body.expires_at = now;
		delete body.expires_in;

		client.accessToken = body;

		if (!callback)
		return console.log(client.accessToken);

		callback(conf);
	})
};

gh.noToken = (conf, client, noMore) => {
	var cli = conf.connect.client[client];

	if (cli.hasOwnProperty('accessToken') &&
		(cli.accessToken.expires_at > (new Date())))
	return false;

	if (noMore)
	throw new Error('access token "' + client + '" not granted');

	return true;
};

///////////////////////////////////////////////////////////////////////////////@

// Σκοπός της function "secretWipe" είναι η απαλοιφή ευαίσθητων δεδομένων, ή
// δεδομένων που δεν είναι πια απαραίτητα. Η function "secretWipe" καλείται
// συνήθως πριν την κλήση της callback function.

gh.secretWipe = function(opts) {
	delete opts.conf;
	delete opts.keyData;

	return opts;
};

// Η function "errorSet" καλείται στις περιπτώσεις που παρουσιάζεται κάποιο
// πρόβλημα κατά την αναζήτηση στοιχείων από κάποια πλατφόρμα. Η function θέτει
// το error property στο options object και καλεί την callback function.

gh.errorSet = (opts, msg, callback) => {
	gh.secretWipe(opts);
	opts.error = msg;
	callback(opts);
};

///////////////////////////////////////////////////////////////////////////////@

gh.txId = 0;
gh.protocol = 0;

// Η function "oximaGet" δέχεται ως παράμετρο ένα αντικείμενο στο οποίο, μεταξύ
// άλλων καθορίζεται ένας αριθμός κυκλοφορίας οχήματος και μια ημερομηνία
// (αν δεν καθοριστεί ημερομηνία υποτίθεται η σημαρινή). Σκοπός τής function
// είναι ο εμπλουτισμός τού εν λόγω αντικειμένου με τα στοιχεία οχήματος και
// κατόχων κατά την συγκεκριμένη ημερομηνία. Τα στοιχεία οχήματος και κατόχων 
// επιστρέφονται ως propety "oxima" η οποία θα προστεθεί στο αντικείμενο που
// περνάμε ως παράμετρο, ενώ αν παρουσιαστεί οποιοδήποτε πρόβλημα προστίθεται
// property "error" με τιμή την περιγραφή τού προβλήματος.
//
// Ακολουθεί η γενική μορφή του input object, στο οποίο πρέπει να υπάρχουν οι
// properites "conf", "rawData" και "keyData".
//
//	{
//		conf: { … },
//		rawData: [ input line ως string ],
//		keyData: {
//			oxima: [ αριθμός κυκλοφορίας οχήματος ως string ]
//			date: [ ημερομηνία είτε ως Date είτε ως "YYYY-MM-DD" ]
//		}
//	}

gh.oximaGet = (opts, callback, noMore) => {
	if (!callback)
	callback = (x) => {
		console.log(x);
	};

	var conf = opts.conf;

	if (gh.noToken(conf, 'oxima', noMore))
	return gh.tokenGet(conf, 'oxima', (conf) => {
		gh.oximaGet(opts, callback, true);
	});

	var client = conf.connect.client.oxima;
	var token = client.accessToken;
	var auth = token.token_type + ' ' + token.access_token;

	if (!opts.hasOwnProperty('keyData'))
	return gh.errorSet(opts, 'missing key data', callback);

	var keyData = opts.keyData;

	if (!keyData.hasOwnProperty('oxima'))
	return gh.errorSet(opts, 'missing "oxima" from key data', callback);

	// Ακολουθεί φιξάρισμα του αριθμού κυκλοφορίας οχήματος. Ουσιαστικά
	// γίνεται μετατροπή των γραμμάτων σε κεφαλαία και παρεμπιπτόντως
	// ελέγχεται αν είναι string.

	try {
		keyData.oxima = keyData.oxima.toString().toUpperCase();
	}

	catch (e) {
		return gh.errorSet(opts, 'invalid "oxima" key data value', callback);
	}

	// Το δεύτερο συστατικό των αιτημάτων αναζήτησης στοιχείων οχημάτων
	// και κατόχων είναι η ημερομηνία για την οποία αναζητούμε στοιχεία.
	// Αν δεν καθοριστεί υποτίθεται η τρέχουσα ημερομηνία.

	if (!keyData.hasOwnProperty('date'))
	keyData.date = pd.date();

	else if ((typeof(keyData.date) === 'object') && (keyData.date instanceof Date))
	keyData.date = pd.date(keyData.date);

	else if (typeof(keyData.date) !== 'string')
	return gh.errorSet(opts, 'invalid date', callback);

	gh.txId++;

	gh.monitor('Requesting data for "' + keyData.oxima + '"\n');
	request.post({
		'url': client.url,
		'headers': {
			'Authorization': auth,
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify({
			'auditRecord': {
				'auditUserId': pd.randar(conf.userPool),
				'auditUserIp': pd.randar(conf.ipPool),
				'auditTransactionId': gh.txId,
			},
			'getVehicleInformationInputRecord': {
				'arithmosKykloforias': keyData.oxima,
				'requestDate': keyData.date,
			},
		}),
	}, (err, response, body) => {
		pd.errchk(err);

		try {
			body = JSON.parse(body);
		}

		catch (e) {
			return gh.errorSet(opts, 'invalid returned data', callback);
		}

		if (gh.responseBodyCheck(opts, 'oxima', body, callback))
		return;

		if (gh.responseErrorCheck(opts, 'oxima', body, callback))
		return;

		if (!body.hasOwnProperty('getVehicleInformationOutputRecord'))
		return gh.errorSet(opts, 'δεν επεστράφησαν στοιχεία οχήματος', callback);

		let oxima = body.getVehicleInformationOutputRecord;

		try {
			oxima = (new gh.oxima()).fromGovHUB(opts, oxima);
		}

		catch (e) {
			console.error(e);
			gh.errorSet(opts, 'σφάλμα μετατροπής δεδομένων οχήματος', callback);
			return;
		}

		if (oxima.pinakida !== keyData.oxima)
		gh.errorSet(opts, 'επεστράφη διαφορετικός αρ. κυκλοφορίας', callback);

		if (oxima.totalPososto() !== 100)
		return gh.errorSet(opts, 'συνολικό ποσοστό <> 100', callback);

		gh.secretWipe(opts);
		opts.oxima = oxima;

		callback(opts);
	});
};

gh.afmGet = (opts, callback, noMore) => {
	if (!callback)
	callback = (x) => {
		console.log(x);
	};

	var conf = opts.conf;

	if (gh.noToken(conf, 'prosopo', noMore))
	return gh.tokenGet(conf, 'prosopo', (conf) => {
		gh.afmGet(opts, callback, true);
	});

	var client = conf.connect.client.prosopo;
	var token = client.accessToken;
	var auth = token.token_type + ' ' + token.access_token;

	if (!opts.hasOwnProperty('keyData'))
	return gh.errorSet(opts, 'missing key data', callback);

	var keyData = opts.keyData;

	if (!keyData.hasOwnProperty('afm'))
	return gh.errorSet(opts, 'missing "afm" from key data', callback);


	gh.txId++;
	gh.protocol++;

	gh.monitor('Requesting data for "' + keyData.afm + '"\n');
	request.post({
		'url': conf.connect.client.prosopo.url,
		'headers': {
			'Authorization': auth,
			'Content-Type': 'application/json',
		},
		'body': JSON.stringify({
			'auditRecord': {
				'auditUserId': pd.randar(conf.userPool),
				'auditUserIp': pd.randar(conf.ipPool),
				'auditUnit': 'govHUB',
				'auditProtocol': gh.protocol,
				'auditTransactionId': gh.txId,
				'auditTransactionDate': (new Date()).toISOString(),
			},
			'retrieveInfoByAFMRecord': {
				'afm': keyData.afm,
			},
		}),
	}, (err, response, body) => {
		pd.errchk(err);

		try {
			body = JSON.parse(body);
		}

		catch (e) {
			return gh.errorSet(opts, 'invalid returned data', callback);
		}

		if (gh.responseBodyCheck(opts, 'prosopo', body, callback))
		return;

		if (gh.responseErrorCheck(opts, 'prosopo', body, callback))
		return;

		if (!body.hasOwnProperty('retrieveInfoByAFMRecord'))
		return gh.errorSet(opts, 'δεν επεστράφησαν στοιχεία ΑΦΜ', callback);

		var ribar = body.retrieveInfoByAFMRecord;

		if (gh.debugOn())
		console.log(util.inspect(ribar, {
			'depth': Infinity,
		}));

		if (!ribar.hasOwnProperty('basicInfo'))
		return gh.errorSet(opts, 'δεν επεστράφησαν στοιχεία προσώπου', callback);

		let prosopo = ribar.basicInfo;

		try {
			prosopo = (new gh.prosopo()).fromGsis(opts, prosopo);
		}

		catch (e) {
			console.error(e);
			gh.errorSet(opts, 'σφάλμα μετατροπής δεδομένων προσώπου', callback);
			return;
		}

		if (prosopo.afm !== keyData.afm)
		gh.errorSet(opts, 'επεστράφη διαφορετικό ΑΦΜ', callback);

		gh.secretWipe(opts);
		opts.prosopo = prosopo;

		callback(opts);
	});
};

///////////////////////////////////////////////////////////////////////////////@

// Παρακάτω ορίζουμε λίστες με τα properties που είναι αναμενόμενα από τις
// πλατφόρμες "govHUB", ΓΓΠΣ κλπ. Σε περίπτωση που παραλάβουμε property που
// δεν περιλαμβάνεται στη λίστα που ακολουθεί θα εκτυπώσουμε warning message
// προκειμένου να ελεγχθεί η νέα property όσον αφορά στο αν και πώς επηρεάζει
// τα δεδομένα μας. Σε κάθε αναμενόμενη property δίνουμε τιμή true εφόσον η
// συγκεκριμένη property μας ενδιαφέρει, αλλιώς δίνουμε τιμή false.

gh.expectedProperties = {
	"prosopo": {
		"retrieveInfoByAFMRecord": true,
		"callSequenceId": false,
		"callSequenceIdSpecified": false,
		"callSequenceDate": false,
		"callSequenceDateSpecified": false,
		"errorRecord": true,
	},

	"oxima": {
		"getVehicleInformationOutputRecord": true,
		"callSequenceId": false,
		"callSequenceIdSpecified": false,
		"callSequenceDate": false,
		"callSequenceDateSpecified": false,
		"errorRecord": true,
		/*
		"errors": true,
		"type": false,
		"title": true,
		"status": false,
		"traceId": false,
		*/
	},
};

gh.responseBodyCheck = (opts, what, body, callback) => {
	let errMsg = undefined;
	let propSM;

	if (gh.debugOn())
	gh.debug(util.inspect(body, {
		'depth': Infinity,
		'compact': false,
		'colors': process.stderr.isTTY,
	}));

	for (let i in body) {
		if (gh.expectedProperties[what].hasOwnProperty(i))
		continue;

		if (errMsg) {
			errMsg += ', ' + i;
			propSM = "properties";
		}

		else {
			errMsg = opts.rawData + ': WARNING: ' + i;
			propSM = "property";
		}
	}

	if (!errMsg)
	return false;

	errMsg += ': unexpected ' + propSM;
	gh.errorSet(opts, errMsg, callback);
	return true;
};

gh.responseErrorCheck = (opts, what, body, callback) => {
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

	gh.errorSet(opts, errMsg, callback);
	return true;
}

// Η function "fromPlatform" δέχεται ως παραμέτρους ένα target object, ένα
// source object και έναν πίνακα αντιστοίχισης πεδίων (map), και αντιγράφει
// τα πεδία του source object στο target object παραλλάσσοντας τα ονόματα των
// πεδίων σύμφωνα με το δοθέν map. Πεδία τα οποία είναι undefined ή έχουν
// null τιμή δεν αντιγράφονται, ενώ όλα τα string πεδία γίνονται trim.
//
// Πεδία που δεν θέλουμε να αντιγραφούν φέρουν false τιμή στο map, ενώ πεδία
// που δεν είναι καταγεγραμμένα στο map εκτυπώνονται ως warnings στο standard
// error προκειμένου να τα εντάξουμε στο map όταν και αν αυτά εμφανιστούν στα
// δεδομένα που επιστρέφονται από την πλατφόρμα.

gh.fromPlatform = function(rsp, objClass, target, platformData, propMap) {
	for (let i in platformData) {
		if (!propMap.hasOwnProperty(i)) {
			console.error(i + ': WARNING: unexpected property');
			continue;
		}

		if (!propMap[i])
		continue;

		if (platformData[i] === undefined)
		continue;

		if (platformData[i] === null)
		continue;

		if (typeof(platformData[i]) === 'string') {
			target[propMap[i]] = platformData[i].trim();
			continue;
		}

		target[propMap[i]] = platformData[i];
	}

	return target;
};
