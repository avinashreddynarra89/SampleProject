(function() {
	'use strict';
	angular.module('sampleApp').directive('ngEnter', Enter);

	Enter.$inject = [];

	function Enter() {
		return {
			link : function(scope, elem, attrs) {
				elem.bind('keypress', function(event) {
					if (event.which === 13) {
						elem.trigger('change');
						scope.$apply(function() {
							scope.$eval(attrs.ngEnter);
						});
						event.preventDefault();
					}
				});
			}
		};
	}

})();