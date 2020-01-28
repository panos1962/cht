"use strict";

const pd =
require('../../../mnt/pandora/lib/pandoraClient.js');

module.exports = function(Proklisi) {

///////////////////////////////////////////////////////////////////////////////@

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
};

Proklisi.menuRise = (menuDOM) => {
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
};

///////////////////////////////////////////////////////////////////////////////@
};
