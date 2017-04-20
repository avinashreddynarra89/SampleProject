(function() {
	'use strict';
	angular.module('sampleApp').directive('contenteditable', contenteditable);

	contenteditable.$inject = [];

	function contenteditable() {
		return {
		    require: 'ngModel',
		    link: function(scope, element, attrs, ngModel) {

		      element.bind('blur change', function() {
		        scope.$apply(function() {
		          ngModel.$setViewValue(element.html());
		        }); 
		      });

		      ngModel.$render = function() {
		        element.html(ngModel.$viewValue);
		      };
		    }
		  }
	}

})();