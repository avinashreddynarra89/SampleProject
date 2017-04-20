(function() {
	'use strict';

	angular.module('sampleApp').controller('BodyController', Body);

	Body.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','$state','dataService','getProductDetails','$window','$sce','modalService','GlobalConstants','DialogFactory','getPageSetupDetails'];

	function Body($scope, $rootScope, device,GlobalVariable,$state,dataService,getProductDetails,$window,$sce,modalService,GlobalConstants,DialogFactory,getPageSetupDetails) {
		
		var vm = this;
		vm.device = device;
		$scope.GlobalVariable = GlobalVariable;
		$scope.device = device;
		GlobalVariable.isLoginPage = false;
		getPageSetupDetails.getPageSetUpDtls();
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

		/*$window.onbeforeunload = function (event) {
			$scope.logOut();
			var msg= 'Are you sure want to close broswer?';

			//var message = 'Important: Please click on \'Save\' button to leave this page.';
			if (typeof event == 'undefined') {
				event = $window.event;
			}
			if (event) {
				event.returnValue = msg;

			}
			return msg;
		};*/


		$scope.navigate = function(code,page)
		{
			$scope.selectedMenuCd = code;
			$state.go(page);
		};
		$scope.navigateToBrand = function()
		{
			$state.go('brand');
		};
		function render()
		{
			getProductDetails.getProductValues();
			getProductDetails.getUserDetails();
		}
		function js_yyyy_mm_dd_hh_mm_ss () {
			var now = new Date();
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
			var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			var  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
			return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
		}
		$scope.logOut = function()
		{
			//alert("logout");
			var url=GlobalConstants.URLCONSTANTS+"addUserClockIn";
			var request={

				"username": sessionStorage.userName,
				"clockInTime": sessionStorage.clockTime,
				"clockOutTime": js_yyyy_mm_dd_hh_mm_ss()
			};
			request= JSON.stringify(request);
			dataService.Post(url,request,onClockSuccess,OnClockError,'application/json','application/json');

		};
		function onClockSuccess(response)
		{
			$state.go('login');
		}
		function OnClockError(error)
		{

		}
		$scope.addClockIn = function()
		{
			var _tmPath = 'app/mainPage/clockIn.html';
			var _ctrlPath = 'ClockInController';
			DialogFactory.show(_tmPath, _ctrlPath,$scope.callbackClock);
		};
		$scope.callbackClock = function()
		{

		};
		render();
	}
})();