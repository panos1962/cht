//gh.debugSet();
//pd.ttyMute();

carget.processInput = (x, callback) => {
	var a = x.rawData.split('\t');

	if (a > 0)
	return;

	x.keyData.oxima = a[1];

	if (a.length > 2)
	x.keyData.date = a[2];

	gh.oximaGet(x, (x) => {
		callback(x);
	});
};

carget.processOutput = (x) => {
	if (x.hasOwnProperty('error'))
	return console.error(x.rawData + ': ' + x.error);

	let katoxos = x.oxima.katoxos;

	if (katoxos.length <= 0)
	return console.error(x.rawData + ': δεν υπάρχει κάτοχος');

	let print = function(x) {
		process.stdout.write(x.toString());
	};

	for (let i = 0; i < katoxos.length; i++) {
		print(x.rawData);
		print('\t');
		print(katoxos[i].pososto);
		print('\t');
		print(katoxos[i].afm);
		print('\t');
		print(katoxos[i].onomasiaGet());
		print('\n');
	}
};
