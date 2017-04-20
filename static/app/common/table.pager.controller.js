(function() {
	'use strict';

	angular.module('sampleApp').controller('pageNavigationController', Pager);

	Pager.$inject = [ '$scope', '$rootScope', '$timeout', 'dataService', 'GlobalConstants', 'GlobalVariable', 'DialogFactory',
			'modalService', 'purchaseTracking.search.utility' ];

	function Pager($scope, $rootScope, $timeout, dataService, GlobalConstants, GlobalVariable, DialogFactory, modalService,
			Search) {
		// Sets initial Pagination values
		// $scope.$on('loadPager',function(){
		$scope.currentPage = 0; // Current selected page, starts from 0
		// $scope.currentPageIndexArr = 1;
		// $scope.totalLength = 1; // Total number of transactions
		// $scope.pageSize = 50; // Overall Page Size
		// $scope.numPagesShown = 5; // Number of pages shown
		// $scope.currentGrid = '';
		$scope.pageNumberArray = new Array();

		$scope.$watch(function() {
			return $scope.totalLength;
		}, function(newValue) {
			$scope.loadPager();
		});

		function render() {
			$scope.loadPager();
		}

		$scope.loadPager = function() {
			if ($scope.totalLength !== 0) {
				$scope.showPager = true;
				$scope.lastPage = Math.ceil($scope.totalLength / $scope.pageSize);
				// Represents whether in current 2$scope.numPagesShown0
				// records. First $scope.numPagesShown pages gives 1 , next
				// five gives 2
				$scope.navCount = Math.ceil(($scope.currentPage + 1) / $scope.numPagesShown);
				$scope.updateCurPageIndex();
			} else {
				$scope.showPager = false;
			}
			$scope.getRange();

			// $timeout(function() {
			$scope.showOnlyFivePages();
			// }, 5);
		};

		var deregisterReset = $rootScope.$on('resetAndLoad', function(event, resetObject) {
			$scope.resetAndLoad(resetObject);
		});

		$scope.$on('$destroy', function() {
			deregisterReset();
		});

		$scope.resetAndLoad = function(_resetObj) {
			/*
			 * $scope.currentPage = 0; //Current selected page, starts from 0
			 * $scope.currentPageIndexArr = 1;
			 */
			$scope.totalLength = _resetObj.totLen;
			$scope.currentGrid = _resetObj.srcGrid;
			if (_resetObj.pageSize && _resetObj.numPagesShown) {
				$scope.pageSize = _resetObj.pageSize;
				$scope.numPagesShown = _resetObj.numPagesShown;
			}
			$scope.loadPager();

		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		// To reset Nav Count on sorting
		$scope.resetNavCountOnSort = function() {
			$scope.navCount = 1;
			$scope.curPageCount = 1;
			$scope.updateCurPage(($scope.navCount - 1) * 5);
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		// To set the Page range
		$scope.getRange = function() {
			$scope.pageNumberArray = [];
			var count = $scope.numPagesShown;
			// if($scope.lastPage - ($scope.currentPage + 1))
			if (($scope.currentNavSelection + $scope.numPagesShown) > $scope.lastPage) {
				count = $scope.lastPage - $scope.currentNavSelection;
			}
			for (var i = 1; i <= count; i++) {
				$scope.pageNumberArray.push(i);
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		// Onclick of Page number, to load current page
		$scope.updateCurPage = function(curPage) {
			$scope.$broadcast("clearSelectAll");
			$scope.currentPage = ((($scope.navCount - 1) * $scope.numPagesShown) + curPage);
			$scope.updateCurPageIndex();
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		// update Index entries on NavCount and CurPage change
		$scope.updateCurPageIndex = function() {
			// $(".small-only").remove();
			$scope.currentPageIndexArr = (($scope.currentPage + 1) % $scope.numPagesShown);
			if ($scope.currentPageIndexArr == 0) {
				$scope.currentPageIndexArr = $scope.numPagesShown;
			}
			$scope.currentNavSelection = (($scope.navCount - 1) * $scope.numPagesShown);
			$scope.startIndex = ($scope.currentPage * $scope.pageSize + 1); // Show
			// Entries
			// of a
			// page
			// -start
			// Index
			var val = ($scope.startIndex) + ($scope.pageSize) - 1;
			if ($scope.totalLength <= val && $scope.totalLength > 0) {
				$scope.closeIndex = $scope.totalLength; // Show Entries of a
				// page -End Index
			} else {
				$scope.closeIndex = val;
			}
		};

		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		// Only show 5 page numbers at once. Remaining page numbers should
		// be hidden
		$scope.showOnlyFivePages = function() {
			var tempVal = ($scope.currentPage + 1) % $scope.numPagesShown;
			$scope.curPageCount = Math.ceil(tempVal / 5);
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		// To move to next/Previous page
		$scope.movePrevOrNext = function(optn) {

			$scope.$broadcast("clearSelectAll");

			var pageFwd;
			if (($scope.currentPage == 0 && optn == -1) || ((($scope.currentPage + 1) == $scope.lastPage) && optn == 1)) {
				return false;
			}
			$scope.currentPage = $scope.currentPage + optn;
			var prevNavCount = $scope.navCount;
			$scope.navCount = Math.ceil(($scope.currentPage + 1) / $scope.numPagesShown);
			$scope.updateCurPageIndex();
			if ($scope.navCount != prevNavCount) {
				$scope.getRange();
			}
			$scope.showOnlyFivePages();

			if ($scope.navCount != prevNavCount) {
				// service Call
				// update Response Variable
				// $scope.currentPageIndexArr = 10;
				if (optn == -1) {
					pageFwd = false;
				} else {
					pageFwd = true;
				}
				// Service call to load next /previous set of records
				if ($scope.currentGrid === GlobalConstants.PURCHASE_DETAIL_GRID) {
					// $scope.loadPurchaseDetail(pageFwd, true);
					Search.loadDetails(pageFwd, true);
					return false;
				} else if ($scope.currentGrid === GlobalConstants.ACCT_ID_GRID) {
					$rootScope.loadViewAccountGrid(pageFwd, true);
					return false;
				} else if ($scope.currentGrid === GlobalConstants.PURCHASE_SUMMARY_GRID) {
					if ($scope.isAsc)
						// Pagination with Ascending Order
						Search.loadCustomerTransactions(pageFwd, true, true);
					// $scope.loadCustTransaction(pageFwd, true, true);
					else
						// Pagination with Descending Order
						Search.loadCustomerTransactions(pageFwd, true, false);
					// $scope.loadCustTransaction(pageFwd, true, false);
					return false;
				} else if ($scope.currentGrid === GlobalConstants.CREDIT_ACC_GRID) {
					var isFirstPage = false;
					if ($scope.navCount == 1) {
						isFirstPage = true;
					}
					$rootScope.loadNextPrevAccDtls(pageFwd, isFirstPage);
				}
			}
		};

		$scope.$on('resetPager', function() {
			$scope.resetNavCountOnSort();
		});

		render();
	}
})();