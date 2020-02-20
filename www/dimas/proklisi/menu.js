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
// Updated: 2020-02-05
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

///////////////////////////////////////////////////////////////////////////////@

Proklisi.menuSetupOk = false;

Proklisi.menuSetup = () => {
	if (Proklisi.menuSetupOk)
	return Proklisi;

	Proklisi.menuSetupOk = true;

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
	}).
	on('click', '.proklisiEpistrofiBar', function(e) {
		e.stopPropagation();
		Proklisi.enotitaRise($(this).data('epistrofi'));
	});

	return Proklisi;
};

Proklisi.activate = (enotitaDOM) => {
	pd.paletaSetup();
	Proklisi.
	menuSetup().
	enotitaActivate(enotitaDOM);

	return Proklisi;
};

Proklisi.enotitaRise = (enotitaDOM) => {
	if (!enotitaDOM)
	return Proklisi;

	Proklisi.toolbarTitlos(enotitaDOM);

	let fyi = enotitaDOM.data('errmsg');

	if (fyi)
	pd.fyiError(fyi);

	else
	pd.fyiMessage(enotitaDOM.data('fyi'));

	$('.proklisiEnotitaActive').
	filter(function() {
		return ($(this) !== enotitaDOM);
	}).
	finish().
	animate({
		'height': '0px',
		'opacity': 0,
	}, Proklisi.param.enotitaShrinkDuration, function() {
		$(this).removeClass('proklisiEnotitaActive');
	});

	enotitaDOM.
	finish().
	css({
		'height': '0px',
		'opacity': 0,
		'display': '',
	}).
	addClass('proklisiEnotitaActive').
	animate({
		'height': '100px',
		'opacity': 1,
	}, Proklisi.param.enotitaShrinkDuration, function() {
		$(this).css('height', '');
	});

	pd.ofelimoDOM.scrollTop(0);
	return Proklisi;
};

Proklisi.menuTabStatus = (menuTabDOM, status) => {
	menuTabDOM.
	removeClass('proklisiMenuTabBusy').
	removeClass('proklisiMenuTabSuccess').
	removeClass('proklisiMenuTabInactive').
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
	case 'inactive':
		menuTabDOM.
		addClass('proklisiMenuTabInactive').
		append($('<img>').
		addClass('proklisiMenuTabStatusIcon').
		attr('src', '../../images/inactive.png'));
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

	fyiDOM.css('display', 'block').html(msg);
	return Proklisi;
};

Proklisi.menuTabFyiError = (menuTabDOM, msg) => {
	Proklisi.menuTabFyi(menuTabDOM, msg);
	menuTabDOM.children('.proklisiMenuTabFyi').
	addClass('proklisiMenuTabFyiError');
	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@

Proklisi.enotitaDOM = (parentDOM) => {
	let enotitaDOM = $('<div>').
	addClass('proklisiEnotita').
	appendTo(pd.ofelimoDOM);

	if (!parentDOM)
	return enotitaDOM;

	let epistrofiBarDOM = $('<div>').
	data('epistrofi', parentDOM).
	addClass('proklisiEpistrofiBar').
	appendTo(enotitaDOM);

	let titlos = parentDOM.data('titlos');

	if (!titlos)
	titlos = 'Επιστροφή';

	epistrofiBarDOM.text(titlos);

	return enotitaDOM;
};

Proklisi.enotitaActivate = (enotitaDOM) => {
	Proklisi.toolbarTitlos(enotitaDOM);

	let active = $('.proklisiEnotitaActive');
	let h = (active.length ? $(active[0]).innerHeight() : 0);

	active.
	filter(function() {
		return ($(this) !== enotitaDOM);
	}).
	finish().
	animate({
		'height': '0px',
		'opacity': 0,
	}, Proklisi.param.menuShrinkDuration, function() {
		$(this).removeClass('proklisiEnotitaActive');
	});

	enotitaDOM.
	finish().
	css({
		'height': '0px',
		'opacity': 0,
		'display': '',
	}).
	addClass('proklisiEnotitaActive').
	animate({
		'height': h + 'px',
		'opacity': 1,
	}, Proklisi.param.menuShrinkDuration, function() {
		$(this).css({
			'height': '',
			'opacity': '',
		});
	});

	let errmsg = enotitaDOM.data('errmsg');

	if (errmsg)
	pd.fyiError(errmsg);

	else
	pd.fyiMessage(enotitaDOM.data('fyi'));

	// Αν υπάρχει παλέτα στο επιλεγμένο menutab την ενεργοποιούμε
	// κυρίως για να έχουμε focus στο σχετικό input field, εφόσον
	// αυτό εμφανίζεται.

	pd.paletaActivate(enotitaDOM.find('.pandoraPaleta').first());

	return Proklisi;
};

Proklisi.toolbarTitlos = (enotitaDOM) => {
	let titlos = enotitaDOM.data('titlos');

	if (!titlos)
	titlos = 'Βεβαίωση παραβάσεων ΚΟΚ';

	pd.toolbarCenterDOM.
	finish().
	fadeTo(Proklisi.param.menuShrinkDuration, 0, function() {
		$(this).
		css({
			'display': 'table-cell',
			'opacity': '',
		}).
		text(titlos);
	});

	return Proklisi;
};

///////////////////////////////////////////////////////////////////////////////@
};
