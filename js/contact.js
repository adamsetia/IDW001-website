(function ($, window, document) {
	var win,
		doc,
		wrap,
		map1,
		map2,
		custom_styles,
		locations,
		curLoc,
		hasLoc = false;
	var geocoder;
		
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
		google.maps.event.addDomListener(window, 'load', start);
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
	function start() {
		geocoder = new google.maps.Geocoder();
		initialize();
		getUserLoc();
	}
	function getUserLoc() {
		// Try W3C Geolocation (Preferred)
		if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				codeLatLng(lat, lng);
	
			}, null);
		}
	}
	function codeLatLng(lat, lng) {

		var latlng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					//find country name
					for (var i=0; i<results[0].address_components.length; i++) {
						for (var b=0;b<results[0].address_components[i].types.length;b++) {
							//there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
							if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
								//this is the object you are looking for
								city= results[0].address_components[i];
								break;
							}
						}
					}
					//city data
					//alert(city.short_name + " " + city.long_name)
					curLoc = city.short_name;
					initialize();
				} 
		  } 
		});
	  }
	
	function initialize() {
		var mapAll = true;
		if(curLoc == "NSW" || curLoc == "QLD" || curLoc == "VIC" || curLoc == "Auckland" ) {
			mapAll = false;
			hasLoc = true;
		}
		
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
		if(mapAll) url = themePath+'img/marker-sml.png';
		var size = new google.maps.Size(100, 120);
		if(mapAll) size = new google.maps.Size(70, 84);
		if(window.devicePixelRatio > 1.5){
			url = themePath+'img/marker@2x.png';
			size = new google.maps.Size(200, 240);
			if(mapAll) {
				url = themePath+'img/marker-sml@2x.png';
				size = new google.maps.Size(140, 168);
			}
		}
		var image = {
			url: url,
			size: size,
			scaledSize: new google.maps.Size(100, 120),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(50, 120)
			
		};
		if(mapAll) {
			image = {
				url: url,
				size: size,
				scaledSize: new google.maps.Size(70, 84),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(35, 84)
				
			};
		}
		
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
			if(hasLoc) {
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