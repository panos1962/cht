///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// carget.js -- node program το οποίο αιτείται στοιχεία οχημάτων/κατόχων από
// την πλατφόρμα "govHUB" του Υπουργείου Εωτερικών.
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

const readline = require('readline');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const gh = require(pd.env('CHT_BASEDIR', '/var/opt/cht') + '/lib/govHUB/api.js');

const carget = {};

carget.markEnd = () => {
	console.log("__END__");
};

carget.markError = () => {
	console.log("__ERR__");
};

// Η function "error" χρησιμοποιείται για την εκτύπωση μηνυμάτων λάθους,
// ενώ παράλληλα δηλώνει το τέλος αποστολής για το ανά χείρας όχημα.

carget.error = (data, msg) => {
	pd.errmsg(data + ': ' + msg);

	if (data)
	process.stdout.write(JSON.stringify({
		"data": data,
		"error": msg,
	}));

	carget.markError();
};

// Το πρόγραμμα εκκινεί διαβάζοντας το (απαραίτητο) configuration file στο
// οποίο υπάρχουν τα στοιχεία επικοινωνίας μας με την πλατφόρμα "govHUB" σε
// μορφή JSON.

gh.confRead(`${process.env.CHT_BASEDIR}/private/govHUB.cf`, (conf) => {
	// Αφού διαβάσουμε επιτυχώς το configuration JSON object από το
	// configuration file, αιτούμαστε access token από την πλατφόρμα.
	
	gh.tokenGet(conf, (conf) => {
		// Μετά την επιτυχή επιστροφή του configuration object
		// εμπλουτισμένου με το πολυπόθητο access toekn, προχωρούμε
		// στο διάβασμα των αριθμών κυκλοφορίας των οχημάτων για τα
		// οποία επιθυμούμε στοιχεία οχήματος και κατόχων.

		pd.ttymsg('Reading cars...\n');
		readline.createInterface({
			'input': process.stdin,
			'crlfDelay': Infinity,
		}).

		// Το πρόγραμμα διαβάζει γραμμή γραμμή από το standard input.
		// σε κάθε γραμμή πρέπει να υπάρχει ακριβώς ένα JSON object
		// στο οποίο να περιλαμβάνεται οπωσδήποτε η property "oxima"
		// με τιμή τον αρ. κυκλοφορίας οχήματος. Για την αναζήτηση
		// των στοιχείων οχήματος/κατόχων είναι απαραίτητη και η
		// ημερομηνία για την οποία αναζητούμε στοιχεία, ωστόσο αν
		// την καθορίσουμε με την property "date", υποτίθεται η
		// τρέχουσα ημερομηνία.

		on('line', (line) => {
			// Επιχειρούμε να μετατρέψουμε σε JSON object τη γραμμή
			// που μόλις διαβάσαμε.

			try {
				var data = JSON.parse(line);
			}

			// Αν η γραμμή δεν μπορεί να μεταφραστεί σε JSON object,
			// σημαίνει ότι κάτι δεν είναι γραμμένο σωστά, οπότε
			// προχωρούμε στο επόμενο όχημα.

			catch (e) {
				return carget.error(line, 'syntax error');
			}

			// Η γραμμή έχει μεταφραστεί επιτυχώς σε JSON object
			// οπότε ελέγχουμε αν υπάρχει την απαραίτητη property
			// "oxima" με τιμή τον αριθμό κυκλοφορίας οχήματος.

			if (!data.hasOwnProperty('oxima'))
			return carget.error(line, "missing 'oxima' property");

			// Υφίσταται property "oxima" επομένως προχωρούμε στην
			// αναζήτηση των στοιχείων οχήματος/κατόχων. Η function
			// αναζήτησης στοιχείων οχήματος/κατόχων δέχεται ως
			// παραμέτρους ένα JSON object, το configuration object
			// και μια callback function.

			gh.carGet(data, conf, (oxima) => {
				if (oxima === undefined)
				return carget.markError();

				// Στο σημείο αυτό ο server της πλατφόρμας έχει
				// επιστρέψει ένα JSON object όπου περιέχονται
				// τα στοιχεία οχήματος/κατόχων, αλλά μπορεί να
				// περιέχονται και properties που αφορούν σε
				// σφάλματα, π.χ. μη υπαρκτό όχημα, κλπ. Όπως
				// και να έχει, μετατρέπουμε το επιστραφέν JSON
				// object σε string και το τυπώνουμε σε ολόκληρο
				// σε μια γραμμή στο standard output.

				console.log(JSON.stringify(oxima));
				carget.markEnd();
			});
		});
	});
});
