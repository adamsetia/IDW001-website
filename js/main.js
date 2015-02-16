(function ($, window, document) {
	var win,
		doc,
		wrap;
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper'),
		header = wrap.find('header');
		
		initMobileMenu();
		// check scroll top
		$( doc ).scroll(function() {
			if(!header.hasClass('fixed')) {
				//console.log($(doc).scrollTop());
				if($(doc).scrollTop() > 98) {
					header.addClass('fixed');
				}
			} else {
				if($(doc).scrollTop() < 98) {
					header.removeClass('fixed');
				}
			}
		});
	})

	function initMobileMenu() {
		var header = wrap.find('header'),
			btn = header.find('.mob-nav button');
			
		btn.click(function() {
			header.toggleClass('show-menu');
		});
	}

})(jQuery, this, this.document);