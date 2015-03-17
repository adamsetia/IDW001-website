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
		/* bg stretcher */
		var elem = wrap.find('#us-logo2'),
			bg = [t_path+"img/whitelogoBG.jpg"];
		
		wrap.find('.video-holder').each(function(ind) {
			var elem = $(this),
				vidname = elem.data('video'),
				fbimg = elem.data('fallback'),
				looping = elem.data('loop');
			elem.css('visibility', 'hidden');
			loaderGif(true, elem.parent());
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
				//BV.show(fbimg);
				elem.remove();	
				loaderGif(false);
				fallback([fbimg]);
				showUS();
			} else {
				BV.show([
					{ type: "video/mp4",  src: vidname+".mp4" },
					{ type: "video/webm", src: vidname+".webm" },
					{ type: "video/ogg",  src: vidname+".ogv" }
				]);
				BV.getPlayer().pause();
				BV.getPlayer().on('loadeddata', function() {
					//console.log('loaded video');
					loaderGif(false);
					setTimeout(function(){ 
						elem.css('visibility', 'visible');
						BV.getPlayer().play(); 
					}, 700);
					
				});
	
				BV.getPlayer().on('ended', function(elem) {	
					showUS();
				});
			}
		});
		wrap.find('.video-holderL').each(function(ind) {
			ind++;
			var elem = $(this),
				vidname = elem.data('video'),
				fbimg = elem.data('fallback'),
				loop = elem.data('loop'),
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
				BV.getPlayer().pause();
				BV.getPlayer().on('loadeddata', function() {
					//console.log('loaded video');
					BV.getPlayer().play(); 
				});
			}
		});
		function fallback(imgs) {
			elem.bgStretcher({
				images: imgs,
				imageWidth: 1280,
				imageHeight: 720,
				anchoringImg: "center center",
				slideShow: false
			});	
		}
	}
	
	function showUS() {
		var elem = wrap.find('#us-logo2'),
			title = elem.find('.title-blurb');
		title.css({
			'visibility': 'visible',
			'opacity':0
		})
		if(device.ipad()) {
			var bgs = elem.find('.bgstretcher');
			bgs.css({
				'visibility': 'visible',
				'opacity':0
			})
		}
		elem.css({
			'display': 'block'
		})
		if(device.ipad()) {
			TweenLite.to(title, 0.7, {css:{'opacity': 1 }, delay: 0.3, ease:Quad.easeInOut});
			TweenLite.to(bgs, 0.7, {css:{'opacity': 1 }, delay: 0.6, ease:Quad.easeInOut});	
			
		} else {
			TweenLite.to(title, 0.7, {css:{'opacity': 1 }, ease:Quad.easeInOut});	
		}
	}
	
	function loaderGif(cond, container) {
		if(cond) {
			container.append('<div class="loader"></div>');
		} else {
			var loader = wrap.find('.loader');
			TweenLite.to(loader, 0.5, {css:{'opacity': 0 }, ease:Quad.easeInOut, onComplete:function() {
				loader.find('.loader').remove();	
			}});	
			
		}
	}
	
})(jQuery, this, this.document);