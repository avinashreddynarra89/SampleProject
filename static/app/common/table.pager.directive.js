(function() {
	'use strict';

	angular.module('sampleApp').directive('pageNavigation', PageNav);

	PageNav.$inject = [];

	function PageNav() {
		return {
			restrict : 'AE',
			transclude : true,
			replace : true,
			scope : {
				currentPage : "=pageCount",
				currentPageIndexArr : "=currentPage",
				totalLength : "=itemCount",
				currentGrid : "=sourceGrid",
				numPagesShown : "=?",
				pageSize : "=?"
			},
			templateUrl : 'app/common/core/tables/table.pager.html',
			// ?' + (new Date()).getTime(),
			controller : 'pageNavigationController',
			link : function(scope, element, attrs, ctrl) {
				if (scope.numPagesShown === undefined)
					scope.numPagesShown = 5;
				if (scope.pageSize === undefined)
					scope.pageSize = 50;
				if (scope.currentPage === undefined)
					scope.currentPage = 0;
				if (scope.currentPageIndexArr === undefined)
					scope.currentPageIndexArr = 0;

			}
		};
	}
})();