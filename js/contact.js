(function ($, window, document) {
	var win,
		doc,
		wrap,
		map1,
		map2,
		custom_styles,
		locations;
		
	$(function() {
		win = window;
		doc = document;
		wrap = $('.wrapper');
		
		skrollr.init({
			smoothScrolling: false,
			mobileDeceleration: 0.004
		});
		
		// set defaults
		setDefaults();
		// get user loc
		//getUserLoc();
		// map init
		google.maps.event.addDomListener(window, 'load', initialize);
	})
	
	function setDefaults() {
		// Custom Styling for Google Maps 
		custom_styles = [ { "stylers": [ { "saturation": -100 }, { "lightness": -11 } ] },{ "featureType": "water", "stylers": [ { "lightness": -43 } ] },{ "featureType": "landscape", "stylers": [ { "lightness": -19 } ] },{ "featureType": "road", "stylers": [ { "lightness": -18 } ] },{ "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [ { "weight": 1.9 } ] },{ "featureType": "road", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] } ];
		
		locations = {
			"QLD": {
				lat: -27.460337,
				lng: 153.031529,
				glink: "https://www.google.com/maps/place/Ideaworks/@-27.460337,153.031529,17z/data=!3m1!4b1!4m2!3m1!1s0x6b9159f6ba8f440b:0x5f87754b6bfde64e"	
			},
			"NSW": {
				lat: -33.864346,
				lng: 151.204661,
				glink: "https://www.google.com/maps/place/IdeaWorks+Advertising+Agency/@-33.864346,151.204661,17z/data=!3m1!4b1!4m2!3m1!1s0x6b12ae4133121fa9:0x7050640be19c9222"	
			},
			"VIC": {
				lat: -37.815151,
				lng: 144.967587,
				glink: "https://www.google.com/maps/place/IdeaWorks/@-37.815151,144.967587,17z/data=!3m1!4b1!4m2!3m1!1s0x6ad642b61305d90f:0xae40fa90e276f6b7"	
			},
			"Auckland": {
				lat: -36.849752,
				lng: 174.758472,
				glink: "https://www.google.com/maps/place/Y%26R/@-36.849752,174.758472,17z/data=!3m1!4b1!4m2!3m1!1s0x6d0d480885a23149:0xa68048fc76fb8e2"	
			}
		};
	}
	
	function getUserLoc() {
		
	}
	
	function initialize() {
		var mapAll = true;
		if(curLoc) mapAll = false;
		
		// build map options
		function mapOpts(cond, latLng) {
			var mapOptions;
			if(cond) {
				mapOptions = {
					center: latLng,
					zoom: 16,
					disableDefaultUI: true,
					scrollwheel: false,
					draggable: false, 
					zoomControl: false, 
					scrollwheel: false, 
					disableDoubleClickZoom: true
				}
			} else{
				mapOptions = {
					disableDefaultUI: true,
					scrollwheel: false,
					draggable: false, 
					zoomControl: false, 
					scrollwheel: false, 
					disableDoubleClickZoom: true
				}
			}
			return mapOptions;
		}
		
		if(!mapAll) {
			var curLat = locations[curLoc].lat,
				curLng = locations[curLoc].lng;
				
			var myLatlng1 = new google.maps.LatLng(curLat, curLng);
			var myLatlng2 = new google.maps.LatLng((curLat-0.012), curLng);
			
			map1 = new google.maps.Map(document.getElementById('map1'), mapOpts(true, myLatlng1));
			map2 = new google.maps.Map(document.getElementById('map2'), mapOpts(true, myLatlng2));
			
			map1.panBy(0, -99);
		} else {
			map1 = new google.maps.Map(document.getElementById('map1'), mapOpts(false));
			map2 = new google.maps.Map(document.getElementById('map2'), mapOpts(false));
			var bound = new google.maps.LatLngBounds();
			
			for (var i in locations) {
				bound.extend( new google.maps.LatLng(locations[i].lat, locations[i].lng) );
			}
			map1.fitBounds(bound);
			map2.fitBounds(bound);
			map1.panBy(0, -99);
		}
		
		
		
		
		//Apply custom styles
		map1.setOptions({ styles : custom_styles });
		map2.setOptions({ styles : custom_styles });
		
		// marker image
		var url = themePath+'img/marker.png';
		var size = new google.maps.Size(100, 120);
		if(window.devicePixelRatio > 1.5){
			url = themePath+'img/marker@2x.png';
			size = new google.maps.Size(200, 240);
		}
		var image = {
			url: url,
			size: size,
			scaledSize: new google.maps.Size(100, 120),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(50, 120)
		};
		
		// add markers for all locations
		for (var i in locations) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
				map: map1,
				icon: image
			});
			//console.log(locations[i].glink);
			google.maps.event.addListener(marker, "click", (function(marker, i) {
				return function() {
					window.open(locations[i].glink, "_blank")
				}
			})(marker, i));
		}
		
		//Re-center the map when the browser is resized
		google.maps.event.addDomListener(window, "resize", function() {
			if(!mapAll) {
				var center1 = map1.getCenter();
				google.maps.event.trigger(map1, "resize");
				map1.setCenter(center1); 
				
				var center2 = map2.getCenter();
				google.maps.event.trigger(map2, "resize");
				map2.setCenter(center2); 
			} else {
				map1.fitBounds(bound);
				map2.fitBounds(bound);
				map1.panBy(0, -99);
			}
			
		});
	
	}

})(jQuery, this, this.document);