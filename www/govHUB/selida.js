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
		'url': 'http://' + php.server['HTTP_HOST'] + ':' + w3gh.opts.portNumber,
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
