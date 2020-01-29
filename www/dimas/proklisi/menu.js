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

		$('.proklisiMenuTab').addClass('proklisiMenuTabAtono');
		$(this).addClass('proklisiMenuTabCandi');
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

	if (fyi)
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
};
