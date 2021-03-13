///////////////////////////////////////////////////////////////////////////////@
//
// Το παρόν μπορεί να χρησιμοποιηθεί ως interface προς το πρόγραμμα αναζήτησης
// στοιχείων οχημάτων που εμπλέκονται σε πραβάσεις ΚΟΚ που έχουν βεβαιωθεί από
// τις αρμόδιες υπηρεσίες του Δήμου Θεσσαλονίκης. Πιο συγκεκριμένα, μπορούμε
// να τρέξουμε την παρακάτω εντολή:
//
//	GH carget -s opsoiKlisi.js
//
// και να δώσουμε στο input μια γραμμή για κάθε παράβαση, όπου κάθε γραμμή
// πρέπει να περιέχει πεδία της παράβασης χωρισμένα μεταξύ τους με tabs, με
// το πρώτο πεδίο να είναι ο αριθμός κυκλοφορίας του οχήματος και το δεύτερο
// πεδίο να είναι η ημερομηνία παράβασης με format "YYYY-MM-DD".

"use strict";

const opsoiKlisi = {
	'fs': '\t',
	'rs': '\n',
	'katoxosEnasMono': true,
};

carget.processInput = (x, callback) => {
	var a = x.rawData.split(opsoiKlisi.fs);

	x.keyData.oxima = a[0];

	if (a.length > 1)
	x.keyData.date = a[1];

	gh.oximaGet(x, callback);
};

carget.processOutput = (x) => {
	if (x.hasOwnProperty('error'))
	return opsoiKlisi.error(x.rawData + ': ' + x.error);

	if (!x.hasOwnProperty('oxima'))
	return opsoiKlisi.error(x.rawData + ': "oxima" property missing');

	const oxima = x.oxima;

	if (!oxima.hasOwnProperty('katoxos'))
	return opsoiKlisi.error(x.rawData + ': "katoxos" property missing');

	if (oxima.katoxos.length < 1)
	return opsoiKlisi.error(x.rawData + ': δεν υπάρχουν κάτοχοι');

	if ((oxima.katoxos.length > 1) && opsoiKlisi.katoxosEnasMono)
	return opsoiKlisi.error(x.rawData + ': πολλαπλοί κάτοχοι');

	oxima.katoxos.forEach(function(katoxos) {
		opsoiKlisi.print(x.rawData);

		opsoiKlisi.print(oxima.marka);
		opsoiKlisi.print(oxima.xroma);
		opsoiKlisi.print(oxima.tipos);

		opsoiKlisi.print(katoxos.afm);
		opsoiKlisi.print(katoxos.doi);
		opsoiKlisi.print(katoxos.doiDesc);
		opsoiKlisi.print(katoxos.eponimo);
		opsoiKlisi.print(katoxos.onoma);
		opsoiKlisi.print(katoxos.patronimo);
		opsoiKlisi.print(katoxos.mitronimo);
		opsoiKlisi.print(katoxos.dief);
		opsoiKlisi.print(katoxos.perioxi);
		opsoiKlisi.print(katoxos.tk);
		opsoiKlisi.print(katoxos.pososto);

		opsoiKlisi.print();
	});
};

opsoiKlisi.printing = false;

opsoiKlisi.print = function(s) {
	if (s === undefined) {
		if (!opsoiKlisi.printing)
		return opsoiKlisi;

		process.stdout.write(opsoiKlisi.rs);
		opsoiKlisi.printing = false;
		return opsoiKlisi;
	}

	if (opsoiKlisi.printing)
	process.stdout.write(opsoiKlisi.fs);

	else
	opsoiKlisi.printing = true;

	if (typeof(s) !== 'string')
	s = s.toString();

	process.stdout.write(s);
	return opsoiKlisi;
};

opsoiKlisi.error = function(s) {
	process.stderr.write(s);
	process.stderr.write('\n');

	return opsoiKlisi;
};
