(function() {
	'use strict';

	angular.module('sampleApp').directive('restrictTag', RestrictTag);

	RestrictTag.$inject = [];

	function RestrictTag() {
		return {
			restrict : 'A',
			require : 'ngModel',
			link : function(scope, element, attrs, modelCtrl) {
				element.bind('keypress', function(event) {
					// Allow only backspace, delete, left and right arrows,
					// return and tab
					if (event.charCode == 60 || event.charCode == 62) {
						event.preventDefault();
					}
				});
			}
		};
	}

})();
