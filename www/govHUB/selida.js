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
	let dom = $('<p>').
		appendTo(w3gh.resultsDOM).
		html(JSON.stringify(x));

	$.post({
		'url': Globals.server + ':' + w3gh.opts.portNumber,
		'header': {
			'Access-Control-Allow-Origin': '*',
		},
		'dataType': 'json',
		'data': x,
		'success': (x) => {
			dom.empty().text(JSON.stringify(x));
			w3gh.anazitisi(data);
		},
		'error': (err) => {
			dom.remove();
			console.error(err);
		},
	});

	return w3gh;
};
