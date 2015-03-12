(function ($, window, document) {
	var win,
		doc,
		wrap,
		secArray,
		curSec,
		minPad;
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper'),
		header = wrap.find('header');
		secArray	= new Array();
		minPad		= 58;
		
		
		// init scroll link
		if(wrap.find('.scr-link').length > 0) {
			initScroll();
			//showScrollTop();
		}
		initMobileMenu();
		// check scroll top
		/*
		$( doc ).scroll(function() {
			if(!header.hasClass('fixed')) {
				//console.log($(doc).scrollTop());
				if($(doc).scrollTop() > 98) {
					header.addClass('fixed');
				}
			} else {
				if($(doc).scrollTop() < 98) {
					header.removeClass('fixed');
				}
			}
		});*/
		if(wrap.find('form select')[0]) {
			wrap.find('form select').customSelect();
			wrap.find('form select').trigger('render');
		}
		
		if (!Modernizr.svg) {
			var imgs = document.getElementsByTagName('img');
			var svgExtension = /.*\.svg$/
			var l = imgs.length;
			for(var i = 0; i < l; i++) {
				if(imgs[i].src.match(svgExtension)) {
					imgs[i].src = imgs[i].src.slice(0, -3) + 'png';
				}
			}
		}
	})
	
	// init scroll link
	function initScroll() {
		// build secArray
		if(secArray.length <= 0) {
			parseSections();
		}
		wrap.find('a.scr-link').each(function() {
			var $this = $(this);
			var aid = $this.attr('id'),
				eid = aid.substring(4);
			$(this).click(function(e) {
				e.preventDefault();
				scrollerPage(eid);
			});
		});
	}
	// register sections one time only
	function parseSections() {
		var secs = wrap.find('.scr-sec');
		secs.each(function(ind) {
			var $this = $(this),
				sName = $this.attr('id');
			secArray.push(sName);
		});
	}
		
	// scroll page
	function scrollerPage(pID) {
		if(!pID) return;
		
		var scrollYPos = ($('#'+pID).offset().top);
		scrollYPos -= minPad;
		var	btmOffset = ($( doc ).height() - $(win).height());
		var tgtYpos = (scrollYPos < btmOffset) ? scrollYPos : btmOffset;
		
		TweenLite.to(win, 1, {scrollTo: {y:tgtYpos}, ease:Cubic.easeOut});	
		
		curSec = jQuery.inArray( pID, secArray );
		updateNav();
		
	}
	// update navigation active
	function updateNav() {
		var mNav = wrap.find('.main-nav ul li ul');
		
		mNav.find('a').removeClass('active');
		mNav.find('li:nth-child('+(curSec+1)+') a').addClass('active');
		
	}

	function initMobileMenu() {
		var header = wrap.find('header'),
			btn = header.find('.mob-nav button');
			
		btn.click(function() {
			header.toggleClass('show-menu');
		});
	}

})(jQuery, this, this.document);