///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// afmget.js -- node program το οποίο αιτείται στοιχεία φυσικών και νομικών
// προσώπων με βάση το ΑΦΜ από τη Γενική Γραμματεία Πληροφοριακών Συστημάτων.
//
// Updated: 2019-12-24
// Updated: 2019-12-17
//
///////////////////////////////////////////////////////////////////////////////@
//
// Το πρόγραμμα βασίζεται στο node module "govHUB/api.js" το οποίο αποτελεί
// wrapper του "govHUB" API που παρέχεται από την ΓΓΠΣ για την αναζήτηση
// στοιχείων φυσικών και νομικών προσώπων με βάση το ΑΦΜ. Το πρόγραμμα
// λειτουργεί μέσω του shell script "GH/afmget":
//
//	 GH afmget [ -v ] [ -s script ] [ FILES... ]
//
// Η option -v (ή --verbose) προκαλεί εκτύπωση μηνυμάτων ροής στο control
// terminal, ενώ με την option -s (ή --script) μπορούμε να καθορίσουμε το
// όνομα JavaScript προγράμματος στο οποίο παρέχουμε κώδικα για custom
// "processInput" και "processOuput" functions.
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const util = require('util');
const lblr = require('line-by-line');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraServer.js`);
const gh = require(`${pd.env('CHT_BASEDIR:=/var/opt/cht')}/lib/govHUB/apiServer.js`);

const afmget = {};

// Η function "init" αποτελεί το σημείο εκκίνησης του προγράμματος και μπορεί
// (προαιρετικά) να δεχθεί το όνομα ενός configuration file.

afmget.init = (conf) => {
	if (conf === undefined)
	conf = `${process.env.CHT_BASEDIR}/private/govHUB.cf`;

	gh.confRead(conf, (conf) => {
		afmget.readAfm(conf);
	});
};

afmget.readAfm = (conf) => {
	pd.ttymsg('Reading ΑΦΜ\n');

	const readLine = new lblr(process.stdin, {
		encoding: 'utf8',
		skipEmptyLines: false,
	})

	.on('line', (line) => {
		readLine.pause();
		afmget.processInput({
			'conf': conf,
			'rawData': line,
			'keyData': {},
		}, (x) => {
			afmget.processOutput(x);
			readLine.resume();
		});
	});
};

afmget.processInput = (x, callback) => {
	try {
		var data = JSON.parse(x.rawData);
	}

	catch (e) {
		x.error = 'invalid JSON format';
		return callback(x);
	}

	if (data.hasOwnProperty('afm'))
	x.keyData.afm = data.afm;

	gh.afmGet(x, (x) => {
		callback(x);
	});
};

afmget.processOutput = (x) => {
	console.log(util.inspect(x, {
		'compact': false,
		'depth': Infinity,
		'showHidden': true,
	}));
};
