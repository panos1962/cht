///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Το παρόν οδηγεί φόρμα αναζήτησης οχημάτων, κατόχων οχημάτων, φυσικών και
// νομικών προσώπων μέσω της πλατφόρμας "govHUB".
//
// Το πρόγραμμα παρουσιάζει σελίδα στην οποία ο χρήστης μπορεί να καθορίσει
// κριτήρια αναζήτησης για:
//
//	⚫ Οχήματα και κατόχους οχημάτων μέσω αριθμού κυκλοφορίας οχήματος
//
//	⚫ Φυσικά ή νομικά πρόσωπα μέσω ΑΦΜ
//
// Το πρόγραμμα λειτουργεί σε συνεργασία με τον κατάλληλο server που εκτελεί
// τις αναζητήσεις. Ο server δέχεται αιτήματα σε συγκεκριμένη πόρτα δικτύου
// (default port 12345) και εκτελείται με την εντολή:
//
//	GH w3srv
//
// είτε στον server που διανέμει το πρόγραμμα, είτε σε άλλον υπολογιστή του
// δικτύου.
//
// Updated: 2020-01-01
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

///////////////////////////////////////////////////////////////////////////////@

const w3gh = {};

w3gh.opts = {};
w3gh.opts.portNumber = php.requestGet('port', 12345);
w3gh.opts.kimeno = {
	'pafsi': 'Παύση',
	'sinexisi': 'Συνέχιση',
	'opsoiGet': 'Εισαγωγή από ΟΠΣΟΥ',
	'opsoiAbort': 'Διακοπή εισαγωγής ΟΠΣΟΥ',
	'mazikaPlaceHolder': 'Καταχωρήστε ελεύθερα ΑΦΜ ή αριθμούς ' +
		'κυκλοφορίας οχημάτων. Εναλλακτικά επιλέξτε εισαγωγή ' +
		'στοιχείων από το ΟΠΣΟΥ',
};
w3gh.opts.sepChar = ',';
w3gh.opts.opsoiCountDefault = 10;
w3gh.opts.opsoiCountMax = 100;

w3gh.resultCount = 0;

///////////////////////////////////////////////////////////////////////////////@

$(document).ready(() => {
	w3gh.
	formSetup().
	buttonSetup().
	exec();
});

w3gh.exec = () => {
	if (php.requestGet('test') !== undefined)
	w3gh.execTest();

	delete w3gh.execTest;
	return w3gh;
};

w3gh.formSetup = () => {
	$('form > table td').css('vertical-align', 'top');
	w3gh.bodyDOM = $(document.body);
	w3gh.resultsDOM = $('#resultsRegion');
	w3gh.pinakidaDOM = $('#pinakida').focus();
	w3gh.imerominiaDOM = $('#imerominia').datepicker();
	w3gh.opsoiDOM = $('#opsoi');
	w3gh.opsoiCountDOM = $('#opsoiCount').val(w3gh.opts.opsoiCountDefault);
	w3gh.afmDOM = $('#afm');
	w3gh.mazikaDOM = $('#mazika').
	attr('placeholder', w3gh.opts.kimeno.mazikaPlaceHolder);
	w3gh.trexonDOM = $('#trexon');

	w3gh.ipovoliDOM = $('#ipovoli');
	w3gh.akirosiDOM = $('#akirosi');
	w3gh.pafsiDOM = $('#pafsi');
	w3gh.opsoiGetDOM = $('#opsoiGet');
	w3gh.clrFormDOM = $('#clrForm');
	w3gh.clrRsltDOM = $('#clrRslt');

	w3gh.
	pafsiReset().
	imerominiaSetup().
	opsoiSetup().
	formatSetup();

	return w3gh;
};

w3gh.imerominiaSetup = () => {
	w3gh.imerominiaDOM.
	on('change', () => {
		let imerominia = w3gh.imerominiaDOM.val();

		if (!imerominia)
		return w3gh.opsoiOff();
	});

	return w3gh;
};

w3gh.opsoiSetup = () => {
	w3gh.opsoiCountDOM.
	attr('placeholder', 'Max ' + w3gh.opts.opsoiCountMax).
	on('change', () => {
		let count = w3gh.opsoiCountDOM.val();
		let n = parseInt(count);

		if ((n != count) || (n < 1) || (n > w3gh.opts.opsoiCountMax))
		w3gh.opsoiOff();
	});

	w3gh.opsoiDOM.
	on('change', () => {
		if (!w3gh.opsoiDOM.prop('checked'))
		return w3gh.opsoiOff();

		let imerominia = w3gh.imerominiaDOM.val();

		if (!imerominia) {
			w3gh.imerominiaDOM.select();
			return w3gh.opsoiOff();
		}
			
		let count = w3gh.opsoiCountDOM.val();
		let n = parseInt(count);

		if ((n != count) || (n > 100) || (n < 1)) {
			w3gh.opsoiCountDOM.select();
			return w3gh.opsoiOff();
		}

		w3gh.opsoiGetDOM.
		addClass('buttonBlue').
		css('display', 'inline-block').
		val(w3gh.opts.kimeno.opsoiGet);
	});

	w3gh.opsoiGetDOM.
	on('click', () => {
		let xhr = w3gh.opsoiGetDOM.data('xhr');

		if (xhr)
		w3gh.opsoiAbort();

		else
		w3gh.opsoiSubmit();
	});

	return w3gh;
};

w3gh.formatSetup = () => {
	w3gh.formatDescDOM = $('#formatDesc');
	w3gh.formatDOM = $('#format');

	const flist = [
		{ "format": "",		"desc": "✶Ελεύθερο✶" },
		{ "format": "p,@c,@d",	"desc": "Παράβαση,Όχημα,Ημερομηνία" },
		{ "format": "@v,@c,@d",	"desc": "ΑΦΜ,Όχημα,Ημερομηνία" },
		{ "format": "a,d,@v",	"desc": "Αρ. Αδείας,Ημερομηνία,ΑΦΜ" },
		{ "format": "2,@o,3,@d","desc": "*,*,Όχημα,*,*,*,Ημερομηνία" },
	];

	const format = {};
	const tamrof = {};

	pd.arrayWalk(flist, v => {
		format[v.desc] = v.format;
		tamrof[v.format] = v.desc;

		w3gh.formatDescDOM.
		append($('<option>').
		attr('value', v.desc).
		text(v.desc));
	});

	w3gh.formatDescDOM.
	on('change', () => {
		w3gh.formatDOM.val(format[w3gh.formatDescDOM.val()]);
	});

	w3gh.formatDOM.
	on('change', () => {
		w3gh.formatDescDOM.val(tamrof[w3gh.formatDOM.val()]);
	});

	return w3gh;
};

w3gh.buttonSetup = () => {
	w3gh.ipovoliDOM.
	on('click', (e) => {
		e.stopPropagation();
		w3gh.pafsiReset();

		try {
			let data = [];
			w3gh.
			pinakidaPush(data).
			afmPush(data).
			mazikaPush(data).
			anazitisi(data);
		}

		catch (e) {
			console.error(e);
		}

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

		w3gh.pinakidaDOM.val('');
		w3gh.afmDOM.val('');
		w3gh.formatDOM.val('').trigger('change');
		w3gh.mazikaDOM.val('');

		w3gh.trexonDOM.empty();
		w3gh.opsoiOff();
		w3gh.pinakidaDOM.focus();

		return false;
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

w3gh.pinakidaPush = (data) => {
	let pinakida = w3gh.pinakidaDOM.val();

	if (!pinakida)
	return w3gh;

	let t = {
		'idos': 'oxima',
		'key': pinakida,
	};

	let d = w3gh.imerominiaGet();

	if (d)
	t.imerominia = d;

	data.push(t);
	return w3gh;
};

w3gh.afmPush = (data) => {
	afm = w3gh.afmDOM.val();

	if (!afm)
	return w3gh;

	data.push({
		'idos': 'prosopo',
		'key': afm,
	});

	return w3gh;
};

w3gh.mazikaPush = (data) => {
	let mazika = w3gh.mazikaDOM.val();

	if (!mazika)
	return w3gh;

	let flist = w3gh.formatSplit();

	if (!flist.length)
	return w3gh.pushWords(data, mazika);

	let rows = mazika.split(/[\n\r\v\f]+/);

	if (!rows.length)
	return w3gh;

	let date = w3gh.imerominiaGet();
	pd.arrayWalk(rows, (row) => {
		w3gh.parseRow(data, row, flist, date);
	});

	return w3gh;
};

w3gh.formatSplit = () => {
	let flist = [];
	let format = w3gh.formatDOM.val();

	if (!format)
	return flist;

	let a = format.split(w3gh.opts.sepChar);

	if (!a.length)
	return flist;

	pd.arrayWalk(a, (v) => {
		let n = parseInt(v);

		if (n != v) {
			flist.push(v);
			return;
		}

		while (n-- > 0)
		flist.push('*');
	});

	return flist;
};

w3gh.pushWords = (data, mazika) => {
	let a = mazika.split(/\s+/);

	if (!a.length)
	return w3gh;

	pd.arrayWalk(a, (x) => {
		if (!a)
		return;

		if (x.match(/^[0-9]+$/))
		return data.push({
			'idos': 'prosopo',
			'key': x,
		});

		return data.push({
			'idos': 'oxima',
			'key': x,
		});
	});

	return w3gh;
};

w3gh.parseRow = (data, row, flist, date) => {
	let cols = row.split(w3gh.opts.sepChar);

	if (!cols.length)
	return w3gh;

	if (!flist.length)
	return w3gh;

	let n = cols.length;

	if (flist.length < n)
	n = flist.length;

	let idos = undefined;
	let key = undefined;

	let sodi = undefined;
	let yek = undefined;

	for (let i = 0; i < n; i++) {

		switch (flist[i]) {
		case '@c':
			sodi = 'oxima';
			yek = cols[i];
			break;
		case '@v':
			sodi = 'prosopo';
			yek = cols[i];
			break;
		case '@d':
			date = pd.date2date(cols[i], 'DMY', '%Y-%M-%D');
			break;
		}

		if (!sodi)
		continue;

		if (!idos) {
			idos = sodi;
			key = yek;
			sodi = undefined;
			yek = undefined;
			continue;
		}

		w3gh.pushItem(data, idos, key, date);

		idos = undefined;
		key = undefined;
	}

	if (idos)
	w3gh.pushItem(data, idos, key, date);

	return w3gh;
};

w3gh.pushItem = (data, idos, key, date) => {
	let t = {};

	switch (idos) {
	case 'oxima':
		if (date)
		t.imerominia = date;
		break;
	case 'prosopo':
		break;
	default:
		return w3gh;
	}

	t.idos = idos;
	t.key = key;

	data.push(t);
	return w3gh;
};

///////////////////////////////////////////////////////////////////////////////@

w3gh.anazitisi = (data) => {
	w3gh.pafsiUpdate(data);

	if (w3gh.isPause())
	return w3gh;

	if (!data.length)
	return w3gh;

	let x = data[0]; // XXX avoid shift here!!!
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

		if (data.hasOwnProperty('key'))
		msg += ' <b>' + data.key + '</b>';

		if (data.hasOwnProperty('imerominia'))
		msg += ' <b>(' + data.imerominia + '</b>)';

		break;
	case 'prosopo':
		msg = 'Αναζήτηση προσώπου με ΑΦΜ:';

		if (data.hasOwnProperty('key'))
		msg += ' <b>' + data.key + '</b>';

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
	data('aa', w3gh.resultCount++).
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

///////////////////////////////////////////////////////////////////////////////@

w3gh.opsoiSubmit = () => {
	w3gh.opsoiGetDOM.
	removeClass('buttonBlue').
	addClass('buttonRed').
	val(w3gh.opts.kimeno.opsoiAbort).
	data('xhr', $.post({
		'url': 'opsoi.php',
		'header': {
			'Access-Control-Allow-Origin': '*',
		},
		'dataType': 'text',
		'data': {
			'imerominia': w3gh.imerominiaDOM.val(),
			'count': w3gh.opsoiCountDOM.val(),
		},

		// Εφόσον έχουμε θετική ανταπόκριση από το ΟΠΣΟΥ, θα πρέπει να
		// καταχωρήσουμε τα στοιχεία των παραβάσεων που επεστράφησαν
		// στο πεδίο μαζικής αναζήτησης.

		'success': (x) => {
			w3gh.opsoiOff();

			let s = w3gh.mazikaDOM.val();

			if (s)
			s += '\n' + x;
	
			else
			s = x;

			w3gh.mazikaDOM.val(s);
			w3gh.formatDOM.val('p,@c,@d').trigger('change');
		},

		'error': (err) => {
			w3gh.opsoiOff();

			if (err.statusText !== 'abort')
			console.error(err);
		},
	}));

	return w3gh;
};

w3gh.opsoiOn = () => {
	w3gh.opsoiAbort();
	w3gh.opsoiDOM.prop('checked', true);

	w3gh.opsoiGetDOM.
	removeClass('buttonRed').
	addClass('buttonBlue').
	val(w3gh.opts.kimeno.opsoiGet);

	return w3gh;
};

w3gh.opsoiOff = () => {
	w3gh.opsoiDOM.
	prop('checked', false);

	w3gh.opsoiGetDOM.
	removeData('xhr').
	removeClass('buttonRed').
	removeClass('buttonBlue').
	css('display', 'none').
	val('');

	return w3gh;
};

w3gh.opsoiAbort = () => {
	let xhr = w3gh.opsoiDOM.data('xhr')

	if (!xhr)
	return w3gh;

	w3gh.opsoiDOM.removeData('xhr');
	xhr.abort();

	return w3gh;
};

///////////////////////////////////////////////////////////////////////////////@

w3gh.imerominiaGet = () => {
	let d = w3gh.imerominiaDOM.val();

	if (!d)
	return undefined;
 
	return pd.date2date(d, 'DMY', '%Y-%M-%D');
};

w3gh.execTest = () => {
	let pinakida;
	pinakida = 'ΝΒΝ9596';	// NISSAN
	pinakida = 'ΝΙΟ2332';	// MERCEDES (πέντε συνιδιοκτήτες)
	pinakida = ''

	let imerominia;
	imerominia = '';
	imerominia = '31-07-2018';
	imerominia = pd.dateTime(new Date(), '%D-%M-%Y');

	let afm;
	afm = '043514613';	// ανενεργό ΑΦΜ
	afm = '032792320';	// εγώ
	afm = '095675861';	// νομικό πρόσωπο
	afm = '';

	let mazika;
	mazika = '23572901 ΑΗΜ7551 2017-01-31\n' + '23126130 ΙΜΡ3593 2017-01-31\n' +
		'23126010 ΝΜΑ0436 2017-01-31\n' + '23125988 ΝΜΡ0911 2017-01-31\n' +
		'23125943 ΒΑΖ2942 2017-01-31\n' + '23125459 C7912HP 2017-01-31\n' +
		'23125410 ΕΡΝ3400 2017-01-31\n' + '23125390 ΚΖΜ0012 2017-01-31\n' +
		'23125376 ΝΟΟ0609 2017-01-31\n' + '23125361 ΝΟΤ0352 2017-01-31';
	mazika = '032792320,ΝΒΝ9596,23-03-2016';
	mazika = '';
	mazika = '032792320 043514613 095675861\nΝΒΝ9596 ΝΕΧ7500\n\n' +
		'032792320 ΝΑΧ6802';

	let ipovoli;
	ipovoli = false;
	ipovoli = true;

	w3gh.pinakidaDOM.val(pinakida);
	w3gh.imerominiaDOM.val(imerominia);
	w3gh.afmDOM.val(afm);
	w3gh.mazikaDOM.val(mazika);

	if (ipovoli)
	w3gh.ipovoliDOM.trigger('click');

	return w3gh;
};
