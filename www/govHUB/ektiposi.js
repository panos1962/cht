///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
///////////////////////////////////////////////////////////////////////////////@

const rpt = {};
const main = window.opener;
const w3gh = main.w3gh;

rpt.defs = {
	'hideOxima': 'Απόκρυψη Οχημάτων',
	'showOxima': 'Εμφάνιση Οχημάτων',
	'excelOxima': 'Excel Οχημάτων',
	'hideProsopo': 'Απόκρυψη Προσώπων',
	'showProsopo': 'Εμφάνιση Προσώπων',
	'excelProsopo': 'Excel Προσώπων',
	'formatParavasi': 'p,@c,@d',
	'titlosOxima': {},
	'excelOxima': {},
};

rpt.defs.titlosOxima[rpt.defs.formatParavasi] = 'ΚΑΤΑΣΤΑΣΗ ΠΑΡΑΒΑΣΕΩΝ Κ.Ο.Κ.';
rpt.defs.excelOxima[rpt.defs.formatParavasi] = 'Excel Οχημάτων';
rpt.tmpfiles = [];

///////////////////////////////////////////////////////////////////////////////@

$(document).ready(() => {
	rpt.bodyDOM = $(document.body);
	rpt.formatOxima = w3gh.formatDOM.val();

	rpt.
	panelSetup().
	resultsSetup().
	exec();
});

$(window).on('beforeunload', () => {
	$.post({
		'url': 'cleanup.php',
		'data': {
			'tmpfiles': rpt.tmpfiles,
		},
	});
});

///////////////////////////////////////////////////////////////////////////////@

rpt.panelSetup = () => {
	let panelDOM = $('<div>').addClass('panel').appendTo(rpt.bodyDOM);
	rpt.panelOximaDOM = $('<div>').addClass('subpanel').appendTo(panelDOM);
	rpt.panelProsopoDOM = $('<div>').addClass('subpanel').appendTo(panelDOM);

	rpt.panelOximaDOM.

	append($('<input>').
	attr('type', 'button').
	val(rpt.defs.excelOxima).
	val(rpt.defs.excelOxima.hasOwnProperty(rpt.oximaFormat) ?
	rpt.defs.excelOxima[rpt.oximaFormat] : 'Excel Οχημάτων').
	on('click', (e) => {
		e.stopPropagation();
		rpt.excelConvert('oxima');
	})).

	append($('<input>').
	attr('type', 'button').
	val(rpt.defs.hideOxima).
	on('click', function(e) {
		e.stopPropagation();
		rpt.toggleOxima($(this));
	}));

	rpt.panelProsopoDOM.

	append($('<input>').
	attr('type', 'button').
	val(rpt.defs.excelProsopo).
	on('click', (e) => {
		e.stopPropagation();
		rpt.excelConvert('prosopo');
	})).
	append($('<input>').
	attr('type', 'button').
	val(rpt.defs.hideProsopo).
	on('click', function(e) {
		e.stopPropagation();
		rpt.toggleProsopo($(this));
	}));

	return rpt;
};

rpt.resultsSetup = () => {
	rpt.resultsDOM = $('<div>').
	attr('id', 'results').
	appendTo(rpt.bodyDOM);

	return rpt;
};

rpt.exec = () => {
	rpt.
	ektiposiOxima().
	ektiposiProsopo();
};

///////////////////////////////////////////////////////////////////////////////@

rpt.ektiposiOxima = () => {
	let count = 0;
	let row;

	rpt.katastasiOximaDOM = $('<table>').addClass('katastasi');

	row = $('<tr>').appendTo(rpt.katastasiOximaDOM);

	row.
	append($('<th>').
	attr('colspan', 1000).
	addClass('titlos').
	append($('<div>').
	addClass('titlosText').
	text(rpt.defs.titlosOxima.hasOwnProperty(rpt.formatOxima) ?
	rpt.defs.titlosOxima[rpt.formatOxima] : 'ΚΑΤΑΣΤΑΣΗ ΟΧΗΜΑΤΩΝ')));

	row = $('<tr>').appendTo(rpt.katastasiOximaDOM);
	row.
	append($('<th>').addClass('aspasto').text('Α/Α'));

	if (rpt.formatOxima === rpt.defs.formatParavasi)
	row.
	append($('<th>').text('ΠΑΡΑΒΑΣΗ')).
	append($('<th>').addClass('aspasto').text('ΗΜΕΡΟΜΗΝΙΑ'));

	row.
	append($('<th>').text('ΑΡ.ΚΥΚΛ.')).
	append($('<th>').text('ΜΑΡΚΑ')).
	append($('<th>').text('ΧΡΩΜΑ')).
	append($('<th>').text('ΤΥΠΟΣ')).
	append($('<th>').text('#')).
	append($('<th>').text('%')).
	append($('<th>').text('ΑΦΜ')).
	append($('<th>').text('ΕΠΩΝΥΜΙΑ')).
	append($('<th>').text('ΜΟΡΦΗ')).
	append($('<th>').text('ΕΠΩΝΥΜΟ')).
	append($('<th>').text('ΟΝΟΜΑ')).
	append($('<th>').text('ΠΑΤΡΩΝΥΜΟ')).
	append($('<th>').text('ΔΙΕΥΘΥΝΣΗ')).
	append($('<th>').text('ΤΚ')).
	append($('<th>').text('ΠΕΡΙΟΧΗ'));

	w3gh.resultsDOM.children('.RSLT_oxima').each(function() {
		try {
			let t = main.$(this).data('reqData');
			let x = main.$(this).data('resData');
			let opts = {};

			count++;
			opts.ante = [ count ];

			if (rpt.formatOxima === rpt.defs.formatParavasi) {
				if (!t)
				t = ',,';

				let a = t.split(',');
				opts.ante.push(a[0]);
				opts.ante.push(a[2]);
			}

			rpt.katastasiOximaDOM.append(x.gramiDOM(opts));
		}

		catch (e) {
			console.log(e);
		}

		return true;
	});

	if (!count) {
		rpt.katastasiOximaDOM.remove();
		rpt.panelOximaDOM.css('display', 'none');
		return rpt;
	}

	rpt.resultsDOM.append(rpt.katastasiOximaDOM);
	rpt.panelOximaDOM.css('display', 'inline-block');
	return rpt;
};

rpt.toggleOxima = (dom) => {
	switch (rpt.katastasiOximaDOM.css('display')) {
	case 'none':
		rpt.katastasiOximaDOM.css('display', 'table');
		dom.val(rpt.defs.hideOxima);
		break;
	default:
		rpt.katastasiOximaDOM.css('display', 'none');
		dom.val(rpt.defs.showOxima);
		break;
	}

	return rpt;
};

rpt.oximaAsArray = function(ante) {
	let x = [];

	if (rpt.formatOxima === rpt.defs.formatParavasi) {
		let a = ante.split(',');
console.log(a);

		if (a.length != 3)
		a = [ '', '', '', ];

		x.push(a[0]);
		x.push(a[2]);
	}

	let kk = this.kiriosKatoxosGet();
	kk = (kk === undefined ? new gh.katoxos() : this.katoxos[kk - 1]);

 	return x.concat([
		this.pinakida,
		this.marka,
		this.xroma,
		this.tipos,
		this.katoxos.length,
		kk.pososto,
		kk.afm,
		kk.eponimia,
		kk.morfi,
		kk.eponimo,
		kk.onoma,
		kk.patronimo,
		kk.dief,
		kk.tk,
		kk.perioxi,
	]);
};

///////////////////////////////////////////////////////////////////////////////@

rpt.ektiposiProsopo = () => {
	let count = 0;
	let row;

	rpt.katastasiProsopoDOM = $('<table>').addClass('katastasi');

	row = $('<tr>').appendTo(rpt.katastasiProsopoDOM);

	row.
	append($('<th>').
	attr('colspan', 1000).
	addClass('titlos').
	append($('<div>').
	addClass('titlosText').
	text('ΚΑΤΑΣΤΑΣΗ ΦΥΣΙΚΩΝ/ΝΟΜΙΚΩΝ ΠΡΟΣΩΠΩΝ')));

	row = $('<tr>').appendTo(rpt.katastasiProsopoDOM);

	row.
	append($('<th>').addClass('aspasto').text('Α/Α')).
	append($('<th>').text('ΑΦΜ')).
	append($('<th>').text('ΕΠΩΝΥΜΙΑ')).
	append($('<th>').text('ΜΟΡΦΗ')).
	append($('<th>').text('ΕΠΩΝΥΜΟ')).
	append($('<th>').text('ΟΝΟΜΑ')).
	append($('<th>').text('ΠΑΤΡΩΝΥΜΟ')).
	append($('<th>').text('ΓΕΝΝΗΣΗ')).
	append($('<th>').text('ΤΗΛΕΦΩΝΟ')).
	append($('<th>').text('ΔΙΕΥΘΥΝΣΗ')).
	append($('<th>').text('ΤΚ')).
	append($('<th>').text('ΠΕΡΙΟΧΗ')).
	append($('<th>').text('ΤΗΛΕΦΩΝΟ'));

	w3gh.resultsDOM.children('.RSLT_prosopo').each(function() {
		try {
			let x = main.$(this).data('resData');
			let opts = {};

			count++;
			opts.ante = [ count ];
			rpt.katastasiProsopoDOM.append(x.gramiDOM(opts));
		}

		catch (e) {
			console.log(e);
		}

		return true;
	});

	if (!count) {
		rpt.katastasiProsopoDOM.remove();
		rpt.panelProsopoDOM.css('display', 'none');
		return rpt;
	}

	rpt.resultsDOM.append(rpt.katastasiProsopoDOM);
	rpt.panelProsopoDOM.css('display', 'inline-block');
	return rpt;
};

rpt.toggleProsopo = (dom) => {
	switch (rpt.katastasiProsopoDOM.css('display')) {
	case 'none':
		rpt.katastasiProsopoDOM.css('display', 'table');
		dom.val(rpt.defs.hideProsopo);
		break;
	default:
		rpt.katastasiProsopoDOM.css('display', 'none');
		dom.val(rpt.defs.showProsopo);
		break;
	}

	return rpt;
};

rpt.prosopoAsArray = function() {
	return [
		this.afm,
		this.eponimia,
		this.morfi,
		this.eponimo,
		this.onoma,
		this.patronimo,
		this.genisi,
		this.tilefono,
		this.dief,
		this.tk,
		this.perioxi,
		this.kratos,
	];
};

///////////////////////////////////////////////////////////////////////////////@

rpt.excelConvert = (idos) => {
	let data = [];

	w3gh.resultsDOM.children('.RSLT_' + idos).each(function() {
		data.push(rpt[idos + 'AsArray'].
		call(main.$(this).data('resData'), main.$(this).data('reqData')));
		return true;
	});

	$.post({
		'url': 'excel.php',
		'header': {
			'Access-Control-Allow-Origin': '*',
		},
		'dataType': 'text',
		'data': {
			'data': data,
		},
		'success': (x) => {
			if (!x)
			return;

			rpt.tmpfiles.push(x);
			window.open('tmp/' + x, '_blank');
		},
		'fail': (e) => {
			console.log(e);
		},
	});

	return rpt;
};
