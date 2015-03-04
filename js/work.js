

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
			initFilters();
			initMobileFilt();
		}
	})
	
	function initMobileFilt() {
		var elem = wrap.find('.work-filter'),
			mobBtn = elem.find('button'),
			holder = elem.find('.holder'),
			resetH = 40;
			
		mobBtn.click(function() {
			if(!elem.hasClass('show')) {
				var nH = resetH + holder.outerHeight();
				showMobFilt(nH);
			} else {
				showMobFilt(resetH);
			}
			elem.toggleClass('show');	
		});
		
		function showMobFilt(val) {
			elem.css('height', val);
		}
	}
	
	
	function initFilters() {
		var elem = wrap.find('.work-filter'),
			filtBtns = elem.find('a:not(.filter-reset)'),
			filtReset = elem.find('a.filter-reset');
		
		// toggle active class
		filtBtns.click(function(e) {
			e.preventDefault();
			var $this = $(this);
			$this.toggleClass('active');
			if($this.hasClass('active')) {
				filtReset.removeClass('active');
			} else {
				checkFilters();	
			}
			buildFilter();
		});
		filtReset.click(function(e) {
			e.preventDefault();
			var $this = $(this);
			filtBtns.removeClass('active');
			filterEntries("");
		});
		function checkFilters() {
			var cleared = true;
			filtBtns.each(function(ind) {
                var $this = $(this);
				if($this.hasClass('active')) {
					cleared = false;
					return;
				}
            });	
			if(cleared) filtReset.addClass('active');
		}
		function buildFilter() {
			var filtArr = [],
				filtStr;
			filtBtns.each(function(ind) {
                var $this = $(this);
				if($this.hasClass('active')) {
					var filrVal = $(this).data('filter-value');
					filtArr.push(filrVal);
				}
            });
			filtStr = filtArr.join(",");
			filterEntries(filtStr);
		}
		function filterEntries(val) {
			console.log(val);
			$('.iso-wrap').isotope({ filter: val });
		}
	}
	
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
				if($this.find('img')[0]) {
					var nTag = $this.find('img'),
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