

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
			isoItem = isoWrap.find('.iso-box');
		  
		isoWrap.isotope({
			layoutMode: "fitRows",
			itemSelector: '.item',
			masonry: {
			  columnWidth: '.grid-sizer'
			}
		});
		// inview load
		//initInview();
		
		function initInview() {
			isoItem.one('inview', function(event, visible) {
			  var $this = j(this),
					invi = $this.find('.bg-blue, .ht-info');
			  if (visible) {
				$this.addClass('inView');
				if($this.find('img')[0]) {
					var nTag = $this.find('img'),
						nSrc = nTag.attr('src');
				
					j.imgpreload(nSrc,function() {
						$this.css({
							'background-image' : 'url('+nSrc+')'
						});
						TweenLite.to($this, 0.6, {css:{'opacity': 1}, ease:Quad.easeOut});
					});
				} else {
					/*invi.css({
						'opacity' : 0,
						'visibility' : 'visible'	
					})*/
					//TweenLite.to(blrb, 1, {css:{'opacity': 1}, ease:Quad.easeOut});
				}
			  }
			});
		}
	}


})(jQuery, this, this.document);