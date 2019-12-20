const w3gh = {};
w3gh.opts = {};
w3gh.opts.portNumber = 11123;

$(document).ready(() => {
	w3gh.bodyDOM = $(document.body);
	w3gh.ipovoliDOM = $('#ipovoli');
	w3gh.katharismosDOM = $('#katharismos');
	w3gh.akiroDOM = $('#akiro');

	w3gh.buttonSetup();
});

w3gh.buttonSetup = () => {
	w3gh.ipovoliDOM.
	on('click', (e) => {
		e.stopPropagation();
		$.post({
			'url': Globals.server + ':' + w3gh.opts.portNumber,
			'header': {
				'Access-Control-Allow-Origin': '*',
			},
			'dataType': 'json',
			'data': {
				x: 1,
				y: 'panos',
			},
			'success': (data) => {
				console.log(data);
			},
			'error': (err) => {
				console.error(err);
			},
		});

		return false;
	});

	return w3gh;
};
