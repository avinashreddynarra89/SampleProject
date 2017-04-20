(function() {
	'use strict';

	angular.module('sampleApp').filter('startFrom', StartFrom);

	StartFrom.$inject = [];

	function StartFrom() {
		return function(input, start) {
			start = parseInt(start, 10);
			if (angular.isDefined(input) && input !== null) {
				return input.slice(start);
			} else {
				return '';
			}
		};
	}
})();