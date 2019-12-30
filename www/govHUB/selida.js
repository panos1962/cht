"use strict";

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraClient.js`);

if (!process.env.CHT_BASEDIR)
process.env.CHT_BASEDIR = '/var/opt/cht';

const gh = require(`${process.env.CHT_BASEDIR}/lib/govHUB/apiClient.js`);

const w3gh = {};
w3gh.opts = {};
w3gh.opts.portNumber = 11123;
w3gh.opts.kimeno = {
	'pause': 'Pause',
	'resume': 'Resume',
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

	pinakida = 'ΝΒΝ9596';	// NISSAN
	pinakida = 'ΝΙΟ2332';	// MERCEDES (πέντε συνιδιοκτήτες)
	pinakida = ''

	afm = '043514613';	// ανενεργό ΑΦΜ
	afm = '032792320';	// εγώ
	afm = '095675861';	// νομικό πρόσωπο
	afm = '';

	mazika = '032792320\n\n043514613\n095675861\nΝΒΝ9596\nΝΕΧ7500\n\n032792320';

	w3gh.pinakidaDOM.val(pinakida);
	w3gh.imerominiaDOM.val(pd.dateTime(new Date(), '%D-%M-%Y'));
	w3gh.afmDOM.val(afm);
	w3gh.mazikaDOM.val(mazika);
	w3gh.ipovoliDOM.trigger('click');

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
	w3gh.ipovoliDOM = $('#ipovoli');
	w3gh.katharismosDOM = $('#katharismos');
	w3gh.akiroDOM = $('#akiro');
	w3gh.pauseDOM = $('#pause');
	w3gh.pauseReset();

	return w3gh;
};

w3gh.buttonSetup = () => {
	w3gh.ipovoliDOM.
	on('click', (e) => {
		e.stopPropagation();
		w3gh.pauseReset();

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

	w3gh.akiroDOM.
	on('click', (e) => {
		e.stopPropagation();
		w3gh.
		anastoliAnazitisis().
		pauseReset();
	});

	w3gh.pauseDOM.
	on('click', (e) => {
		e.stopPropagation();

		if (w3gh.isPause())
		w3gh.resume();

		else
		w3gh.pause();
	});

	return w3gh;
};

///////////////////////////////////////////////////////////////////////////////@

w3gh.anazitisi = (data) => {
	w3gh.pauseUpdate(data);

	if (w3gh.isPause())
	return w3gh;

	if (!data.length)
	return w3gh;

	let x = data[0];
	let resDOM = w3gh.resultCreate(x);

	// Κρατάμε την τρέχουσα αναζήτηση σε μεταβλητή "xhr" του reuqest/result
	// dom element ώστε να μπορούμε να ακυρώσουμε την αναζήτηση σε περίπτωση
	// που το θελήσουμε.

	resDOM.data('xhr', $.post({
		'url': 'http://' + php.server['HTTP_HOST'] + ':' + w3gh.opts.portNumber,
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
			let xhr = resDOM.data('xhr');

			if (!xhr)
			return resDOM.remove();

			console.error(err);
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

// Η function "pause" αναστέλλει την τρέχουσα αναζήτηση.

w3gh.pause = () => {
	// Αν βρισκόμαστε ήδη σε κατάσταση αναστολής τρέχουσας αναζήτησης
	// τότε δεν χρειάζεται να προβούμε σε περαιτέρω ενέργειες.

	if (w3gh.isPause())
	return w3gh;

	// Αν υπάρχουν ανοικτά αιτήματα προς τον server, τα ακυρώνουμε.

	w3gh.anastoliAnazitisis();

	let data = w3gh.pauseDOM.data('ipolipa');

	if (!data)
	return w3gh.pauseReset();

	if (!data.length)
	return w3gh.pauseReset();

	w3gh.pauseDOM.
	css('display', 'inline-block').
	val(w3gh.opts.kimeno.resume);

	return w3gh;
};

w3gh.resume = () => {
	if (w3gh.noPause())
	return w3gh;

	let data = w3gh.pauseDOM.data('ipolipa');

	if (!data)
	return w3gh.pauseReset();

	if (!data.length)
	return w3gh.pauseReset();

	$(this).
	css('display', 'inline-block').
	val(w3gh.opts.kimeno.pause);

	w3gh.anazitisi(data);
	return w3gh;
};

w3gh.pauseReset = () => {
	w3gh.pauseDOM.
	removeData('ipolipa').
	val(w3gh.opts.kimeno.pause).
	css('display', 'none');

	return w3gh;
};

w3gh.pauseUpdate = (data) => {
	if (!data.length)
	return w3gh.pauseReset();

	w3gh.pauseDOM.
	data('ipolipa', data).
	val(w3gh.opts.kimeno.pause).
	css('display', 'inline-block');

	return w3gh;
};

// Η function "isPause" ελέγχει αν βρισκόμαστε σε κατάσταση αναστολής
// τρέχουσας αναζήτησης.

w3gh.isPause = () => {
	// Πρώτα ελέγχουμε την ετικέτα του πλήκτρου η οποία πρέπει να
	// είναι "Resume".

	if (w3gh.pauseDOM.val() !== w3gh.opts.kimeno.resume)
	return false;

	// Κατόπιν ελέγχουμε τα δεδομένα αναζήτησης που υπήρχαν όταν
	// έγινε η αναστολή· αν δεν έχουμε τέτοια δεδομένα θεωρούμε
	// ότι δεν βρισκόμαστε σε κατάσταση αναστολής αναζήτησης.

	let data = w3gh.pauseDOM.data('ipolipa');
	return (data && data.length);
};

w3gh.noPause = () => {
	return !w3gh.isPause();
};
