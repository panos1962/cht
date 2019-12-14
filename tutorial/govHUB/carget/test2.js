gh.opts.debug = true;
carget.processInput = (x, callback) => {
	var a = x.rawData.split('\t');

	if (a > 0)
	return;

	x.reqData.oxima = a[1];

	if (a.length > 2)
	x.reqData.date = a[2];

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
