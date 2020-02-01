///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// www/dimas/proklisi/menu.js —— Δομές και functions που αφορούν στη διαχείριση
// των menu του προγράμματος καταχώρησης και επεξεργασίας προ-κλήσεων.
// @FILE END
//
// @DESCRIPTION BEGIN
// Στο παρόν αρχείο ορίζονται δομές και functions που αφορούν στην καθολική
// συμπεριφορά του προγράμματος καταχώρησης και επεξεργασίας προ-κλήσεων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-01-30
// Updated: 2020-01-27
// Updated: 2020-01-26
// Updated: 2020-01-25
// Updated: 2020-01-24
// Updated: 2020-01-23
// Created: 2020-01-22
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd =
require('../../../mnt/pandora/lib/pandoraClient.js');

module.exports = function(Proklisi) {
///////////////////////////////////////////////////////////////////////////////@

Proklisi.param.menuShrinkDuration = 300;

Proklisi.menuActivate = (menuDOM) => {
	pd.bodyDOM.
	on('mouseenter', '.proklisiMenuTab', function(e) {
		e.stopPropagation();

		if (!$(this).data('exec'))
		return;

		$('.proklisiMenuTab').
		addClass('proklisiMenuTabAtono');

		$(this).
		removeClass('proklisiMenuTabAtono').
		addClass('proklisiMenuTabCandi');
	}).
	on('mouseleave', '.proklisiMenuTab', function(e) {
		e.stopPropagation();
		$('.proklisiMenuTabAtono').removeClass('proklisiMenuTabAtono');
		$(this).removeClass('proklisiMenuTabCandi');
	}).
	on('click', '.proklisiMenuTab', function(e) {
		e.stopPropagation();

		let exec = $(this).data('exec');

		if (exec)
		exec();
	});

	pd.
	paletaSetup().
	bodyDOM.
	on('click', '.proklisiMenuBar', function(e) {
		e.stopPropagation();
		Proklisi.menuRise(menuDOM);
	});

	return Proklisi;
};

Proklisi.menuRise = (menuDOM) => {
	let fyi = menuDOM.data('fyi');

	pd.fyiDOM.
	finish().
	fadeTo(Proklisi.param.menuShrinkDuration, 0, function() {
		pd.fyiMessage(fyi);
		pd.fyiDOM.css('opacity', 1);
	});

	$('.proklisiEnotitaActive').
	not('.prosklisiMenu').
	finish().
	animate({
		'height': 0,
		'opacity': 0,
	}, Proklisi.param.menuShrinkDuration, function() {
		$(this).removeClass('proklisiEnotitaActive');
	});

	menuDOM.
	finish().
	css('height', '0px').
	addClass('proklisiEnotitaActive').
	animate({
		'height': menuDOM.data('height') + 'px',
		'opacity': 1,
	}, Proklisi.param.menuShrinkDuration);

	return Proklisi;
};

Proklisi.menuBarDOM = () => {
	let menuBarDOM = $('<div>').
	addClass('proklisiMenuBar').
	text('Αρχικό Μενού Επιλογών');

	return menuBarDOM;
};

Proklisi.menuTabStatus = (menuTabDOM, status) => {
	menuTabDOM.
	removeClass('proklisiMenuTabBusy').
	removeClass('proklisiMenuTabSuccess').
	removeClass('proklisiMenuTabError').
	children('.proklisiMenuTabStatusIcon').
	remove();

	switch (status) {
	case 'busy':
		menuTabDOM.
		addClass('proklisiMenuTabBusy').
		append($('<img>').
		addClass('proklisiMenuTabStatusIcon').
		attr('src', '../../images/busy.gif'));
		break;
	case 'success':
		menuTabDOM.
		addClass('proklisiMenuTabSuccess').
		append($('<img>').
		addClass('proklisiMenuTabStatusIcon').
		attr('src', '../../images/success.png'));
		break;
	case 'error':
		menuTabDOM.
		addClass('proklisiMenuTabError').
		append($('<img>').
		addClass('proklisiMenuTabStatusIcon').
		attr('src', '../../images/error.png'));
		break;
	}

	return Proklisi;
};

Proklisi.menuTabFyi = (menuTabDOM, msg) => {
	let labelDOM = menuTabDOM.children('.proklisiMenuTabLabel');
	let fyiDOM = menuTabDOM.children('.proklisiMenuTabFyi');

	labelDOM.css('display', 'none');
	fyiDOM.css('display', 'none').
	removeClass('proklisiMenuTabFyiError');

	if (!msg) {
		fyiDOM.empty();
		labelDOM.css('display', 'block');
		return Proklisi;
	}

	fyiDOM.css('display', 'block').text(msg);
	return Proklisi;
};

Proklisi.menuTabFyiError = (menuTabDOM, msg) => {
	Proklisi.menuTabFyi(menuTabDOM, msg);
	menuTabDOM.children('.proklisiMenuTabFyi').
	addClass('proklisiMenuTabFyiError');
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.enotitaDOM = () => {
	let enotitaDOM = $('<div>').
	addClass('proklisiEnotita').
	appendTo(pd.ofelimoDOM);

	enotitaDOM.
	append(Proklisi.menuBarDOM());

	return enotitaDOM;
};

Proklisi.enotitaActivate = (enotitaDOM) => {
	let active = $('.proklisiEnotitaActive');
	let h = (active.length ? $(active[0]).innerHeight() : 0);

	active.
	finish().
	animate({
		'height': '0px',
		'opacity': 0,
	}, Proklisi.param.menuShrinkDuration);

	enotitaDOM.
	finish().
	addClass('proklisiEnotitaActive').
	css('display', 'block').
	animate({
		'height': h + 'px',
		'opacity': 1,
	}, Proklisi.param.menuShrinkDuration, function() {
		$(this).css('height', 'auto');
		pd.fyiMessage(enotitaDOM.data('fyi'));
	});

	// Αν υπάρχει παλέτα στο επιλεγμένο menu tab την ενεργοποιούμε
	// κυρίως για να έχουμε focus στο σχετικό input field, εφόσον
	// αυτό εμφανίζεται.

	pd.paletaActivate(enotitaDOM.find('.pandoraPaleta').first());

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@
};
