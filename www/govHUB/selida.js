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
w3gh.anazitisiCount = 0;

$(document).ready(() => {
	w3gh.
	formSetup().
	buttonSetup();
});

w3gh.formSetup = () => {
let pinakida;
let afm;

pinakida = 'ΝΒΝ9596';
pinakida = ''

afm = '';
afm = '043514613'; // ΑΝΕΝΕΡΓΟΣ
afm = '032792320';
afm = '095675861'; // ΝΟΜΙΚΟ ΠΡΟΣΩΠΟ

	w3gh.bodyDOM = $(document.body);
	w3gh.resultsDOM = $('#resultsRegion');
	w3gh.pinakidaDOM = $('#pinakida').focus().
	val(pinakida);
	w3gh.imerominiaDOM = $('#imerominia').datepicker().
	val(pd.dateTime(new Date(), '%D-%M-%Y'));
	w3gh.afmDOM = $('#afm').
	val(afm);
	w3gh.ipovoliDOM = $('#ipovoli');
	w3gh.katharismosDOM = $('#katharismos');
	w3gh.akiroDOM = $('#akiro');

	return w3gh;
};

w3gh.buttonSetup = () => {
	w3gh.ipovoliDOM.
	on('click', (e) => {
		e.stopPropagation();

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
		'url': 'http://' + php.server['HTTP_HOST'] + ':' + w3gh.opts.portNumber,
		'header': {
			'Access-Control-Allow-Origin': '*',
		},
		'dataType': 'json',
		'data': x,
		'success': (x) => {
			if (x.hasOwnProperty('error')) {
				w3gh.resultErrmsg(resDOM, x.error);
				w3gh.anazitisi(data);
				return;
			}
				
			try {
				let t = new gh[x.idos](x.data);

				if (t.fixChildren && (typeof(t.fixChildren) === 'function'))
				t.fixChildren();

				let html = t.html();

				resDOM.
				removeClass('resreq').
				addClass('resbingo resbingo' + (resDOM.data('aa') % 2)).
				empty().
				append(html);

				let bc = resDOM.css('background-color');

				resDOM.
				css('background-color', '#ffcc00');

				resDOM.
				finish().
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
			console.error(err);
			w3gh.resultErrmsg(resDOM, 'σφάλμα αναζήτησης');
			w3gh.anazitisi(data);
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
