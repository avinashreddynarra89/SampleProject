(function() {
	'use strict';

	angular.module('sampleApp').controller('VendorController', VendorController);

	VendorController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','$state','DialogFactory','dataService','modalService','GlobalConstants','getProductDetails'];

	function VendorController($scope, $rootScope, device ,GlobalVariable,$state,DialogFactory,dataService,modalService,GlobalConstants,getProductDetails) {
		
		$scope.device = device;
		$scope.GlobalVariable = GlobalVariable;
		GlobalVariable.isLoginPage = false;
		$scope.selectedIndex = 0;
		$scope.isAsc = false;
		GlobalVariable.enableEdit = false;

$rootScope.closeBootstrapAlert = function()
{
	GlobalVariable.successAlert = false;
};
		
		$scope.sortColumnData = function(index) {
			if ($scope.testGridData != null && $scope.testGridData.length > 0) {
				if (index != 0) {
					return false;
				}
				if ($scope.isAsc) {
					$scope.isAsc = false;
				} else {
					$scope.isAsc = true;$scope
				}$scope
			}
		};
		
		$scope.navigateToProduct = function()
		{
			$state.go('productmain');
		};
		$scope.openAddPopup = function()
		{
			GlobalVariable.enableEdit = false;
			GlobalVariable.addHeaderName = "Add Vendor";
			GlobalVariable.textName = "Vendor";
			GlobalVariable.addButtonName = "Add Vendor";
			var _tmPath = 'app/product/AddPopup.html';
			var _ctrlPath = 'addPopupController';
			DialogFactory.show(_tmPath, _ctrlPath, addPopupControllerCallBack);
		};
		$scope.editVendor = function(vendorDetails)
		{
			GlobalVariable.enableEdit = true;
			GlobalVariable.editBrandName = vendorDetails.vendorName;
			GlobalVariable.editBrandDescription = vendorDetails.vendorDescription;
			GlobalVariable.editBrandId = vendorDetails.vendorId;
			GlobalVariable.editCommision = vendorDetails.commision;
			GlobalVariable.editPhoneNumber = vendorDetails.phoneNo;
			GlobalVariable.editCompanyName = vendorDetails.companyName;
			GlobalVariable.editaddress = vendorDetails.address;
			GlobalVariable.addHeaderName = "Edit Vendor";
			GlobalVariable.textName = "Vendor";
			GlobalVariable.addButtonName = "Edit Vendor";
			var _tmPath = 'app/product/AddPopup.html';
			var _ctrlPath = 'addPopupController';
			DialogFactory.show(_tmPath, _ctrlPath, addPopupControllerCallBack);
		};
		function addPopupControllerCallBack()
		{
			GlobalVariable.addesSuccessfull = true;
			GlobalVariable.addHeaderName = "";
			GlobalVariable.textName = "";
			GlobalVariable.addButtonName = "";
		}
		$scope.deleteVendor =function(vendorId)
		{
			$scope.deleteVendorId = vendorId;
			modalService.showModal('', {
				isCancel : true
			}, "Are you Sure Want to Delete ? ", $scope.callBackDeleteAction);
		};
		$scope.callBackDeleteAction = function(isOKClicked)
		{
			if(isOKClicked)
			{
				var url=GlobalConstants.URLCONSTANTS+'deleteVendor?vendorId='+$scope.deleteVendorId;
				var request = {};
				request=JSON.stringify(request);

				dataService.Post(url,request,deleteSuccessHandler,deleteErrorHandler,"application/json","application/text");
			}
		};
		function deleteSuccessHandler(response)
		{
			console.log(response);
			modalService.showModal('', '', response, $scope.callBackDeleteAction1);

		}
		function deleteErrorHandler(response)
		{
			console.log(response);
			modalService.showModal('', '', response, $scope.callBackDeleteAction1);
		}
		$scope.callBackDeleteAction1 = function()
		{

			getProductDetails.getVendorDetails($scope.getVDetails);
		};
		$scope.getVDetails = function(response)
		{

			GlobalVariable.getVendors = response;
		};
		function render()
		{
			console.log("vendor render");
			$scope.currentPageIndexArr = 0;
			$scope.curPageOnTotalLen = 0;
			$scope.totalLength = 0;
		}
		render();
		
	}
		
})();