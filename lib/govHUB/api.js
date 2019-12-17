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
//					'keyData': {},
//				},
//			}, (x) => {
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
	const client = pd.randar(connect.clientPool);

	pd.ttymsg('Requesting connect token...\n');
	request.post({
		'url': connect.url,
		'headers': {
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		'form': {
			'grant_type': 'client_credentials',
			'client_id': client.id,
			'client_secret': client.secret,
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

// Σκοπός της function "oximaGetWipe" είναι η απαλοιφή ευαίσθητων δεδομένων, ή
// δεδομένων που δεν είναι πια απαραίτητα. Η function "oximaGetWipe" καλείται
// συνήθως πριν την κλήση της callback function.

gh.oximaGetWipe = function(opts) {
	delete opts.conf;
	delete opts.keyData;

	return opts;
};

// Η function "oximaGetError" καλείται στις περιπτώσεις που παρουσιάζεται
// κάποιο πρόβλημα κατά την αναζήτηση στοιχείων οχήματος/κατόχων. Η function
// θέτει το error property στο options object και καλεί την callback function.

gh.oximaGetError = (opts, msg, callback) => {
	gh.oximaGetWipe(opts);
	opts.error = msg;
	callback(opts);
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

gh.oximaGetResponseCheck = (opts, body, callback) => {
	let errMsg = undefined;
	let propSM;

	if (gh.debugOn())
	gh.debug(util.inspect(body, {
		'depth': Infinity,
		'compact': false,
		'colors': process.stderr.isTTY,
	}));

	if (body.hasOwnProperty('errors')) {
		gh.oximaGetError(opts, 'response errors encountered', callback);
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
			errMsg = opts.rawData + ': WARNING: ' + i;
			propSM = "property";
		}
	}

	if (!errMsg)
	return false;

	errMsg += ': unexpected ' + propSM;
	gh.oximaGetError(opts, errMsg, callback);
	return true;
}

gh.oximaGetResponseError = (opts, body, callback) => {
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

	gh.oximaGetError(opts, errMsg, callback);
	return true;
}

gh.txId = 0;

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

gh.oximaGet = (opts, callback) => {
	if (!callback)
	callback = (x) => {
		console.log(x);
	};

	if (!opts.hasOwnProperty('keyData'))
	return gh.oximaGetError(opts, 'missing key data', callback);

	var keyData = opts.keyData;

	if (!keyData.hasOwnProperty('oxima'))
	return gh.oximaGetError(opts, 'missing "oxima" from key data', callback);

	// Ακολουθεί φιξάρισμα του αριθμού κυκλοφορίας οχήματος. Ουσιαστικά
	// γίνεται μετατροπή των γραμμάτων σε κεφαλαία και παρεμπιπτόντως
	// ελέγχεται αν είναι string.

	try {
		keyData.oxima = keyData.oxima.toString().toUpperCase();
	}

	catch (e) {
		return gh.oximaGetError(opts, 'invalid "oxima" key data value', callback);
	}

	// Το δεύτερο συστατικό των αιτημάτων αναζήτησης στοιχείων οχημάτων
	// και κατόχων είναι η ημερομηνία για την οποία αναζητούμε στοιχεία.
	// Αν δεν καθοριστεί υποτίθεται η τρέχουσα ημερομηνία.

	if (!keyData.hasOwnProperty('date'))
	keyData.date = pd.date();

	else if ((typeof(keyData.date) === 'object') && (keyData.date instanceof Date))
	keyData.date = pd.date(keyData.date);

	else if (typeof(keyData.date) !== 'string')
	return gh.oximaGetError(opts, 'invalid date', callback);

	var conf = opts.conf;
	gh.txId++;

	pd.ttymsg('Requesting data for "' + keyData.oxima + '"...\n');
	request.post({
		'url': conf.vehicleInfo.url,
		'headers': {
			'Authorization': 'Bearer ' + conf.connect.accessToken,
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
			return gh.oximaGetError(opts, 'invalid returned data', callback);
		}

		if (gh.oximaGetResponseCheck(opts, body, callback))
		return;

		if (gh.oximaGetResponseError(opts, body, callback))
		return;

		if (!body.hasOwnProperty('getVehicleInformationOutputRecord'))
		return gh.oximaGetError(opts, 'δεν επεστράφησαν στοιχεία οχήματος', callback);

		let oxima = body.getVehicleInformationOutputRecord;

		if (oxima.arithmosKykloforias !== keyData.oxima)
		gh.oximaGetError(opts, 'επεστράφη διαφορετικός αρ. κυκλοφορίας', callbak);

		try {
			oxima = (new gh.oxima()).fromGovHUB(opts, oxima);
		}

		catch (e) {
			console.error(e);
			gh.oximaGetError(opts, 'σφάλμα μετατροπής δεδομένων οχήματος', callback);
			return;
		}

		if (oxima.totalPososto() !== 100)
		return gh.oximaGetError(opts, 'συνολικό ποσοστό <> 100', callback);

		gh.oximaGetWipe(opts);
		opts.oxima = oxima;

		callback(opts);
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

gh.katoxos.prototype.diefSet = function(dief) {
	var perioxi = pd.colvalGet.call(this, 'perioxi');

	this.dief = (dief === perioxi ? '' : dief);
	return this;
};

gh.katoxos.prototype.isNomikoProsopo = function() {
	return this.morfi;
};

gh.katoxos.prototype.isFisikoProsopo = function() {
	if (this.isNomikoProsopo())
	return false;
};

gh.katoxos.prototype.onomasiaGet = function() {
	var s = '';
	var l = this.isNomikoProsopo() ?
		[ 'eponimia', 'morfi' ] :
		[ 'eponimo', 'onoma', { k: 'patronimo', l: 3, a: '(', p: ')' } ];

	for (let i = 0; i < l.length; i++) {
		let prop;
		let size = Infinity;
		let ante = undefined;
		let post = undefined;

		if (typeof(l[i]) === 'string') {
			prop = l[i];
		}

		else {
			prop = l[i].k;

			if (l[i].hasOwnProperty('l'))
			size = l[i].l;

			if (l[i].hasOwnProperty('a'))
			ante = l[i].a;

			if (l[i].hasOwnProperty('p'))
			post = l[i].p;
		}

		if (!this.hasOwnProperty(prop))
		continue;

		if (this[prop] === '')
		continue;

		if (s) s += ' ';
		if (ante) s += ante;
		s += (this[prop]).substr(0, size);
		if (post) s += post;
	}

	return s;
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
		tot += katoxos.pososto;
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
