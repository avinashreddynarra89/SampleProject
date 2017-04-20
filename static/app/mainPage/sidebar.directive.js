(function() {
	'use strict';

	angular.module('sampleApp').directive("sideNav", SideBar);

	SideBar.$inject = [];

	function SideBar() {
		return {
			restrict : 'E',
			templateUrl : 'app/mainPage/SideBar.html'
		};
	}
})();