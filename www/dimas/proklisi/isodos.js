"use strict";

const pd =
require('../../../mnt/pandora/lib/pandoraClient.js');

module.exports = function(Proklisi) {
///////////////////////////////////////////////////////////////////////////////@

Proklisi.menuIsodosSetup = () => {
	Proklisi.menuIsodosDOM = $('<div>').
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
	html('Είσοδος με κωδικό ΟΠΣΟΥ'))).

	append(Proklisi.xristisTabDOM = $('<div>').
	data('exec', Proklisi.isodosXristisExec).
	addClass('proklisiMenuTab').
	append($('<div>').addClass('proklisiMenuTabFyi')).
	append($('<div>').addClass('proklisiMenuTabLabel').
	html('Είσοδος με όνομα χρήστη'))));

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
		return Proklisi;
	}

	Proklisi.menuTabStatus(astinomikosDOM.
	removeData('astinomikosData'),  'clear');
	Proklisi.menuTabFyi(astinomikosDOM);

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
