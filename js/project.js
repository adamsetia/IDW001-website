(function ($, window, document) {
	var win,
		doc,
		wrap,
		bgWrap;
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper'),
		bgWrap = wrap.find('.home-banners');
		
		skrollr.init({
			smoothScrolling: false,
			mobileDeceleration: 0.004,
				forceHeight: false
		});
		
		$( win ).resize(function() {
			updateBH();
		});
		
		if(bgWrap[0]) {
			initBGS();
			$( win ).resize();
		}
		
	})
	
	function initBGS() {
		var sliding = bgImgs.length > 1 ? true : false,
			loaded = 0,
			intTime = 5000,
			transSpeed = 600,
			timer;
		// adjust nav
		updateNav();
		// preload bg images
		loaderGif(true);
		$.imgpreload(bgImgs, {
    		each: function() {
				loaded ++;
				if(loaded <= 1) {
					// check for first loaded image
					startSlideShow();
				}
			}
		});
		// init bg stretcher with slide show disabled
		bgWrap.bgStretcher({
			images: bgImgs,
			imageWidth: 1680,
			imageHeight: 1050,
			nextSlideDelay: intTime,
			slideShowSpeed: transSpeed,
			anchoringImg: "center top",
			slideShow: false,
			buttonNext: bgWrap.find('.next'),
            buttonPrev: bgWrap.find('.prev'),
			pagination: bgWrap.find('.pagination')
		});
		
		function startSlideShow() {
			// remove loader
			loaderGif(false);
			clearTimeout(timer);
			var elem = bgWrap.find('> div'),
				ttime = 0.6;
				
			TweenLite.to(elem, ttime, {css:{autoAlpha: 1}, ease:Quad.easeOut,  onComplete: function() {
				if(sliding) {
					timer = setTimeout(function(){
						$('.home-banners').bgStretcher.play();
					},intTime);
				}
			}});
		}
		
		function updateNav() {
			if(!sliding) {
				bgWrap.find('.bg-nav').remove();
				return;
			}
		}
	}
	
	function loaderGif(cond) {
		if(cond) {
			wrap.append('<div class="loader"></div>');
		} else {
			wrap.find('.loader').remove();	
		}
	}
	
	function updateBH() {
		var sH = wrap.find('.proj-details').height(),
			winH = win.innerHeight
			diffH = (winH - sH);
		bgWrap.css('height', diffH);
	}


})(jQuery, this, this.document);