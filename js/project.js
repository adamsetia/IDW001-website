(function ($, window, document) {
	var win,
		doc,
		wrap,
		bgWrap,
		bgImgs = new Array();
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper'),
		bgWrap = wrap.find('.home-banners'),
		items = bgWrap.find('.item');
		
		skrollr.init({
			smoothScrolling: false,
			mobileDeceleration: 0.004
		});
		
		$( win ).resize(function() {
			updateBH();
		});
		
		if(bgWrap[0]) {
			initBGS();
			$( win ).resize();
		}
		if(wrap.find('.proj-stats .val')[0]) {
			initCount();
			//wrap.find('.proj-stats .val').countTo();
		}
		
	})
	
	function initBGS() {
		// create bgImgs var
		items.each(function(ind) {
            var $this = $(this),
				img = $this.data('img');
			bgImgs.push(img);
        });
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
			anchoringImg: "center center",
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
	
	function initCount() {
		var elem = wrap.find('.proj-stats .item');
		elem.each(function(ind) {
            var $this = $(this),
				val  = $this.find('.val'),
				w = $this.width(),
				d_from = val.data('from'),
				d_to = val.data('to'),
				d_decimal = val.data('decimals'),
				vid = val.attr('id');
			$this.css('width', w);
			val.text(d_from).css('visibility', 'visible');
			var numAnim = new countUp(vid, d_from, d_to, d_decimal, 1);
			numAnim.start(function() {
				$this.css('width', '');
			});
        });
	}

})(jQuery, this, this.document);