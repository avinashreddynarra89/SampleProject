(function() {
	'use strict';

	angular.module('sampleApp').directive('restrictSpecialChars', Restrict);

	Restrict.$inject = [];

	function Restrict() {
		return {
			restrict : 'A',
			require : 'ngModel',
			link : function(scope, element, attrs, modelCtrl) {
				element.bind('input', function() {
					var inputEle = $(this);
					inputEle.val(inputEle.val().replace(/[^a-zA-Z0-9 ]/g, ""));
				});
			}
		};
	}

})();