///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// carget.js -- node program το οποίο αιτείται στοιχεία οχημάτων/κατόχων από
// την πλατφόρμα "govHUB" του Υπουργείου Εωτερικών.
//
// Last update: 2019-12-16
//
///////////////////////////////////////////////////////////////////////////////@
//
// Το πρόγραμμα βασίζεται στο node module "govHUB/api.js" το οποίο αποτελεί
// wrapper του "govHUB" API που παρέχεται από την πλατφόρμα "govHUB" για την
// αναζήτηση στοιχείων οχημάτων/κατόχων.
//
// Το πρόγραμμα λειτουργεί είτε αυτόνομα είτε μέσω του shell script "carget".
// Η αυτόνομη λειτουργία του προγράμματος επιτυγχάνεται απλώς με την εντολή:
//
//	node carget.js
//
// Κατά την αυτόνομη λειτουργία το πρόγραμμα διαβάζει αριθμούς κυκλοφορίας
// οχημάτων και ημερομηνίες από το standard input, και επιστρέφει (εκτυπώνει)
// στοιχεία των οχημάτων και των κατόχων τους κατά τη συγκεκριμένη ημερομηνία.
//
// Το πρόγραμμα μπορεί να διαλειτουργήσει με τον awk όταν αναζητούμε στοιχεία
// οχημάτων/κατόχων μέσω των παραβάσεων ΚΟΚ που βεβαιώνει η αρμόδια Υπηρεσία
// του Δήμου Θεσσαλονίκης. Στην περίπτωση αυτή το πρόγραμμα διαβάζει γραμμές
// με τον αριθμό παράβασης, τον αριθμό κυκλοφορίας οχήματος και την ημερομηνία
// παράβασης (tab separated) και επιστρέφει (εκτυπώνει) τα στοιχεία οχημάτων
// και κατόχων κατά τη συγκεκριμένη ημερομηνία, μαζί με τον αριθμό παράβασης.
//
///////////////////////////////////////////////////////////////////////////////@

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const util = require('util');
const lblr = require('line-by-line');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const gh = require(`${pd.env('CHT_BASEDIR:=/var/opt/cht')}/lib/govHUB/api.js`);

const carget = {};

if (!carget.hasOwnProperty('conf'))
carget.conf = `${process.env.CHT_BASEDIR}/private/govHUB.cf`;

carget.init = () => {
	// Το πρόγραμμα εκκινεί διαβάζοντας το (απαραίτητο) configuration file
	// στο οποίο υπάρχουν τα στοιχεία επικοινωνίας μας με την πλατφόρμα
	// "govHUB" γραμμένα σε μορφή JSON.

	gh.confRead(carget.conf, (conf) => {
		// Αφού διαβάσουμε επιτυχώς το configuration JSON object από
		// το configuration file, αιτούμαστε access token από την
		// πλατφόρμα.
	
		gh.tokenGet(conf, (conf) => {
			// Μετά την επιτυχή επιστροφή του configuration
			// object, εμπλουτισμένου με το πολυπόθητο access
			// token, προχωρούμε στο διάβασμα των αριθμών
			// κυκλοφορίας των οχημάτων για τα οποία επιθυμούμε
			// στοιχεία οχήματος και κατόχων.

			carget.readOxima(conf);
		});
	});
};

carget.readOxima = (conf) => {
	pd.ttymsg('Reading cars...\n');

	// Ανοίγουμε κανάλι εισόδου δεδομένων (input stream) από το standard
	// input και διαβάζουμε γραμμή-γραμμή μέσω της "readline".

	const readLine = new lblr(process.stdin, {
		encoding: 'utf8',
		skipEmptyLines: false,
	})

	// Για κάθε γραμμή που διαβάζουμε εκτελούμε την function "processInput"
	// που παρέχεται ως property του global singleton "carget". Για λόγους
	// ευκολίας το πρόγραμμα παρέχει μια default "processInput" function,
	// αλλά μορούμε να καθορίσουμε custom "processInput" προκειμένου να
	// διαχειριστούμε δεδομένα που τηρούν τις default προδιαγραφές.

	.on('line', (line) => {
		readLine.pause();
		carget.processInput({
			'conf': conf,
			'rawData': line,
			'keyData': {},
		}, (x) => {
			carget.processOutput(x);
			readLine.resume();
		});
	});
};

// Η function "processInput" καλείται για κάθε γραμμή δεδομένων που διαβάζουμε
// από το standard input και δέχεται ως παραμέτρους ένα JSON object και μια
// callback function. Απαραίτητη προϋπόθεση για να λειτουργήσει η function
// "processInput" είναι να περιλαμβάνονται στο input JSON object οι παρακάτω
// properties:
//
//	A) Property "conf" με τιμή το "govHUB" configuration JSON object
//	   εμπλουτισμένο με το access token.
//
//	B) Property "rawData" με τιμή τη γραμμή που μόλις διαβάσαμε ως string.
//
//	C) Property "keyData" με τιμή ένα κενό object.
//
// Τα παραπάνω πρέπει προφανώς να ισχύουν και για τυχόν custom "processInput"
// functions που ενδεχομένως να χρησιμοποιήσουμε προκειμένου να διαχειριστούμε
// input διαφορετικού format από το default format που είναι: κάθε γραμμή
// αποτελείται από ακριβώς ένα JSON object στο οποίο περιέχονται μεταξύ άλλων,
// properties "oxima" με τιμή τον αριθμό κυκλοφορίας οχήματος, και "date" με
// τιμή την ημερομηνία για την οποία αναζητούμε στοιχεία για το συγκεκριμένο
// όχημα· η property "date" είναι προαιρετική και αν δεν δοθεί υποτίθεται η
// τρέχουσα ημερομηνία.

carget.processInput = (x, callback) => {
	try {
		var data = JSON.parse(x.rawData);
	}

	catch (e) {
		x.error = 'invalid JSON format';
		return callback(x);
	}

	if (data.hasOwnProperty('oxima'))
	x.keyData.oxima = data.oxima;

	if (data.hasOwnProperty('date'))
	x.keyData.date = data.date;

	// Έχουμε το input object εμπλουτισμένο με τα απαραίτητα δεδομένα,
	// οπότε προβαίνουμε στην αναζήτηση στοιχείων οχήματος/κατόχων μέσω
	// της API function "oximaGet". Η εν λόγω function θα προσθέσει στο
	// input object, property "oxima" με τα στοιχεία οχήματος/κατόχων
	// όπως αυτά επεστράφησαν από την πλατφόρμα, ενώ αν εμφανιστεί
	// οποιοδήποτε σφάλμα, θα επιστραφεί σχετικό μήνυμα μέσω της
	// property "error".

	gh.oximaGet(x, (x) => {
		callback(x);
	});
};

carget.processOutput = (x) => {
	console.log(util.inspect(x, {
		'compact': false,
		'depth': Infinity,
		'showHidden': true,
	}));
};
