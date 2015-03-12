(function ($, window, document) {
	var win,
		doc,
		wrap,
		bgImgs = [t_path+"img/bg-ppl-2.jpg"];
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper');
		
		skrollr.init({
			smoothScrolling: false,
			mobileDeceleration: 0.004
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
		//showUS();
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
				console.log(fbimg)
				//BV.show(fbimg);
				elem.remove();	
					showUS();
			} else {
				BV.show([
					{ type: "video/mp4",  src: vidname+".mp4" },
					{ type: "video/webm", src: vidname+".webm" },
					{ type: "video/ogg",  src: vidname+".ogv" }
				]);
				BV.getPlayer().on('loadeddata', function() {
					//console.log('loaded video');
				});
	
				BV.getPlayer().on('ended', function(elem) {	
					vidOut();
				});
			}
			
			function vidOut() {
				//TweenLite.to
				//console.log('video end');
				TweenLite.to(elem, 0.8, {css:{'opacity': 0 }, ease:Quad.easeOut, onComplete: function() {
					elem.remove();	
					showUS();
				}});
			}
		});
		wrap.find('.video-holderL').each(function(ind) {
			ind++;
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
					//console.log('loaded video');
				});
			}
		});
	}
	
	function initPeople() {
		/* bg stretcher */
		var elem = wrap.find('#people'),
			pplInView = false,
			curPer = null;
			
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
			nav:true,
			navText: ['<span>prev</span>', '<span>next</span>'],
			margin:30,
			dots: false,
			autoWidth:true,
			startPosition: 0,
			responsive:{
				0:{
					center: true,
					items:1
				},
				768:{
					center: false,
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
		
		var mainBG = elem.find('.bgstretcher');
		
		$('.jumpTo').click(function(){
			//console.log($('#ind').val());
			owlElem.trigger('to.owl.carousel', [$('#ind').val(),500, true]);
		  });
		owlElem.find('.owl-item').each(function(ind) {
            var $this = $(this),
				img = $this.find('img'),
				btnClose = $this.find('.btn-close');
			img.click(function() {
				//console.log(ind, $this);
				pplActive($this);
			});
			btnClose.click(function() {
				pplDeactive();	
			});
        });
		owlElem.find('.owl-prev, .owl-next').each(function(index, element) {
            $(this).click(function() {
				pplDeactive();	
			});
        }); 
		
		function pplActive(pElem) {
			if(curPer == pElem) return;
			curPer = pElem;	
			var allItms = owlElem.find('.owl-item');
			allItms.removeClass('inView').find('.info').css('display', 'none');
			// set active class
			elem.add(curPer).addClass('inView');
			var notActive = owlElem.find('.owl-item:not(.inView)');
			notActive.each(function(ind) {
				var $this = $(this),
					img = $this.find('img'),
					tw = $this.width(),
					per = 95,
					nw = Math.round((tw/100)*per),
					nX = (tw-nw)/2;
				TweenLite.to(img, 0.4, {css:{'opacity': 0.5, 'width': nw, 'left':nX }, ease:Quad.easeOut});
			})
			// size up
			var cW = curPer.width(),
				img = curPer.find('img'),
				per = 130,
				nw = Math.round((cW/100)*per),
				nX = (cW-nw)/2,
				info = curPer.find('.info');
			TweenLite.to(img, 0.4, {css:{'opacity': 1, 'width': nw, 'left':nX }, ease:Quad.easeOut});
			info.css({
				'opacity': 0,
				'display': 'block'	
			});
			TweenLite.to(info, 0.4, {css:{'autoAlpha': 1 }, ease:Quad.easeOut});
		}
		function pplDeactive() {
			if(curPer == null) return;
			var allItms = owlElem.find('.owl-item');
			elem.add(curPer).removeClass('inView');
			var curInfo = curPer.find('.info');
			TweenLite.to(curInfo, 0.4, {css:{'autoAlpha': 0 }, ease:Quad.easeOut});
			allItms.each(function(ind) {
				var $this = $(this),
					img = $this.find('img'),
					tw = $this.width(),
					nw = tw,
					nX = 0;
				TweenLite.to(img, 0.4, {css:{'opacity': 1, 'width': nw, 'left':nX }, ease:Quad.easeOut});
			})
			curPer = null;
		}
	}
	
	function showUS() {
		var elem = wrap.find('#us-logo'),
			title = elem.find('.title-blurb'),
			logo = elem.find('img.big-logo'),
			h1 = elem.find('#hover1'),
			h2 = elem.find('#hover2'),
			h3 = elem.find('#hover3');
		TweenLite.to(title, 0.7, {css:{'autoAlpha': 1 }, delay: 0.3, ease:Quad.easeInOut});
		TweenLite.to(logo, 0.7, {css:{'autoAlpha': 1 }, delay: 0.8,ease:Quad.easeInOut});
		TweenLite.to(h1, 0.7, {css:{'autoAlpha': 1 }, delay: 1.2,ease:Quad.easeOut});
		TweenLite.to(h2, 0.7, {css:{'autoAlpha': 1 }, delay: 1.6,ease:Quad.easeOut});
		TweenLite.to(h3, 0.7, {css:{'autoAlpha': 1 }, delay: 2.0,ease:Quad.easeOut});
		h1.hover(function() {
			showInfo(elem.find('#info1'));
		}, function() {
			hideInfo();
		})
		h2.hover(function() {
			showInfo(elem.find('#info3'));
		}, function() {
			hideInfo();
		})
		h3.hover(function() {
			showInfo(elem.find('#info2'));
		}, function() {
			hideInfo();
		})
		
		function showInfo(elem) {
			hideInfo();
			TweenLite.to(elem, 0.4, {css:{'autoAlpha': 1 }, delay:0.1, ease:Quad.easeOut});
		}
		function hideInfo() {
			elem.find('.item').each(function(ind) {
                $(this).css({
					'visibility': 'hidden'
				});
            });
			
		}
			
	}
	
})(jQuery, this, this.document);