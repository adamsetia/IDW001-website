

(function ($, window, document) {
	var win,
		doc,
		wrap;
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper');
		
		skrollr.init({
			smoothScrolling: false,
			mobileDeceleration: 0.004,
				forceHeight: false
		});
		
		if(wrap.find('.iso-wrap')[0]) {
			initIsotope();
		}
		if(wrap.find('.video-holder')[0]) {
			initVidBg();
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
	
	function initVidBg() {
		wrap.find('.video-holder').each(function(ind) {
			var elem = $(this),
				vidname = elem.data('video'),
				fbimg = elem.data('fallback'),
				looping = elem.data('loop');
			
			var BV = new $.BigVideo({
				useFlashForFirefox: false,
				container: wrap.find(elem),
				doLoop: looping,
				shrinkable: false,
				elemID: '#big-video-vid-'+ind
			});
			BV.init();
			if (Modernizr.touch || $('html').hasClass('lt-ie9')) {
				BV.show(fbimg);
			} else {
				BV.show([
					{ type: "video/mp4",  src: vidname+".mp4" },
					{ type: "video/webm", src: vidname+".webm" },
					{ type: "video/ogg",  src: vidname+".ogv" }
				]);
				BV.getPlayer().on('loadeddata', function() {
					console.log('loaded video');
				});
	
				BV.getPlayer().on('ended', function() {	
					vidOut();
				});
			}
			
			function vidOut() {
				//TweenLite.to
				console.log('video end');
			}
		});
	}

})(jQuery, this, this.document);