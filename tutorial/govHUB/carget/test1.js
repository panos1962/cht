carget.processInput = (x, callback) => {
	var a = x.rawData.split('\t');

	x.reqData.oxima = a[0];

	if (a.length > 1)
	x.reqData.date = a[1];

	gh.carGet(x, (x) => {
		callback(x);
	});
};

carget.processOutput = (x) => {
	if (x.hasOwnProperty('error'))
	return console.error(x.rawData + ': ' + x.error);

	process.stdout.write(x.rawData);
	process.stdout.write('\t');
	console.log(x.oxima.katoxos[0].eponimo);
};
