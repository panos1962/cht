///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
// @COPYRIGHT BEGIN
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILE BEGIN
// govHUB/apiCore.js —— govHUB JavaScript API (core module)
// @FILE END
//
// @DESCRIPTION BEGIN
// Περιλαμβάνονται οι βασικές δομές και functions που αποτελούν το interface
// προς την εξωτερική πλατφόρμα "govHUB". Με το όρο «βασικές δομές και
// functions» εννοούμε εκείνα τα στοιχεία του API που είναι απαραίτητα τόσο
// στον server (node programs), όσο και στον client (browser applications).
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-03-03
// Updated: 2020-01-30
// Updated: 2020-01-11
// Updated: 2020-01-06
// Updated: 2019-12-27
// Updated: 2019-12-25
// Updated: 2019-12-24
// Updated: 2019-12-21
// @HISTORY END
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const gh = {};
module.exports = gh;

const pd = require('../../mnt/pandora/lib/pandoraCore.js');

///////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί ο ορισμός της κλάσης "prosopo" που απεικονίζει φυσικά ή νομικά
// πρόσωπα. Τα πεδία κάθε προσώπου είναι εν πολλοίς αυτά που παραλαμβάνουμε
// από την ΓΓΠΣ, πλην όμως με διαφορετικές ονομασίες, ενώ μπορούμε να έχουμε
// και άλλα πεδία όπως πεδία από τα τοπικά πληροφοριακά συστήματα, παράγωγα
// πεδία κοκ.

gh.prosopo = function(x) {
	pd.objectInit(this, x);
};

gh.prosopo.prototype.diefSet = function(dief) {
	var perioxi = pd.colvalGet.call(this, 'perioxi');

	this.dief = (dief === perioxi ? '' : dief);
	return this;
};

gh.prosopo.prototype.doiGet = function() {
	if (this.doi && this.doiDesc)
	return this.doiDesc + ' (' + this.doi + ')';

	if (this.doi)
	return this.doi;

	if (this.doiDesc)
	return this.doiDesc;

	return '';
};

gh.prosopo.prototype.eponimiaGet = function() {
	return (this.hasOwnProperty('eponimia') ? this.eponimia : '');
};

gh.prosopo.prototype.isEponimia = function() {
	return this.eponimia;
};

gh.prosopo.prototype.noEponimia = function() {
	return !this.isEponimia();
};

gh.prosopo.prototype.isMitronimo = function() {
	return this.mitronimo;
};

gh.prosopo.prototype.noMitronimo = function() {
	return !this.isMitronimo();
};

gh.prosopo.prototype.isNomikoProsopo = function() {
	return (this.isEponimia() && this.noMitronimo());
};

gh.prosopo.prototype.isFisikoProsopo = function() {
	return !this.isNomikoProsopo();
};

gh.prosopo.prototype.onomasiaGet = function() {
	if (this.isEponimia())
	return this.eponimia.trim();

	let s = '';

	if (this.eponimo)
	s += this.eponimo;

	if (this.onoma)
	s += ' ' + this.onoma;

	if (this.patronimo)
	s += ' (' + this.patronimo.substr(0, 3) + ')';

	return s.trim();
};

///////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί ο ορισμός της κλάσης "katoxos" που απεικονίζει κατόχους οχημάτων.
// Τα πεδία κάθε κατόχου οχήματος είναι εν πολλοίς αυτά που παραλαμβάνουμε από
// την πλατφόρμα πλην όμως με διαφορετικές ονομασίες, ενώ μπορούμε να έχουμε
// και άλλα πεδία, όπως πεδία από τα τοπικά πληροφοριακά συστήματα, παράγωγα
// πεδία κοκ.

gh.katoxos = function(x) {
	pd.objectInit(this, x);
};

gh.katoxos.prototype.diefSet = function(dief) {
	var perioxi = pd.colvalGet.call(this, 'perioxi');

	this.dief = (dief === perioxi ? '' : dief);
	return this;
};

gh.katoxos.prototype.isNomikoProsopo = function() {
	if (this.morfi)
	return true;

	return this.eponimia;
};

gh.katoxos.prototype.isFisikoProsopo = function() {
	return !this.isNomikoProsopo();
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
};

gh.oxima.prototype.pinakidaGet = function() {
	return this.pinakida;
};

gh.oxima.prototype.markaGet = function() {
	return this.marka;
};

gh.oxima.prototype.xromaGet = function() {
	return this.xroma;
};

gh.oxima.prototype.tiposGet = function() {
	return this.tipos;
};

gh.oxima.prototype.katastasiGet = function() {
	return this.katastasi;
};

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

gh.oxima.prototype.fixChildren = function() {
	let that = this;

	this.katoxosWalk(function(x, i) {
		that.katoxos[i] = (new gh.katoxos(x));
	});

	return this;
};

// Η μέθοδος "kiriosKatoxosGet" επιστρέφει τον αύξοντα αριθμό του κυρίου
// κατόχου οχήματος, όπου «κύριος κάτοχος» θεωρείται είτε ο μοναδικός κάτοχος
// του οχήματος, είτε ο πρώτος τη τάξει από αυτούς που κατέχουν το υψηλότερο
// ποσοστό συνιδιοκτησίας. Στην περίπτωση που το όχημα δεν διαθέτει κατόχους,
// η μέθοδος επιστρέφει undefined.

gh.oxima.prototype.kiriosKatoxosGet = function() {
	let idx = undefined;
	let pos = 0;

	this.katoxosWalk((k, i) => {
		if (k.pososto <= pos)
		return;

		idx = i + 1;
		pos = k.pososto;
	});

	return idx;
}

gh.oxima.prototype.isKinisi = function() {
	switch (this.katastasi) {
	case 'ΚΙΝΗΣΗ':
		return true;
	default:
		return false;
	}
};

gh.oxima.prototype.noKinisi = function() {
	return !this.isKinisi();
};

gh.oxima.prototype.isEpivatiko = function() {
	switch (this.tipos) {
	case 'ΕΠΙΒΑΤΙΚΟ':
		return true;
	default:
		return false;
	}
};

gh.oxima.prototype.noEpivatiko = function() {
	return !this.isEpivatiko();
};

///////////////////////////////////////////////////////////////////////////////@
