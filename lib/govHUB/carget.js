///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// carget.js -- node program το οποίο αιτείται στοιχεία οχημάτων/κατόχων από
// την πλατφόρμα "govHUB" του Υπουργείου Εωτερικών.
//
///////////////////////////////////////////////////////////////////////////////@
//
// Το πρόγραμμα βασίζεται στο node module "govHUB/api.js" το οποίο αποτελεί
// wrapper του "govHUB" API που παρέχεται από την πλατφόρμα "govHUB" για την
// αναζήτηση στοιχείων οχημάτων/κατόχων.
//
// Το πρόγραμμα λειτουργεί είτε αυτόνομα είτε μέσω του shell script "carget".
// Η αυτόνομη λειτουργία του προγράμματος επιτυγχάνεται απλώς με την εντολή:
//
//	node carget.js
//
// Κατά την αυτόνομη λειτουργία το πρόγραμμα διαβάζει αριθμούς κυκλοφορίας
// οχημάτων και ημερομηνίες από το standard input, και επιστρέφει (εκτυπώνει)
// στοιχεία των οχημάτων και των κατόχων τους κατά τη συγκεκριμένη ημερομηνία.
//
// Το πρόγραμμα μπορεί να διαλειτουργήσει με τον awk όταν αναζητούμε στοιχεία
// οχημάτων/κατόχων μέσω των παραβάσεων ΚΟΚ που βεβαιώνει η αρμόδια Υπηρεσία
// του Δήμου Θεσσαλονίκης. Στην περίπτωση αυτή το πρόγραμμα διαβάζει γραμμές
// με τον αριθμό παράβασης, τον αριθμό κυκλοφορίας οχήματος και την ημερομηνία
// παράβασης (tab separated) και επιστρέφει (εκτυπώνει) τα στοιχεία οχημάτων
// και κατόχων κατά τη συγκεκριμένη ημερομηνία, μαζί με τον αριθμό παράβασης.
//
///////////////////////////////////////////////////////////////////////////////@

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const util = require('util');
const readline = require('readline');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const gh = require(`${pd.env('CHT_BASEDIR:=/var/opt/cht')}/lib/govHUB/api.js`);

const carget = {};

// Το πρόγραμμα εκκινεί διαβάζοντας το (απαραίτητο) configuration file στο
// οποίο υπάρχουν τα στοιχεία επικοινωνίας μας με την πλατφόρμα "govHUB" σε
// μορφή JSON.

gh.confRead(`${process.env.CHT_BASEDIR}/private/govHUB.cf`, (conf) => {
	// Αφού διαβάσουμε επιτυχώς το configuration JSON object από το
	// configuration file, αιτούμαστε access token από την πλατφόρμα.
	
	gh.tokenGet(conf, (conf) => {
		// Μετά την επιτυχή επιστροφή του configuration object
		// εμπλουτισμένου με το πολυπόθητο access toekn, προχωρούμε
		// στο διάβασμα των αριθμών κυκλοφορίας των οχημάτων για τα
		// οποία επιθυμούμε στοιχεία οχήματος και κατόχων.

		carget.readOxima(conf);
	});
});

carget.readOxima = (conf) => {
	pd.ttymsg('Reading cars...\n');
	readline.createInterface({
		'input': process.stdin,
		'crlfDelay': Infinity,
	})
	.on('line', (line) => {
		carget.processLine({
			'input': {
				'conf': conf,
				'rawData': line,
			},
		}, (x) => {
			delete x.input.conf;
			console.log(util.inspect(x, {
				'compact': false,
				'depth': Infinity,
				'showHidden': true,
			}));
		});
	});
};

carget.processLine = (x, callback) => {
	if (!callback)
	callback = pd.noop;

	try {
		var data = JSON.parse(x.input.rawData);
	}

	catch (e) {
		x.error = 'invalid JSON format';
		return callback(x);
	}

	x.input.reqData = {};

	if (data.hasOwnProperty('oxima'))
	x.input.reqData.oxima = data.oxima;

	if (data.hasOwnProperty('date'))
	x.input.reqData.date = data.date;

	gh.carGet(x, (x) => {
		callback(x);
	});
};
