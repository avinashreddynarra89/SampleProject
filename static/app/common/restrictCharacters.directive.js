/**
 * This directive takes a constant from the value of data-restricted-characters
 * as defined in the associated html that uses it and uses it as a RegExp to
 * restrict input.
 * 
 */
(function() {
	'use strict';
	angular.module('sampleApp').directive('restrictCharacters', RestrictCharacters);

	RestrictCharacters.$inject = [];

	function RestrictCharacters() {
		return {
			restrict : 'A',
			require : "ngModel",
			link : function(scope, element, attrs, ngModelCtrl) {
				var el = element[0];
				var regex = scope.$eval(attrs.restrictCharacters);

				var removeInvalidCharacters = function(value) {
					return value.replace(regex, "");
				};

				ngModelCtrl.$parsers.push(function(val) {
					var cleaned = removeInvalidCharacters(val);

					// Avoid infinite loop of $setViewValue <-> $parsers
					if (cleaned === val)
						return val;

					var start = el.selectionStart;
					var end = el.selectionEnd + cleaned.length - val.length;

					// element.val(cleaned) does not behave with
					// repeated invalid elements
					ngModelCtrl.$setViewValue(cleaned);
					ngModelCtrl.$render();

					el.setSelectionRange(start, end);
					return cleaned;
				});
			}
		};
	}
})();