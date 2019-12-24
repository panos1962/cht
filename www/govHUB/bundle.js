(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Updated: 2019-12-24
// Updated: 2019-12-21
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const gh = require('/var/opt/cht/lib/govHUB/apiCore.js');
module.exports = gh;

///////////////////////////////////////////////////////////////////////////////@

const pd = require('/var/opt/pandora/lib/pandoraClient.js');

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

},{"/var/opt/cht/lib/govHUB/apiCore.js":2,"/var/opt/pandora/lib/pandoraClient.js":5}],2:[function(require,module,exports){
///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// goveHUB/apiCore.js -- JavaScript module το οποίο περιλαμβάνει τις βασικές
// δομές που αποτελούν το interface προς την εξωτερική πλατφόρμα "govHUB".
// Με το όρο «βασικές δομές» εννοούμε εκείνα τα στοιχεία της γλώσσας που
// είναι απαραίτητα τόσο στον server (node programs), όσο και στον client
// (browser applications).
//
// Updated: 2019-12-24
// Updated: 2019-12-21
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const gh = {};
module.exports = gh;

///////////////////////////////////////////////////////////////////////////////@

const pd = require('/var/opt/pandora/lib/pandoraCore.js');

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

},{"/var/opt/pandora/lib/pandoraCore.js":6}],3:[function(require,module,exports){
"use strict";

const gh = require('/var/opt/cht/lib/govHUB/apiClient.js');
const pd = require('/var/opt/pandora/lib/pandoraClient.js');

const w3gh = {};
w3gh.opts = {};
w3gh.opts.portNumber = 11123;

$(document).ready(() => {
	w3gh.bodyDOM = $(document.body);
	w3gh.resultsDOM = $('#resultsRegion');
	w3gh.pinakidaDOM = $('#pinakida').
	val('ΝΒΝ9596');
	w3gh.afmDOM = $('#afm').
	val('032792320');
	w3gh.ipovoliDOM = $('#ipovoli');
	w3gh.katharismosDOM = $('#katharismos');
	w3gh.akiroDOM = $('#akiro');

	w3gh.buttonSetup();

	pd.testClient();
	var x = new gh.oxima();
	console.log(x);
});

w3gh.buttonSetup = () => {
	w3gh.ipovoliDOM.
	on('click', (e) => {
		e.stopPropagation();

		let data = [];
		let x;

		x = w3gh.pinakidaDOM.val();

		if (x)
		data.push({
			'idos': 'oxima',
			'oxima': x,
		});

		x = w3gh.afmDOM.val();

		if (x)
		data.push({
			'idos': 'prosopo',
			'afm': x,
		});

		w3gh.anazitisi(data);
		return false;
	});

	return w3gh;
};

w3gh.anazitisi = (data) => {
	if (data.length <= 0)
	return w3gh;

	let x = data.shift();
	let resDOM = w3gh.resultCreate(x);

	$.post({
		'url': Globals.server + ':' + w3gh.opts.portNumber,
		'header': {
			'Access-Control-Allow-Origin': '*',
		},
		'dataType': 'json',
		'data': x,
		'success': (x) => {
			resDOM.
			removeClass('resreq').
			text(JSON.stringify(x));
			w3gh.anazitisi(data);
		},
		'error': (err) => {
			w3gh.resultErrmsg(resDOM, 'σφάλμα αναζήτησης');
			w3gh.anazitisi(data);
			console.error(err);
		},
	});

	return w3gh;
};

w3gh.resultCreate = (data) => {
	var dom;
	var msg;

	switch (data.idos) {
	case 'oxima':
		msg = 'Αναζήτηση οχήματος με αρ. κυκλοφορίας:';

		if (data.hasOwnProperty('oxima'))
		msg += ' <b>' + data.oxima + '</b>';

		if (data.hasOwnProperty('imerominia'))
		msg += ' <b>(' + data.imerominia + '</b>)';

		break;
	case 'prosopo':
		msg = 'Αναζήτηση προσώπου με ΑΦΜ:';

		if (data.hasOwnProperty('afm'))
		msg += ' <b>' + data.afm + '</b>';

		break;
	default:
		msg = 'Ακαθόριστη αναζήτηση!';
		break;
	}

	msg += '<div class="resreqWorking">' +
		'<img class="resreqWorkingImage" src="../images/bares.gif"></div>';
	return $('<div>').
	addClass('result resreq').
	html(msg).
	prependTo(w3gh.resultsDOM);
};

w3gh.resultErrmsg = (dom, msg) => {
	dom.
	children('.resreqWorking').
	remove();

	dom.
	removeClass('resreq').
	addClass('reserr').
	append(': ' + msg);

	return w3gh;
};

},{"/var/opt/cht/lib/govHUB/apiClient.js":1,"/var/opt/pandora/lib/pandoraClient.js":5}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (process){
"use strict";

if (process.env.PANDORA_BASEDIR === undefined)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(process.env.PANDORA_BASEDIR + '/lib/pandoraCore.js');
module.exports = pd;

pd.testClient = (msg) => {
	pd.testCore('Greetings from client!');

	if (msg === undefined)
	msg = 'Hi there!';

	console.log('pandora: [testClient]: ' + msg);
};

}).call(this,require('_process'))
},{"_process":4}],6:[function(require,module,exports){
(function (process){
///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// pandoraCore.js -- JavaScript core module για χρήση τόσο στον server
// (node), όσο και στον client (browser).
//
// Updated: 2019-12-25
// Updated: 2019-12-24
// Updated: 2019-12-21
// Updated: 2019-12-20
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd = {};
module.exports = pd;

///////////////////////////////////////////////////////////////////////////////@

// Η function "testCore" χρησιμοποιείται κυρίως για να διαπιστώσουμε την
// επιτυχή συμπερίληψη του ανά χείρας module. Πιο συγκεκριμένα, επειδή το
// core module είναι κοινό τόσο στον server όσο και στον client, μπορούμε
// να καλέσουμε την "testCore" προκειμένου να δούμε αν έχει φορτωθεί σωστά
// το pandora core mudule.
//
// Server side:
//
//	...
//	if (!process.env.PANDORA_BASEDIR)
//	process.env.PANDORA_BASEDIR = '/var/opt/pd';
//
//	const pandora = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraServer.js`);
//	pandora.testServer();
//	...
//
// Client side:
//
//	selida.js:
//		...
//		const pandora = require('../../lib/pandoraClient.js');
//
//		pandora.testClient();
//		...
//
//	Makefile:
//		...
//		PANDORA_BASEDIR = /var/opt/pandora
//		PANDORA_CORE = $(PANDORA_BASEDIR)/lib/pandoraCore.js
//		PANDORA_CLIENT = $(PANDORA_BASEDIR)/lib/pandoraClient.js
//		BUNDLE = bundle.js
//		BUNDLE_MODULES = selida.js $(PANDORA_CLIENT) $(PANDORA_CORET)
//
//		.PHONY: all
//		all: $(BUNDLE)
//
//		$(BUNDLE): $(BUNDLE_MODULES)
//			browserify -p tinyify -o $@ $^
//		...
//
//	index.html
//		...
//		<html>
//			<head>
//				...
//				<script src="bundle.js"></script>
//				...
//			</head>
//			<body>
//				...
//			</body>
//		</html>

pd.testCore = (msg) => {
	if (msg === undefined)
	msg = 'Hi there!';

	console.log('pandora: [testCore]: ' + msg);
};

// Η function "noop" είναι dummy και δεν κάνει απολύτως τίποτα. Η χρήση της
// αφορά κυρίως στην «ακύρωση» άλλων functions και μεθόδων.

pd.noop = () => {
	return pd;
};

// Η function "objectInit" δέχεται ως πρώτη παράμετρο ένα αντικείμενο (target),
// ως δεύτερη παράμετρο ένα άλλο αντικείμενο (source), ενώ ως τρίτη παράμετρο
// δέχεται ένα τρίτο αντικείμενο στο οποίο καθορίζονται παράμετροι (options)
// που διαφοροποιούν τη λειτουργία τής function όσον αφορά επιμέρους θέματα.
//
// Σκοπός τής function είναι να αρχικοποιήσει το target object, με οδηγό το
// source object. Πιο συγκεκριμένα, η συνήθης χρήση της function είναι να
// καλείται σε νεόκοπα objects με σκοπό να πάρουν αρχικές τιμές οι properties
// του αντικειμένου με βάση τις properties του source object.

pd.objectInit = function(target, source, opts) {
	var i;
	var j;

	if (source === undefined)
	return target;δ

	if (!opts)
	opts = {
		'functions': false,
		'recursive': true,
	};

	for (i in source) {
		j = ((opts.hasOwnProperty('colmap') &&
			opts.colmap.hasOwnProperty(i)) ? opts.colmap[i] : i);

		if (source[i] === undefined) {
			target[j] = undefined;
			continue;
		}

		if (source[i] === null) {
			target[j] = null;
			continue;
		}

		if (typeof(source[i]) === 'function') {
			if (opts.functions)
			target[j] = source[i];

			continue;
		}

		if (typeof(source[i]) !== 'object') {
			target[j] = source[i];
			continue;
		}

		if (!opts.recursive) {
			target[j] = source[i];
			continue;
		}

		if ((source[i].constructor) &&
			(typeof(source[i].constructor) === Function)) {
			target[j] = pd.objectInit(new source.constructor(), source[i], opts);
			continue;
		}

		target[j] = pd.objectInit(new Object(), source[i], opts);
	}

	return target;
};

// Η function "dateTime" επιστρέφει ημερομηνίες ως strings. Η μορφή τής
// ημερομηνίας που θα επιστραφεί καθορίζεται από το format sting που περνάμε
// ως δεύτερη παράμετρο και το οποίο μπορεί να περιέχει κωδικές περιγραφές για
// το έτος ("%Y"), τον μήνα ("%M"), την ημέρα ("%D"), την ώρα ("%h"), το λεπτό
// ("%m") και το δευτερόλεπτο ("%s"). Οι υπόλοιποι χαρακτήρες τού format string
// επιστρέφονται αυτούσιοι, ενώ το σύμβολο "%" είναι καλό να δίνεται ως "%%",
// προκειμένου να μην εκληφθεί ως προδιαγραφή κάποιου χρονικού στοιχείου. Αν
// δεν καθορίσουμε format string, τότε υποτίθεται το "%Y-%M-%D %h:%m:%s". Αν
// δεν καθορστεί παράμετρος ημερομηνίας, υποτίθεται η τρέχουσα ημερομηνία και
// ώρα.

pd.dateTime = (date, format) => {
	if (date === undefined)
	date = new Date();

	if (format === undefined)
	format = '%Y-%M-%D %h:%m:%s';

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	if (month < 10) month = '0' + month;

	var day = date.getDate();
	if (day < 10) day = '0' + day;

	var hour = date.getHours();
	if (hour < 10) hour = '0' + hour;

	var minute = date.getMinutes();
	if (minute < 10) minute = '0' + minute;

	var second = date.getSeconds();
	if (second < 10) second = '0' + second;

	return format.
	replace(/%%/g, '').
	replace(/%Y/g, year).
	replace(/%M/g, month).
	replace(/%D/g, day).
	replace(/%h/g, hour).
	replace(/%m/g, minute).
	replace(/%s/g, second).
	replace(//g, '%')
};

pd.date = (date) => {
	return pd.dateTime(date, '%Y-%M-%D');
};

pd.time = (time) => {
	return pd.dateTime(time, '%h-%m-%s');
};

pd.debug = (msg, opts) => {
	let stream = process.stderr;

	if (opts === undefined)
	opts = {};

	if (opts.hasOwnProperty('stream')) {
		stream = opts.stream;
		delete opts.stream;
	}

	if (!opts.hasOwnProperty('depth'))
	opts.depth = Infinity;

	if (!opts.hasOwnProperty('compact'))
	opts.compact = false;

	if (!opts.hasOwnProperty('colors'))
	opts.colors = stream.isTTY;

	stream.write(pd.dateTime());

	if (!msg)
	return pd;

	stream.write(' >>');
	stream.write(typeof(msg) === 'string' ? msg : util.inspect(msg, opts));
	stream.write('<<\n');

	return pd;
};

pd.random = (max, min) => {
	if (max === undefined)
	max = Number.MAX_SAFE_INTEGER;

	if (min === undefined)
	min = 0;

	return Math.floor(Math.random() * (max - min)) + min;
};

pd.randar = (a) => {
	return a[pd.random(a.length)];
};

// Η function "colvaSet" καλείται ως μέθοδος μέσω της "call" και θέτει την
// τιμή ("val") μιας property ("col") εφόσον η τιμή αυτή είναι ορισμένη.

pd.colvalSet = function(col, val) {
	delete this[col];

	if (val === undefined)
	return this;

	if (val === null)
	return this;

	this[col] = val;

	return this;
};

// Η function "colvaGet" καλείται ως μέθοδος μέσω της "call" και επιστρέφει
// την τιμή μιας property ("col") εφόσον η τιμή αυτή είναι ορισμένη, αλλιώς
// επιστρέφει ένα κενό string.

pd.colvalGet = function(col) {
	const noval = '';

	if (!this.hasOwnProperty(col))
	return noval;

	if (this[col] === undefined)
	return noval;

	if (this[col] === null)
	return noval;

	return this[col];
};

///////////////////////////////////////////////////////////////////////////////@

}).call(this,require('_process'))
},{"_process":4}]},{},[3]);
