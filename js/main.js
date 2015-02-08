(function ($, window, document) {
	var win,
		doc,
		wrap;
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper');
		
		initMobileMenu();
	})

	function initMobileMenu() {
		var header = wrap.find('header'),
			btn = header.find('.mob-nav button');
			
		btn.click(function() {
			header.toggleClass('show-menu');	
		});
	}

})(jQuery, this, this.document);