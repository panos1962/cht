///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
///////////////////////////////////////////////////////////////////////////////@

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const readline = require('readline');
const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandora.js`);
const govHUB = require(pd.env('CHT_BASEDIR', '/var/opt/cht') + '/lib/govHUB/api.js');

//pd.ttymsg = pd.noop;

function errorPrint(msg) {
	pd.errmsg(msg);
	process.stdout.write("ERROR\n");
}

govHUB.confRead(`${process.env.CHT_BASEDIR}/private/govHUB.cf`, (cfs) => {
	govHUB.tokenGet(JSON.parse('{' + cfs + '}'), (conf) => {
		pd.ttymsg('Reading cars...\n');
		const rl = readline.createInterface({
			'input': process.stdin,
			'crlfDelay': Infinity,
		}).on('line', (line) => {
			try {
				var data = JSON.parse(line);
			} catch (e) {
				return errorPrint(line + ": syntax error");
			}

			if (!data.hasOwnProperty('oxima'))
			return errorPrint(line + ': missing "oxima" property');


			govHUB.carGet(data, conf, (oxima) => {
				console.log(JSON.stringify(oxima));
			});
		});
	});
});
