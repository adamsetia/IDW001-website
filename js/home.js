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
		
		if(bgWrap[0]) {
			initBGS();
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
			firstInt = 9000,
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
			pagination: bgWrap.find('.pagination'),
			sliderCallbackFunc: sliderSwitch
		});
		
		function startSlideShow() {
			// remove loader
			loaderGif(false);
			clearTimeout(timer);
			var elem = bgWrap.find('> div'),
				curItem = bgWrap.find('.item:first-child'),
				ttime = 0.6;
			
			curItem.addClass('active');
			TweenLite.to(elem, ttime, {css:{autoAlpha: 1}, ease:Quad.easeOut});
			TweenLite.to(curItem, ttime, {css:{autoAlpha: 1}, ease:Quad.easeOut, delay:ttime,  onComplete: function() {
				if(sliding) {
					timer = setTimeout(function(){
						$('.home-banners').bgStretcher.play();
					},firstInt);
				}
			}});
		}
		
		function updateNav() {
			if(!sliding) {
				bgWrap.find('.bg-nav').remove();
				return;
			}
		}
		function sliderSwitch() {
			clearTimeout(timer);
			$('.home-banners').bgStretcher.pause();
			var curItem = bgWrap.find('.item.active'),
				bgLi = bgWrap.find('.bgstretcher li'),
				nextBG = bgWrap.find('.bgstretcher li.bgs-current'),
				nextIndex = bgLi.index(nextBG), 
				nextItem = bgWrap.find('.item:nth-child('+(nextIndex+1)+')'),
				ttime = 0.6;
				
			// hide cur item
			TweenLite.to(curItem, ttime, {css:{autoAlpha: 0}, ease:Quad.easeOut, onComplete: function() {
				curItem.css('position', 'absolute').removeClass('active');
			}});
			//show next item
			
			TweenLite.to(nextItem, ttime, {css:{autoAlpha: 1}, ease:Quad.easeOut, delay:ttime, onStart:function(){
				nextItem.css('position', 'relative').addClass('active');	
			}, onComplete: function() {
				timer = setTimeout(function(){
					$('.home-banners').bgStretcher.play();
				},intTime);
			}});
				
		}
	}
	
	function loaderGif(cond) {
		if(cond) {
			wrap.append('<div class="loader"></div>');
		} else {
			wrap.find('.loader').remove();	
		}
	}


})(jQuery, this, this.document);