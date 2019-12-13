carget.processInput = (x, callback) => {
	var a = x.input.rawData.split('\t');

	x.input.reqData.oxima = a[0];

	if (a.length > 1)
	x.input.reqData.date = a[1];

	gh.carGet(x, (x) => {
		callback(x);
	});
};

carget.processOutput = (x) => {
	if (x.hasOwnProperty('error'))
	return console.error(x.input.rawData + ': ' + x.error);

	process.stdout.write(x.input.rawData);
	process.stdout.write('\t');
	console.log(x.oxima.katoxos[0].eponimo);
};
