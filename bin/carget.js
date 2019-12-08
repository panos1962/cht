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

govHUB.confRead(`${process.env.CHT_BASEDIR}/private/govHUB.cf`, (cfs) => {
	govHUB.tokenGet(JSON.parse('{' + cfs + '}'), (conf) => {
		pd.ttymsg('Reading cars...\n');
		readline.createInterface({
			'input': process.stdin,
		}).on('line', (line) => {
			govHUB.carGet(line, conf);
		});
	});
});
