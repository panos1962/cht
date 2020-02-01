///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// www/dimas/proklisi/isodos.js —— Πρόγραμμα οδήγησης σελίδας εισόδου στο
// πρόγραμμα δημιουργίας και επεξεργασίας προ-κλήσεων.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα οδηγεί τη σελίδα καταχώρησης συνθηματικών εισόδου στο
// πρόγραμμα δημιουργίας και επεξεργασίας προ-κλήσεων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-01-30
// Created: 2020-01-29
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd =
require('../../../mnt/pandora/lib/pandoraClient.js');

module.exports = function(Proklisi) {
///////////////////////////////////////////////////////////////////////////////@

Proklisi.menuIsodosSetup = () => {
	Proklisi.menuIsodosDOM = $('<div>').
	data('fyi', 'Επιλέξτε μέθοδο πιστοποίησης').
	addClass('proklisiMenu').
	addClass('proklisiEnotita').
	addClass('proklisiEnotitaActive').
	css('height', 'auto').

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.astinomikosTabDOM = $('<div>').
	data('exec', Proklisi.isodosAstinomikosExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Είσοδος με κωδικό Δ.Α.'))).

	append(Proklisi.ipalilosTabDOM = $('<div>').
	data('exec', Proklisi.isodosIpalilosExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Είσοδος Α.Μ. Υπαλλήλου'))).

	append(Proklisi.xristisTabDOM = $('<div>').
	data('exec', Proklisi.isodosXristisExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Είσοδος με όνομα χρήστη')))).

	append($('<div>').addClass('proklisiMenuLine').

	append(Proklisi.passwordTabDOM = $('<div>').
	data('exec', Proklisi.isodosPasswordExec).
	addClass('proklisiMenuTab').
	css('visibility', 'hidden').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Εισαγωγή μυστικού κωδικού'))));

	Proklisi.menuIsodosDOM.
	appendTo(pd.ofelimoDOM);

	Proklisi.menuIsodosDOM.
	data('height', Proklisi.menuIsodosDOM.height());

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.isodosAstinomikosSetup = () => {
	Proklisi.isodosAstinomikosDOM = Proklisi.enotitaDOM().
	data('fyi', 'Πληκτρολογήστε κωδικό/όνομα δημοτικού αστυνομικού').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['greek'],
			pd.paletaList['latin'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': true,
		'scribe': Proklisi.isodosAstinomikosScribe,
		'submit': () => Proklisi.menuRise(Proklisi.menuIsodosDOM),
		'change': Proklisi.isodosAstinomikosCheckData,
	}));

	return Proklisi;
};

Proklisi.isodosAstinomikosScribe = (paletaDOM) => {
	let inputDOM = paletaDOM.children('.pandoraPaletaInput');
	let text = inputDOM.val();
	let list = text.split('');
	let zoomDOM = paletaDOM.children('.pandoraPaletaZoom');

	zoomDOM.empty();

	if (!list.length)
	return pd;

	let re = '';

	if (paletaDOM.data('zoomStrict'))
	re += '^';

	re += list.shift();
	pd.arrayWalk(list, (c) => {
		re += '.*' + c;
	});

	let match = [];

	try {
		re = new RegExp(re, 'i');

		pd.arrayWalk(Proklisi.astinomikosList, (x) => {
			let s = x.kodikos + x.onomateponimo;

			if (s.match(re)) 
			return match.push(x);
		});
	}

	catch (e) {
		return pd;
	}

	if (!match.length)
	return pd;

	zoomDOM = paletaDOM.children('.pandoraPaletaZoom');
	pd.arrayWalk(match, (x) => {
		$('<div>').
		addClass('pandoraPaletaZoomGrami').
		data('value', x).
		text('[' + x.kodikos + '] ' + x.onomateponimo).
		appendTo(zoomDOM);
	});

	return pd;
};

Proklisi.isodosAstinomikosCheckData = (paletaDOM) => {
	let astinomikosDOM = Proklisi.astinomikosTabDOM;
	let astinomikos = paletaDOM.data('value');

	if (astinomikos) {
		Proklisi.isodosOnomataClear();
		Proklisi.menuTabStatus(astinomikosDOM.
		data('astinomikosData', astinomikos), 'success');
		Proklisi.menuTabFyi(astinomikosDOM, astinomikos.onomateponimo);

		Proklisi.passwordTabDOM.
		css('visibility', '').
		trigger('click');

		return Proklisi;
	}

	Proklisi.menuTabStatus(astinomikosDOM.
	removeData('astinomikosData'),  'clear');
	Proklisi.menuTabFyi(astinomikosDOM);
	Proklisi.passwordTabDOM.css('visibility', 'hidden');

	return Proklisi;
};

Proklisi.isodosAstinomikosExec = () => {
	Proklisi.enotitaActivate(Proklisi.isodosAstinomikosDOM);
	return Proklisi;
};

Proklisi.isodosIpalilosExec = () => {
};

Proklisi.isodosXristisExec = () => {
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.isodosPasswordSetup = () => {
	Proklisi.isodosPasswordDOM = Proklisi.enotitaDOM().
	data('fyi', 'Πληκτρολογήστε το password').
	append(pd.paleta({
		'paleta': [
			pd.paletaList['latin'],
			pd.paletaList['symbols'],
		],
		'keyboard': php.requestIsYes('keyboard'),
		'scribe': Proklisi.isodosAstinomikosScribe,
		'submit': () => Proklisi.menuRise(Proklisi.menuIsodosDOM),
		'change': Proklisi.isodosPasswordCheckData,
	}));

	return Proklisi;
};

Proklisi.isodosPasswordExec = () => {
	Proklisi.enotitaActivate(Proklisi.isodosPasswordDOM);
	return Proklisi;
};

Proklisi.isodosPasswordCheckData = (paletaDOM) => {
	let xristis = Proklisi.isodosXristisGet();
	if (!xristis) {
		pd.fyiError('Ακαθόριστα στοιχεία χρήστη');
		return Proklisi;
	}

	xristis.kodikos = paletaDOM.data('text');
	$.post({
		'url': '../../lib/prosvasi.php',
		'type': 'POST',
		'dataType': 'text',
		'data': xristis,

		'success': (rsp) => {
			if (rsp)
			return pd.fyiError(rsp);

			let url = 'http://';
			url += php.serverGet('HTTP_HOST');
			url += php.serverGet('PHP_SELF');

			let qs = php.serverGet('QUERY_STRING');

			if (qs)
			url += '?' + qs;

			window.location = url;
		},

		'error': (err) => {
			console.error(err);
			pd.fyiError('Ανεπιτυχής έλεγχος πρόσβασης');
		},
	});

	return Proklisi;
};

Proklisi.isodosXristisGet = () => {
	let xristis = Proklisi.astinomikosTabDOM.
	data('astinomikosData');

	if (xristis)
	return {
		'idos': 'dimas',
		'login': xristis.kodikos,
	};

	return undefined;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.isodosOnomataClear = () => {
	Proklisi.astinomikosTabDOM.removeData('astinomikosData');
	Proklisi.menuTabFyi(Proklisi.astinomikosTabDOM);

	Proklisi.ipalilosTabDOM.removeData('ipalilosData');
	Proklisi.menuTabFyi(Proklisi.ipalilosTabDOM);

	Proklisi.xristisTabDOM.removeData('xristisData');
	Proklisi.menuTabFyi(Proklisi.xristisTabDOM);

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@
};
