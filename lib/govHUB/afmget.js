///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
// @COPYRIGHT BEGIN
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILE BEGIN
// lib/govHUB/afmget.js —— Πρόγραμμα αναζήτησης φυσικών/νομικών προσώπων με ΑΦΜ
// @FILE END
//
// @DESCRIPTION BEGIN
// Node πρόγραμμα το οποίο αιτείται στοιχεία φυσικών και νομικών προσώπων με
// βάση το ΑΦΜ από τη Γενική Γραμματεία Πληροφοριακών Συστημάτων.
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
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2019-12-24
// Updated: 2019-12-17
// @HISTORY END
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const util = require('util');
const lblr = require('line-by-line');

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraServer.js`);

if (!process.env.CHT_BASEDIR)
process.env.CHT_BASEDIR = '/var/opt/cht';

const gh = require(`${process.env.CHT_BASEDIR}/lib/govHUB/apiServer.js`);

const afmget = {};

// Η function "init" αποτελεί το σημείο εκκίνησης του προγράμματος και μπορεί
// (προαιρετικά) να δεχθεί το όνομα ενός configuration file.

afmget.init = (cfile) => {
	gh.confRead(cfile, (conf) => {
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
