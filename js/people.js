(function ($, window, document) {
	var win,
		doc,
		wrap,
		bgImgs = [t_path+"img/bg-ppl-2.jpg"];
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper');
		
		if(wrap.find('#people')[0]) {
			initPeople();
		}
	})
	
	
	
	function initPeople() {
		
		var elem = wrap.find('#people'),
			itms = elem.find('.item'),
			pplInView = false,
			curPer = null,
			ttlItms = itms.length,
			curSize = 1;
			curInd = 0,
			curperInd = null,
			pplW = new Array();
			
		/* bg stretcher */	
		elem.bgStretcher({
			images: bgImgs,
			imageWidth: 1991,
			imageHeight: 1050,
			anchoringImg: "center bottom",
			slideShow: false
		});
		// store image width of all items
		itms.each(function(index, element) {
            var img = $(this).find('img'),
				imgW;
			
			if(img.attr('data-width')) {
				img.css('width', img.data('width'));
				imgW = img.width();
			} else {
				imgW = Math.round(img.width()*.6157);
				img.css({
					'width': imgW,
					'height': 'auto'
				});
			}
			
			pplW.push(imgW);
        });
		// set last class to the 2 last items
		itms.last().add(itms.eq(-2)).addClass('last');
		/* owl carousel */
		var owlElem = wrap.find('.owl-carousel');
		
		// event listeners
		owlElem.on('initialized.owl.carousel resized.owl.carousel ', function(e) {
			//console.log(e);
		  	curSize = e.page.size;
			curInd = e.item.index;
			// close any viewed person on resize
		  	pplDeactive();
		});
		owlElem.on('changed.owl.carousel', function(e) {
			curSize = e.page.size;
			curInd = e.property.value;
		})
		
		owlElem.owlCarousel({
			nav:true,
			navText: ['<span>prev</span>', '<span>next</span>'],
			dots: false,
			stagePadding: 50,
			mouseDrag: false,
			startPosition: 0,
			navSpeed: 800,
			fluidSpeed: 800,
			touchDrag: false,
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
					items:4
				},
				1150:{
					items:5
				},
				1280:{
					items:6
				}
			}
		});
		
		owlElem.on('click', '.owl-item .img-holder', function(e) {
		  e.preventDefault();
		  var uind = owlElem.find('.owl-item').index( $(this).parents('.owl-item') );
		  var tgtInd=0,
		  noMove = true;
		  if(curSize < 3) {
			  tgtInd = (uind);
			  noMove = false;
			  
		  } else if(curSize == 3 || curSize == 4) {
			  if(uind >= curInd) {
				  tgtInd = (uind-1);
				  noMove = false;
			  } else if(uind == (curInd-1)) {
				  tgtInd = (uind<2) ? 0 : (curInd-2);
				  noMove = false;
			  }
		  } else if(curSize == 5 || curSize == 6) {
			  if(uind >= (curInd)) {
				  tgtInd = (uind-2);
				  noMove = false;
			  } else if(uind == (curInd-1)) {
				  tgtInd = (uind<2) ? 0 : (curInd-2);
				  
				  noMove = false;
			  }
		  }
		  //console.log(noMove);
		  if(noMove) {
			  pplActive2(uind, false);
		  }
		  pplActive2(uind, true);
		  owlElem.trigger('to.owl.carousel', [tgtInd,500, true]);
		  
		});;
		
		
		
		var mainBG = elem.find('.bgstretcher');
		
		
		owlElem.find('.owl-item').each(function(ind) {
            var $this = $(this),
				img = $this.find('img'),
				btnClose = $this.find('.btn-close');
			btnClose.click(function() {
				pplDeactive();	
			});
        });
		owlElem.find('.owl-prev, .owl-next').each(function(index, element) {
            $(this).click(function() {
				pplDeactive();	
			});
        }); 
		
		
		function pplActive2(ind, dels) {
			pElem = owlElem.find('.owl-item:nth-child('+(ind+1)+')');
			if(curperInd == ind) return;
			curperInd = ind;
			curPer = pElem;
			
			var allItms = owlElem.find('.owl-item'),
			del = dels ? 0 : 0;
			allItms.removeClass('inView').find('.info').css('display', 'none');
			elem.add(curPer).addClass('inView');
			var notActive = owlElem.find('.owl-item:not(.inView)');
			notActive.each(function(ind) {
				var aInd = owlElem.find('.owl-item').index( $(this) );
				var $this = $(this),
					img = $this.find('img'),
					tw = pplW[aInd],
					per = 90,
					nw = Math.round((tw/100)*per),
					nX = (tw-nw)/2;
				TweenLite.to(img, 0.5, {css:{'opacity': 0.5, 'width': nw }, ease:Quad.easeInOut});
			})
			// size up
			var cW = curPer.width(),
				img = curPer.find('img'),
				tw = pplW[ind],
				per = 135,
				nw = Math.round((tw/100)*per),
				nX = (cW-nw)/2,
				info = curPer.find('.info');
			TweenLite.to(img, 0.5, {css:{'opacity': 1, 'width': nw }, delay: del, ease:Quad.easeInOut});
			info.css({
				'opacity': 0,
				'display': 'block'	
			});
			TweenLite.to(info, 0.5, {css:{'opacity': 1 }, ease:Quad.easeInOut, delay: 0.4});
		}
		
		function pplDeactive() {
			if(curPer == null) return;
			var allItms = owlElem.find('.owl-item');
			elem.add(curPer).removeClass('inView');
			
			var curInfo = curPer.find('.info');
			//console.log(curInfo);
			//TweenLite.to(curInfo, 0.4, {css:{'autoAlpha': 0 }, ease:Quad.easeOut});
			allItms.each(function(ind) {
				var $this = $(this),
					img = $this.find('img'),
					tw = pplW[ind],
					nw = tw,
					nX = 0;
				TweenLite.to(img, 0.4, {css:{'opacity': 1, 'width': nw }, ease:Quad.easeOut});
			})
			curPer = null;
			curperInd = null;
			
			allItms.removeClass('inView').find('.info').css('display', 'none');
			
			
		}
	}
	
})(jQuery, this, this.document);