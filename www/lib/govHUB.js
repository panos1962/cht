///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Updated: 2019-12-21
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

module.exports = function(gh) {
if (gh === undefined)
gh = window;

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

///////////////////////////////////////////////////////////////////////////////@
};
