Ακολουθεί παράδειγμα δεδομένων οχήματος/κατόχων οπως επιστρέφεται από την
σχετική πλατφόρμα "govHUB":

{
	getVehicleInformationOutputRecord: { 
		arithmosKykloforias: "ΝΕΝ9999",
		marka: "OPEL ASTRA G-CC",
		xrwma: "ΠΡΑΣΙΝΟ",
		typosOxhmatos: "ΕΠΙΒΑΤΙΚΟ ",
		arithmosPlaisioy: "WOLFFGG48X5882881",
		katastashOxhmatos: "ΚΙΝΗΣΗ",

		katoxoiList: [ 
			{ 
				afm: "123456789   ",
				percent: 50.0,
				doy: "4234",
				doyDesc: "ΙΩΝΙΑΣ ΘΕΣΣΑΛΟΝΙΚΗΣ",
				appelation: null,
				legalStatusDesc: null,
				surname: "ΠΟΥΤΣΟΣ",
				secondSurname: null,
				firstName: "ΑΡΧΙΔΗΣ",
				fathersFirstName: "ΜΑΛΑΚΑΣ",
				mothersFirstName: "ΚΑΡΙΟΛΑ",
				address: "ΓΕΩΡΓΙΟΥ ΜΑΛΑΚΟΥ",
				addressNo: "9999     ",
				parZipCode: "99777",
				parDescription: "ΚΩΛΟΠΕΤΙΝΙΤΣΑ",
				katoxosErrorInfo: null
			},
			{ 
				afm: "712211221   ",
				percent: 50.0,
				doy: "4234",
				doyDesc: "ΙΩΝΙΑΣ ΘΕΣΣΑΛΟΝΙΚΗΣ",
				appelation: null,
				legalStatusDesc: null,
				surname: "ΜΟΥΝΙΤΣΑ",
				secondSurname: null,
				firstName: "ΓΑΜΙΟΛΑ",
				fathersFirstName: "ΚΩΛΟΣ",
				mothersFirstName: "ΜΑΛΑΚΙΑ",
				address: "ΓΕΩΡΓΙΟΥ ΠΑΠΑΝΔΡΕΟΥ",
				addressNo: "9999     ",
				parZipCode: "99777",
				parDescription: "ΚΩΛΟΠΕΤΙΝΙΤΣΑ",
				katoxosErrorInfo: null
			}
		]
	},

	callSequenceId: 1269744125.0,
	callSequenceIdSpecified: true,
	callSequenceDate: "2019-12-03T20:55:00.654+02:00",
	callSequenceDateSpecified: true,

	errorRecord: { 
		errorCode: null,
		errorDescr: null
	}
}

Ωστόσο, τα παραπάνω δεν τα λαμβάνουμε απευθείας από την πλατφόρμα "govHUB",
παρά μέσω του προγράμματος "GH/carget" στο οποίο είθισται να περνάμε, εκτός
από τον αρ. κυκλοφορίας του οχήματος, τον κωδικό και την ημερομηνία της
παράβασης. Το πρόγραμμα "GH/carget" επιστρέφει τα παραπάνω δεδομένα
εγκιβωτισμένα σε μεγαλύτερο JSON object το οποίο έχει την παρακάτω μορφή:

{
	vehicle: {
		// Το παραπάνω JSON object όπως επεστράφη από την
		// πλατφόρμα "govHUB".
		...
	},
	date: "2019-03-23",
	id: "223981234"
}

Αν δώσουμε πολλές παραβάσεις, το αποτέλεσμα θα είναι μια σειρά από JSON objects
της παραπάνω μορφής, ήτοι:

{
	vehicle: { ... },
	date: ...,
	id: ...
}

{
	vehicle: { ... },
	date: ...,
	id: ...
}

...

Αυτά τα δεδομένα μπορούμε να τα περάσουμε στο πρόγραμμα "GH/carparse" το
οποίο επιπεδοποιεί τα JSON data και τα εκτυπώνει σε tsv format.
