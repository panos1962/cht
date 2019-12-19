const gh3w = {};

$(document).ready(() => {
	gh3w.bodyDOM = $(document.body);
	gh3w.ipovoliDOM = $('#ipovoli');
	gh3w.katharismosDOM = $('#katharismos');
	gh3w.akiroDOM = $('#akiro');

	gh3w.buttonSetup();
});

gh3w.buttonSetup = () => {
	gh3w.ipovoliDOM.
	on('click', (e) => {
		e.stopPropagation();
		$.post(Globals.server + ':11123', {
			'header': {
				'Header set Access-Control-Allow-Origin': '*',
			},
			'data': {
				x: 1,
				y: 'panos',
			},
		});
		return false;
	});

	return gh3w;
};
