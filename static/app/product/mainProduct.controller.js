(function() {
	'use strict';

	angular.module('sampleApp').controller('mainProductController', mainProductController);

	mainProductController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','$state','DialogFactory','$timeout','RestrictedCharacter.Types','$filter','util','dataService','getProductDetails','GlobalConstants','modalService'];

	function mainProductController($scope, $rootScope, device ,GlobalVariable,$state,DialogFactory,$timeout,restrictCharacter,$filter,util,dataService,getProductDetails,GlobalConstants,modalService) {
		
		$scope.device = device;
		$scope.GlobalVariable = GlobalVariable;
		$scope.getProductDtls = [];

		$scope.restrictCharacter=restrictCharacter;
		GlobalVariable.isLoginPage = false;
		$scope.selectedIndex = 0;
		$scope.isAsc = false;
		$scope.enabled = true;
		$scope.showEditStock = [];
		//util.Wait(true);
		//loadCDetails();
		/*GlobalVariable.productSuccessAlert = false;
		GlobalVariable.addedSucces= false;
		GlobalVariable.editedSuccess= false;*/
		
		
		$scope.navigateToAddProduct = function(page)
		{
			if(page == 'product')
			{
				var test = new Object();
				test.name = 'Prodcut';
				test.last = 'No';
				$state.go(page,{obj:test});
			}
			else
			{	
			$state.go(page);
			}
			GlobalVariable.editProduct = false;
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
		
		/*$scope.applyFilter = function()
		{
			$scope.getProductDtls = $filter('filter')($scope.getProductDtls,$scope.vType);
		};*/
		$scope.checkValue = function()
		{
			if($scope.bType == null)
				{
				$scope.bType = '';
				}
			if($scope.cType == null)
				$scope.cType= '';
			if($scope.bType == null)
				$scope.bType= '';
				
		};
		$scope.checkValueProduct = function()
		{
			if($scope.productType == 'select')
			{
				$scope.bType = '';
				$scope.cType = '';
				$scope.bType = '';
			}
		};
		$scope.navigateToSales = function(productId,id)
		{
			GlobalVariable.productIdHistory = productId;
			GlobalVariable.categoryIdHistory = id;
			var _tmPath = 'app/product/historyPopup.html';
			var _ctrlPath = 'historyPopupController';
			DialogFactory.show(_tmPath, _ctrlPath, callbackPaymentHistory,undefined, undefined, 'lg');
		};
		function callbackPaymentHistory()
		{
			
		}
		$scope.editProduct = function(row)
		{
			
			var request = new Object();
			GlobalVariable.editProductDetails = row;
			GlobalVariable.IMEIProductID = row.productNo;
			GlobalVariable.editProduct = true;
			$state.go('product');
			
		};
		function render()
		{
			$scope.currentPageIndexArr = 0;
			$scope.curPageOnTotalLen = 0;
			$scope.totalLength = 0;
			$scope.productType = "select";
			$scope.editStock =false;
			if(GlobalVariable.getProducts == undefined || GlobalVariable.getProducts == null)
			getProductDetails.getProductDetail($scope.getCDetails);
			else
			{
				loadCDetails();
			}
			if(GlobalVariable.getVendors == undefined)
			getProductDetails.getVendorDetails($scope.getVDetails);
			if(GlobalVariable.getBrands == undefined)
			getProductDetails.getBrandDetails($scope.getBDetails);
			if(GlobalVariable.getCategory== undefined)
			getProductDetails.getCategoryDetails($scope.getCtDetails);

			/*$timeout(function() {
				$scope.closeBootstrapAlert();
			}, 9000);*/


			
				
		}
		$scope.getVDetails = function(response)
		{
			$scope.vendorOptions = response;
			GlobalVariable.getVendors = response;
		};
		$scope.getBDetails = function(response)
		{
			$scope.brandOptions = response;
			GlobalVariable.getBrands = response;
		};
		$scope.getCtDetails = function(response)
		{
			$scope.categoryOptions = response;
			GlobalVariable.getCategory= getCategory;
		};
		$scope.getCDetails = function(response)
		{

			$scope.getProductDtls = response;


			GlobalVariable.getProducts = response;
			loadCDetails();
			util.Wait(false);
		};
		function loadCDetails()
		{
			/*util.Wait(true);*/
			$scope.brandOptions = GlobalVariable.getBrands;
			$scope.categoryOptions = GlobalVariable.getCategory;
			$scope.vendorOptions = GlobalVariable.getVendors;
			$scope.getProductDtls = GlobalVariable.getProducts;
			for(var i=0;i<$scope.getProductDtls.length;i++)
			{
				$scope.showEditStock[i]=true;
			}
			/*$timeout(function() {
				util.Wait(false);
			}, 9000);*/
		};

		$scope.barLimit = 100;
		$scope.increaseLimit = function () {
			$scope.barLimit += 50;
			console.log('Increase Bar Limit', $scope.barLimit)
		};
		$scope.showRelatedProducts = function(prodNo)
		{
			GlobalVariable.mainProductNo = prodNo;
			var _tmPath = 'app/product/relatedProducts.html';
			var _ctrlPath = 'RelatedProductsController';
			DialogFactory.show(_tmPath, _ctrlPath, callbackRelatedProducts,undefined, undefined, 'lg');
		};
		function callbackRelatedProducts()
		{

		}
		$scope.displayLowStockProducts = function()
		{
			$scope.getProductDtls = [];
		  if($scope.lowStock == true) {
			  var url = GlobalConstants.URLCONSTANTS+"LowStockProductDetails";
			  dataService.Get(url, onGetStockSuccess, onGetStockError, 'application/json', 'application/json');
		  }
		  else
			{
				$scope.getProductDtls = GlobalVariable.getProducts;
			}
		};
		function onGetStockSuccess(response)
		{
			$scope.getProductDtls = response;
		}
		function onGetStockError(response)
		{

		}
		$scope.editStockDtls = function($index)
		{

			$scope.showEditStock[$index] = false;

		};

		$scope.updateStock = function(row,$index)
		{
			$scope.editIndexVal = $index;
			var request={
			"productId": row.productId,
			"productNo":row.productNo,
			"oldProductNo":row.productNo,
			"categoryId": row.categoryId,
			"vendorId": row.vendorId,
			"brandId": row.brandId,
			"altNo": row.altNo,
			"description":row.description,
			"costPrice":row.costPrice,
			"markup": row.markup,
			"retailPrice": row.retailPrice,
			"quantity": row.stock,
			"minProductQuantity": row.minProductQuantity,
			"returnRule":row.returnRule,
			"imeiNo":row.imeiNo,
			"image": "image",
			"createdDate": "1000-01-01 00:00:00",
			"addTax":row.addTax,
			"stock":row.stock
		};
			var url =GlobalConstants.URLCONSTANTS+"editProduct";
			request= JSON.stringify(request);

			dataService.Post(url,request,addStockSuccessHandler,addStockErrorHandler,"application/json","application/json");


		};
		function addStockSuccessHandler(response)
		{
			util.Wait(true);
			//$scope.editStock =false;
			$scope.showEditStock[$scope.editIndexVal] = true;
			getProductDetails.getProductDetail($scope.getCDetails);
		}
		function addStockErrorHandler(response) {


		}
		$scope.deleteProduct = function(id)
		{
			$scope.deleteProdId = id;
			modalService.showModal('', {
				isCancel : true
			}, "Are you Sure Want to Delete ? ", $scope.callBackDeleteProd);
		};
		$scope.callBackDeleteProd = function(isOKClicked)
		{
			if(isOKClicked)
			{
				util.Wait(true);
				var url='http://localhost:8080/deleteProduct?productId='+$scope.deleteProdId;
				var request = {};
				request=JSON.stringify(request);
				dataService.Post(url,request,onDeleteProductSucess,onDelteProductError,'application/json','application/json');
				//getProductDetails.getProductDetail($scope.getCDetails);
			}
		};
		function onDeleteProductSucess(response)
		{
			getProductDetails.getProductDetail($scope.getCDetails);
		}
		function onDelteProductError(response)
		{

		}
		render();
		
	}
		
})();