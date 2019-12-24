afmget.processInput = (x, callback) => {
	var a = x.rawData.split('\t');

	x.keyData.afm = a[0];

	gh.afmGet(x, (x) => {
		callback(x);
	});
};

afmget.processOutput = (x) => {
	if (x.hasOwnProperty('error'))
	return console.error(x.rawData + ': ' + x.error);

	process.stdout.write(x.rawData);
	process.stdout.write('\t');
	console.log(x.prosopo.eponimo);
};
