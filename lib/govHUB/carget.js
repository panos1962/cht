const fs = require('fs');
const readline = require('readline');
const request = require('request');

const tty = fs.createWriteStream('/dev/tty');

tty.write('Reading configuration...');
fs.readFile('private/govHUB.cf', 'utf8', (err, data) => {
	var conf;

	if (err)
	throw err;

	eval('conf = ' + data + ';');
tty.write('\nRequesting connect token...');
	request({
		'url': conf.oxima.token.url,
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/form',
			'Accept': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		'form': {
			'grant_type': 'client_credentials',
			'response_type': 'code token',
			'client_id': conf.oxima.token.client.id,
			'client_secret': conf.oxima.token.client.secret,
			'scope': 'GovHub.GsisVehicle.Basic',
		}
	}, (err, rsp, body) => {
		if (err)
		throw err;

		conf.oxima.dataget.token = JSON.parse(body).access_token;
tty.write('\nReading cars...\n');
		carGet(conf.oxima.dataget);
	});
});

function carGet(conf) {
	const readData = readline.createInterface({
		input: process.stdin,
		crlfDelay: Infinity,
	});

	readData.on('line', (line) => {
tty.write('Requesting data for "' + line + '"...');
		var opts = {
			'url': conf.url,
			'method': 'POST',
			'headers': {
				'Accept': 'text/plain',
				'Authorization': 'Bearer ' + conf.token,
				'Content-Type': 'application/json',
				'Content-Encoding': 'utf8',
			},
			'body': JSON.stringify({
				'auditRecord': {
					'auditUserId': conf.user.id,
					'auditUserIp': conf.user.ip,
					'auditTransactionId': 1,
					'auditProtocolNumber': 1,
					'auditProtocolDate': '2019-12-03',
				},
				'getVehicleInformationInputRecord': {
					'arithmosKykloforias': line,
					'requestDate': '2019-12-03',
				},
			}),
		};

		request(opts, (err, rsp, body) => {
			if (err)
			throw err;

tty.write('\n');
			process.stdout.write(body);
		});
	});
};