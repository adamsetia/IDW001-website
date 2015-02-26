

(function ($, window, document) {
	var win,
		doc,
		wrap;
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper');
		
		if(wrap.find('.iso-wrap')[0]) {
			initIsotope();
		}
	})
	
	function initIsotope() {
		var isoWrap = wrap.find('.iso-wrap'),
			isoItem = isoWrap.find('.item');
		  
		isoWrap.isotope({
			layoutMode: "fitRows",
			itemSelector: '.item',
			masonry: {
			  columnWidth: '.grid-sizer'
			}
		});
		// inview load
		initInview();
		
		function initInview() {
			isoItem.one('inview', function(event, visible) {
			  var $this = $(this),
			  	  cont = $this.find('.content'),
			  	  isLoaded = $this.hasClass('inView');
			  if(isLoaded) return;
			 
			  if (visible) {
				$this.addClass('inView');
				if($this.find('.content > img')[0]) {
					var nTag = $this.find('.content > img'),
						nSrc = nTag.attr('src');
					$.imgpreload(nSrc,function() {
						cont.css({
							'background-image' : 'url('+nSrc+')'
						});
						TweenLite.to(cont, 0.6, {css:{'opacity': 1}, ease:Quad.easeOut});
						nTag.remove();
					});
				}
			  }
			});
		}
	}


})(jQuery, this, this.document);