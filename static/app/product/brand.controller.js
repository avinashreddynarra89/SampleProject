(function() {
	'use strict';

	angular.module('sampleApp').controller('BrandController', BrandController);

	BrandController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','$state','DialogFactory','modalService','dataService','GlobalConstants','getProductDetails'];

	function BrandController($scope, $rootScope, device ,GlobalVariable,$state,DialogFactory,modalService,dataService,GlobalConstants,getProductDetails) {
		
		$scope.device = device;
		$scope.GlobalVariable = GlobalVariable;
		GlobalVariable.isLoginPage = false;
		$scope.selectedIndex = 0;
		$scope.isAsc = false;
		GlobalVariable.enableEdit = false;
		$scope.checkHidden = false;

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

		$rootScope.closeBootstrapAlert = function()
		{
			GlobalVariable.successAlert = false;
		};
		$scope.openAddPopup = function()
		{
			GlobalVariable.enableEdit = false;
			GlobalVariable.addHeaderName = "Add Brand";
			GlobalVariable.textName = "Brand";
			GlobalVariable.addButtonName = "Add Brand";
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
		$scope.editBrand = function(brandDetails)
		{
			GlobalVariable.enableEdit = true;
			GlobalVariable.editBrandName = brandDetails.brandName;
			GlobalVariable.editBrandDescription = brandDetails.brandDescription;
			GlobalVariable.editBrandId = brandDetails.brandId;
			GlobalVariable.addHeaderName = "Edit Brand";
			GlobalVariable.textName = "Brand";
			GlobalVariable.addButtonName = "Edit Brand";
			var _tmPath = 'app/product/AddPopup.html';
			var _ctrlPath = 'addPopupController';
			DialogFactory.show(_tmPath, _ctrlPath, addPopupControllerCallBack);
		};
		$scope.deleteBrand =function(brandId)
		{
			$scope.deleteBrandId = brandId;
			modalService.showModal('', {
				isCancel : true
			}, "Are you Sure Want to Delete ? ", $scope.callBackDeleteAction);
		};
		$scope.callBackDeleteAction = function(isOKClicked)
		{
			if(isOKClicked)
			{
				var url=GlobalConstants.URLCONSTANTS+'deleteBrand?brandId='+$scope.deleteBrandId;
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
		$scope.getBDetails = function(response)
		{

			GlobalVariable.getBrands = response;
		};
		$scope.callBackDeleteAction1 = function()
		{

			getProductDetails.getBrandDetails($scope.getBDetails);
		};
		function deleteErrorHandler(response)
		{
			console.log(response);
			modalService.showModal('', '', response, $scope.callBackDeleteAction1);
		}
		function render()
		{
			$scope.currentPageIndexArr = 0;
			$scope.curPageOnTotalLen = 0;
			$scope.totalLength = 0;
		}
		render();
		
	}
		
})();