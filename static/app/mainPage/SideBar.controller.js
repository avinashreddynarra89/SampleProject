(function() {
	'use strict';

	angular.module('sampleApp').controller('SidebarController', SidebarController);

	SidebarController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','$state'];

	function SidebarController($scope, $rootScope, device,GlobalVariable,$state) {
		
		var vm = this;
		vm.device = device;
		$scope.GlobalVariable = GlobalVariable;
		$scope.device = device;
		GlobalVariable.userRole=sessionStorage.userRole;
		GlobalVariable.isLoginPage = false;
		
		$scope.menuOptions = [{
			
			menuCode:1,
			menuName:"Home",
			imgPath:"assets/images/home.png",
			path:"home"
		},
		{
			menuCode:2,
			menuName:"Sell",
			imgPath:"assets/images/sell.png",
			path:"sell"
		},
		{
			menuCode:3,
			menuName:"Sales History",
			imgPath:"assets/images/ledger.png",
			path:"ledger"
		},
		{
			menuCode:4,
			menuName:"Report",
			imgPath:"assets/images/report.png",
			path:"report"
		},
		{
			menuCode:5,
			menuName:"Product",
			imgPath:"assets/images/final-logo.png",
			path:"productmain"
		},
		{
			menuCode:6,
			menuName:"Customer",
			imgPath:"assets/images/addCustomer.png",
			path:"customer"
		},
		{
			menuCode:7,
			menuName:"Setup",
			imgPath:"assets/images/setup.png",
			path:"setup"
		}
			
		];
		$scope.openNav = function() {
			$rootScope.displaySideBar = !$rootScope.displaySideBar;
		};
		
		$scope.navigate = function(code,page)
		{
			$scope.selectedMenuCd = code;
			if(page == 'sell')
			GlobalVariable.returnProduct = false;
			$state.go(page);
		};
		$scope.navigateToBrand = function()
		{
			$state.go('brand');
		};
		$scope.navigateToPage = function(page)
		{
			$state.go(page);
		};
	}
})();