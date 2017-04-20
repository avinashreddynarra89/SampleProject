(function() {
	'use strict';

	angular.module('sampleApp').factory('device.utility', Monitor);

	Monitor.$inject = [ 'screenSize' ];

	function Monitor(screenSize) {

		screenSize.rules = {
			lg : '(min-width: 1200px)',
			md : '(min-width: 992px) and (max-width: 1199px)',
			sm : '(min-width: 768px) and (max-width: 991px)',
			xs : '(max-width: 767px)',
			tablet : '(min-width: 992px) and (max-width: 1281px)',
			tc70 : '(min-width: 359px) and (max-width: 361px) and (min-height: 614px) and (max-height: 616px)'
		};

		var service = {
			isDesktop : false,
			isMobile : false,
			isTablet : false,
			isTC70 : false,
			popoverTrigger : 'mouseenter',
			isMobileLandscape : false,
			updateLandscape : updateLandscape,
			
		};
		service.isTablet = screenSize.on('md,tablet', function(match) {
			service.isTablet = match;
			updateTrigger();
		});
		
		service.isLargeScreen = screenSize.on('lg', function(match) {
			service.isLargeScreen = match;
			updateTrigger();
		});
		
		service.isDesktop = screenSize.on('md, lg', function(match) {
			service.isDesktop = match;
			updateTrigger();
		});
		service.isMobile = screenSize.on('xs, sm', function(match) {
			service.isMobile = match;
			if (service.isMobile) {
				updateLandscape();
			}
			updateTrigger();
		});
		service.isTC70 = screenSize.on('tc70', function(match) {
			/** Once it  becomes true, don't set it to false - changed this logic to handle the keyboard popup **/
			if(match){
				service.isTC70 = match;
			}
			updateTrigger();
		});
		if (service.isMobile) {
			updateLandscape();
		}
		updateTrigger();

		function updateLandscape() {
			var width, height;
			// IE
			if (!window.innerWidth) {
				if (!(document.documentElement.clientWidth == 0)) {
					// strict mode
					width = document.documentElement.clientWidth;
					height = document.documentElement.clientHeight;
				} else {
					// quirks mode
					width = document.body.clientWidth;
					height = document.body.clientHeight;
				}
			} else {
				// w3c
				width = window.innerWidth;
				height = window.innerHeight;
			}
			service.isMobileLandscape = (width > height);
		}
		function updateTrigger() {
			service.popoverTrigger = (service.isMobile || service.isTablet || service.isTC70 || service.isLargeScreen) ? 'click' : 'mouseenter';
		}

		return service;
	}
})();