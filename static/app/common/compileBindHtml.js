(function() {
	'use strict';
	angular.module('sampleApp').directive('compileBindHtml', CompileBindHtml);
	function CompileBindHtml($compile) {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				scope.$watch(function() {
					return scope.$eval(attrs.compileBindHtml);
				}, function(value) {
					element.html(value);
					$compile(element.contents())(scope);
				});
			}
		};
	}
})();