///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Το παρόν οδηγεί φόρμα αναζήτησης οχημάτων, κατόχων οχημάτων, φυσικών και
// νομικών προσώπων μέσω της πλατφόρμας "govHUB".
//
// Updated: 2019-12-31
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraClient.js`);

if (!process.env.CHT_BASEDIR)
process.env.CHT_BASEDIR = '/var/opt/cht';

const gh = require(`${process.env.CHT_BASEDIR}/lib/govHUB/apiClient.js`);

const w3gh = {};
w3gh.opts = {};
w3gh.opts.portNumber = php.requestGet('port', 12345);
w3gh.opts.kimeno = {
	'pafsi': 'Παύση',
	'sinexisi': 'Συνέχιση',
};

w3gh.anazitisiCount = 0;

$(document).ready(() => {
	w3gh.
	formSetup().
	buttonSetup().
	exec();
});

w3gh.exec = () => {
	let pinakida;
	let afm;
	let mazika;

	pinakida = 'ΝΒΝ9596';	// NISSAN
	pinakida = 'ΝΙΟ2332';	// MERCEDES (πέντε συνιδιοκτήτες)
	pinakida = ''

	afm = '043514613';	// ανενεργό ΑΦΜ
	afm = '032792320';	// εγώ
	afm = '095675861';	// νομικό πρόσωπο
	afm = '';

	mazika = '';
	mazika = '23572901 ΑΗΜ7551 2017-01-31\n' + '23126130 ΙΜΡ3593 2017-01-31\n' +
		'23126010 ΝΜΑ0436 2017-01-31\n' + '23125988 ΝΜΡ0911 2017-01-31\n' +
		'23125943 ΒΑΖ2942 2017-01-31\n' + '23125459 C7912HP 2017-01-31\n' +
		'23125410 ΕΡΝ3400 2017-01-31\n' + '23125390 ΚΖΜ0012 2017-01-31\n' +
		'23125376 ΝΟΟ0609 2017-01-31\n' + '23125361 ΝΟΤ0352 2017-01-31';
	mazika = '032792320\n\n043514613\n095675861\nΝΒΝ9596\nΝΕΧ7500\n\n032792320';

	w3gh.pinakidaDOM.val(pinakida);
	w3gh.imerominiaDOM.val(pd.dateTime(new Date(), '%D-%M-%Y'));
	w3gh.afmDOM.val(afm);
	w3gh.mazikaDOM.val(mazika);
	//w3gh.ipovoliDOM.trigger('click');

	return w3gh;
};

w3gh.formSetup = () => {
	$('form > table td').css('vertical-align', 'top');
	w3gh.bodyDOM = $(document.body);
	w3gh.resultsDOM = $('#resultsRegion');
	w3gh.pinakidaDOM = $('#pinakida').focus();
	w3gh.imerominiaDOM = $('#imerominia').datepicker();
	w3gh.afmDOM = $('#afm');
	w3gh.mazikaDOM = $('#mazika');
	w3gh.trexonDOM = $('#trexon');

	w3gh.ipovoliDOM = $('#ipovoli');
	w3gh.clrFormDOM = $('#clrForm');
	w3gh.akirosiDOM = $('#akirosi');
	w3gh.pafsiDOM = $('#pafsi');
	w3gh.clrRsltDOM = $('#clrRslt');
	w3gh.pafsiReset();

	w3gh.formatSetup();
	return w3gh;
};

w3gh.formatSetup = () => {
	w3gh.formatHelpDOM = $('#formatHelp');
	w3gh.formatDOM = $('#format');

	const flist = [
		{ "format": "",		"desc": "✶Ελεύθερο✶" },
		{ "format": "x @o x",	"desc": "Παράβαση Όχημα Ημερομηνία" },
		{ "format": "@a @o",	"desc": "ΑΦΜ Όχημα" },
		{ "format": "x:x:@a",	"desc": "Αρ. Αδείας:Ημερομηνία:ΑΦΜ" },
	];
	let format = {};

	pd.arrWalk(flist, v => {
		format[v.desc] = v.format;
		w3gh.formatHelpDOM.
		append($('<option>').
		attr('value', v.desc).
		text(v.desc));
	});

	w3gh.formatHelpDOM.
	on('change', function() {
		w3gh.formatDOM.val(format[$(this).val()]);
	});

	return w3gh;
};

w3gh.buttonSetup = () => {
	w3gh.ipovoliDOM.
	on('click', (e) => {
		e.stopPropagation();
		w3gh.pafsiReset();

		let data = [];
		let x;

		x = w3gh.pinakidaDOM.val();

		if (x) {
			let t = {
				'idos': 'oxima',
				'oxima': x,
			};

			let d = w3gh.imerominiaDOM.val();

			if (d)
			d = pd.date2date(d, 'DMY', '%Y-%M-%D');

			if (d)
			t.imerominia = d;

			data.push(t);
		};

		x = w3gh.afmDOM.val();

		if (x)
		data.push({
			'idos': 'prosopo',
			'afm': x,
		});

		x = w3gh.mazikaDOM.val();

		let a = x.split(/\s/);
		pd.arrWalk(a, (v) => {
			if (v.match(/^[0-9]+$/))
			return data.push({
				'idos': 'prosopo',
				'afm': v,
			});

			let a = v.split(/:/);

			if (a.length < 1)
			return;

			if (!a[0])
			return;

			return data.push({
				'idos': 'oxima',
				'oxima': v,
			});

		});

		w3gh.anazitisi(data);
		return false;
	});

	w3gh.akirosiDOM.
	on('click', (e) => {
		e.stopPropagation();
		w3gh.
		anastoliAnazitisis().
		pafsiReset();
	});

	w3gh.pafsiDOM.
	on('click', (e) => {
		e.stopPropagation();

		if (w3gh.isPause())
		w3gh.sinexisi();

		else
		w3gh.pafsi();
	});

	w3gh.clrFormDOM.
	on('click', (e) => {
		e.stopPropagation();
		w3gh.trexonDOM.empty();
		return true;
	});


	w3gh.clrRsltDOM.
	on('click', (e) => {
		e.stopPropagation();

		w3gh.resultsDOM.empty();
		w3gh.anastoliAnazitisis();

		let data = w3gh.pafsiDOM.data('ipolipa');

		if (!data)
		return;

		if (!data.length)
		return;

		if (w3gh.isPause())
		return;

		w3gh.anazitisi(data);
	});

	return w3gh;
};

///////////////////////////////////////////////////////////////////////////////@

w3gh.anazitisi = (data) => {
	w3gh.pafsiUpdate(data);

	if (w3gh.isPause())
	return w3gh;

	if (!data.length)
	return w3gh;

	let x = data[0];
	let resDOM = w3gh.resultCreate(x);

	// Κρατάμε την τρέχουσα αναζήτηση σε μεταβλητή "xhr" του request/result
	// dom element ώστε να μπορούμε να ακυρώσουμε την αναζήτηση σε περίπτωση
	// που το θελήσουμε.

	resDOM.data('xhr', $.post({
		'url': 'http://' + php.serverGet('HTTP_HOST') + ':' + w3gh.opts.portNumber,
		'header': {
			'Access-Control-Allow-Origin': '*',
		},
		'dataType': 'json',
		'data': x,
		'success': (x) => {
			data.shift();
			resDOM.removeData('xhr');

			if (x.hasOwnProperty('error')) {
				w3gh.resultErrmsg(resDOM, x.error);
				w3gh.anazitisi(data);
				return;
			}
				
			try {
				let t = new gh[x.idos](x.data);

				if (typeof(t.fixChildren) === 'function')
				t.fixChildren();

				let dom;

				try {
					dom = t.kartaDOM();
				}

				catch (e) {
					dom = pd.kartaDOM(t);
				}

				resDOM.
				removeClass('resreq').
				addClass('resbingo resbingo' + (resDOM.data('aa') % 2)).
				empty().
				append(dom);

				let bc = resDOM.css('background-color');

				resDOM.
				css('background-color', '#ffcc00');

				resDOM.
				finish().
				delay(500).
				animate({
					'background-color': bc,
				}, 3000, 'easeOutQuint');
			}

			catch (e) {
				console.error(e);
				w3gh.resultErrmsg(resDOM, 'σφάλμα επιστροφής');
			}

			w3gh.anazitisi(data);
		},
		'error': (err) => {
			if (err.statusText !== 'abort')
			console.error(err);

			let xhr = resDOM.data('xhr');

			if (!xhr)
			return resDOM.remove();

			if (!$('.resreq').length)
			return;

			resDOM.removeClass('resreq');
			w3gh.resultErrmsg(resDOM, 'σφάλμα αναζήτησης');
			data.shift();
			w3gh.anazitisi(data);
		},
	}));

	return w3gh;
};

w3gh.anastoliAnazitisis = () => {
	$('.resreq').each(function() {
		let xhr = $(this).data('xhr');

		if (!xhr)
		return true;

		$(this).removeData('xhr');
		xhr.abort();
		return true;
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
		msg = 'Ακαθόριστo είδος αναζήτησης';

		if (typeof(data.idos) === 'string')
		msg += ':' + data.idos + ':';

		break;
	}

	w3gh.trexonDOM.html(msg);
	msg += '<div class="resreqWorking">' +
		'<img class="resreqWorkingImage" src="../images/bares.gif"></div>';

	return $('<div>').
	addClass('result resreq').
	data('message', msg).
	data('aa', w3gh.anazitisiCount++).
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

///////////////////////////////////////////////////////////////////////////////@

// Η function "pafsi" αναστέλλει την τρέχουσα αναζήτηση.

w3gh.pafsi = () => {
	// Αν βρισκόμαστε ήδη σε κατάσταση αναστολής τρέχουσας αναζήτησης
	// τότε δεν χρειάζεται να προβούμε σε περαιτέρω ενέργειες.

	if (w3gh.isPause())
	return w3gh;

	// Αν υπάρχουν ανοικτά αιτήματα προς τον server, τα ακυρώνουμε.

	w3gh.anastoliAnazitisis();

	let data = w3gh.pafsiDOM.data('ipolipa');

	if (!data)
	return w3gh.pafsiReset();

	if (!data.length)
	return w3gh.pafsiReset();

	w3gh.akirosiDOM.
	css('display', 'inline-block');

	w3gh.pafsiDOM.
	css('display', 'inline-block').
	val(w3gh.opts.kimeno.sinexisi);

	return w3gh;
};

w3gh.sinexisi = () => {
	if (w3gh.noPause())
	return w3gh;

	let data = w3gh.pafsiDOM.data('ipolipa');

	if (!data)
	return w3gh.pafsiReset();

	if (!data.length)
	return w3gh.pafsiReset();

	w3gh.akirosiDOM.
	css('display', 'inline-block');

	w3gh.pafsiDOM.
	css('display', 'inline-block').
	val(w3gh.opts.kimeno.pafsi);

	w3gh.anazitisi(data);
	return w3gh;
};

w3gh.pafsiReset = () => {
	w3gh.akirosiDOM.
	css('display', 'none');

	w3gh.pafsiDOM.
	removeData('ipolipa').
	val(w3gh.opts.kimeno.pafsi).
	css('display', 'none');

	return w3gh;
};

w3gh.pafsiUpdate = (data) => {
	if (!data.length)
	return w3gh.pafsiReset();

	w3gh.akirosiDOM.
	css('display', 'inline-block');

	w3gh.pafsiDOM.
	data('ipolipa', data).
	val(w3gh.opts.kimeno.pafsi).
	css('display', 'inline-block');

	return w3gh;
};

// Η function "isPause" ελέγχει αν βρισκόμαστε σε κατάσταση αναστολής
// τρέχουσας αναζήτησης.

w3gh.isPause = () => {
	// Πρώτα ελέγχουμε την ετικέτα του πλήκτρου η οποία πρέπει να
	// είναι "Επανεκκίνηση".

	if (w3gh.pafsiDOM.val() !== w3gh.opts.kimeno.sinexisi)
	return false;

	// Κατόπιν ελέγχουμε τα δεδομένα αναζήτησης που υπήρχαν όταν
	// έγινε η αναστολή· αν δεν έχουμε τέτοια δεδομένα θεωρούμε
	// ότι δεν βρισκόμαστε σε κατάσταση αναστολής αναζήτησης.

	let data = w3gh.pafsiDOM.data('ipolipa');
	return (data && data.length);
};

w3gh.noPause = () => {
	return !w3gh.isPause();
};
