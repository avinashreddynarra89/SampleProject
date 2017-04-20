(function() {
	'use strict';

	angular.module('sampleApp').controller('addPopupController', addPopupController);

	addPopupController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','dataService','$timeout','$state','getProductDetails','GlobalConstants'];

	function addPopupController($scope, $rootScope, device ,GlobalVariable,DialogFactory,dataService,$timeout,$state,getProductDetails,GlobalConstants)
	{
		$scope.device= device;
		$scope.GlobalVariable = GlobalVariable;
		$scope.successAlert = false;
		$scope.closePopup = function()
		{
			DialogFactory.close(true);
		};
		
		$scope.addItems = function(name)
		{
			
			var request = new Object();
			if(name == 'Brand') {
				
				if(GlobalVariable.enableEdit == true)
				{	
					var url = GlobalConstants.URLCONSTANTS+"editBrand";
					request.brandId = GlobalVariable.editBrandId; 
				}
				else
				var url = GlobalConstants.URLCONSTANTS+"addBrand";
				request.brandName = $scope.brandName;
				request.brandDescription = $scope.brandDescription;
			}
			else if(name == 'Vendor') {
				if(GlobalVariable.enableEdit == true)
				{	
					var url = GlobalConstants.URLCONSTANTS+"editVendor";
					request.vendorId = GlobalVariable.editBrandId;
				}
				else
				var url = GlobalConstants.URLCONSTANTS+"addVendor";
				request.vendorName = $scope.brandName;
				request.description = $scope.brandDescription;
				request.commision = $scope.commision;
				request.phoneNumber = $scope.PhoneNumber;
				request.companyName = $scope.companyName;
				request.address = $scope.address;
			}
			else if(name == 'Category') {
				if(GlobalVariable.enableEdit == true)
				{	
					var url = GlobalConstants.URLCONSTANTS+"editCategory";
					request.categoryId = GlobalVariable.editBrandId;
				}
				else
				var url = GlobalConstants.URLCONSTANTS+"addCategory";
				request.categoryName = $scope.brandName;
				request.description = $scope.brandDescription;

			}
			else if(name == 'Model') {
				if(GlobalVariable.enableEdit == true)
				{
					var url = GlobalConstants.URLCONSTANTS+"editModel";
					request.modelId = GlobalVariable.editBrandId;
				}
				else
					var url = GlobalConstants.URLCONSTANTS+"addModel";
				request.modelName = $scope.brandName;
				request.description = $scope.brandDescription;

			}


			request = JSON.stringify(request);

			dataService.Post(url,request,addItemsSuccessHandler,addItemsErrorHandler,"application/json","application/json");
		};
		function addItemsSuccessHandler(response)
		{
			DialogFactory.close(true);
			GlobalVariable.successAlert = true;
			if(GlobalVariable.textName == 'Brand')
			{
				getProductDetails.getBrandDetails();
				$state.go('brand');
			}
			else if(GlobalVariable.textName == 'Vendor')
			{	
				getProductDetails.getVendorDetails();
				$state.go('vendor');
			}
			else if(GlobalVariable.textName == 'Model')
			{
				getProductDetails.getModelDetails();
				$state.go('modal');
			}
			else
			{
				getProductDetails.getCategoryDetails();
				$state.go('supplier');
			}
			console.log(response);
			$timeout(function() {
				$rootScope.closeBootstrapAlert();
			}, 9000);
		}
		function addItemsErrorHandler(response)
		{
			DialogFactory.close(true);
			$timeout(function() {
				$rootScope.closeBootstrapAlert();
			}, 9000);
		}
		
		function render()
		{
			$scope.brandName = '';
			$scope.brandDescription ='';
			if(GlobalVariable.textName == 'Vendor')
			$scope.commision = '';
			if(GlobalVariable.enableEdit == true)
			{
				$scope.brandName = GlobalVariable.editBrandName;
				$scope.brandDescription = GlobalVariable.editBrandDescription;
				if(GlobalVariable.textName == 'Vendor')
					{				$scope.commision = GlobalVariable.editCommision;
				$scope.PhoneNumber=GlobalVariable.editPhoneNumber;
				$scope.companyName=GlobalVariable.editCompanyName ;
				$scope.address = GlobalVariable.editaddress ;
					}
			}	
		}
		render();
	}
		
})();