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
		if(wrap.find('#people')[0]) {
			initPeople();
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
			//return;
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
	
	function initPeople() {
		/* bg stretcher */
		var elem = wrap.find('#people');
		elem.bgStretcher({
			images: bgImgs,
			imageWidth: 1991,
			imageHeight: 1050,
			anchoringImg: "center bottom",
			slideShow: false
		});
		
		/* owl carousel */
		var owlElem = wrap.find('.owl-carousel');
		owlElem.owlCarousel({
			loop:true,
			nav:true,
			navText: ['<span>prev</span>', '<span>next</span>'],
			margin:30,
			dots: false,
			center: true,
			autoWidth:true,
			startPosition: 0,
			responsive:{
				0:{
					items:1
				},
				768:{
					items:3
				},
				1024:{
					items:5
				}
			}
		});
		/*owlElem.on('click', '.owl-item', function(e) {
		  e.preventDefault();
		 // carousel.to(carousel.relative($(this).index()));
		  console.log($(this));
		  owlElem.trigger('to.owl.carousel', [$(this).index(),500, true]);
		});;*/
		$('.jumpTo').click(function(){
			console.log($('#ind').val());
			owlElem.trigger('to.owl.carousel', [$('#ind').val(),500, true]);
		  });
		owlElem.find('.owl-item').each(function(ind) {
            var $this = $(this),
				img = $this.find('img');
			img.click(function() {
				console.log(ind, $this);	
			});
        });

	}
	
})(jQuery, this, this.document);