(function() {
	'use strict';

	angular.module('sampleApp').controller('sellController', sellController);

	sellController.$inject = [ '$scope', '$rootScope', 'device.utility',
		'GlobalVariable', 'DialogFactory', 'modalService',
		'RestrictedCharacter.Types', 'dataService', '$state', '$timeout','$sce','GlobalConstants','getProductDetails','$window'];

	function sellController($scope, $rootScope, device, GlobalVariable,
							DialogFactory, modalService, restrictCharacter, dataService,
							$state, $timeout,$sce,GlobalConstants,getProductDetails,$window) {

		$scope.device = device;
		$scope.productFound = false;
		$scope.GlobalVariable = GlobalVariable;
		$scope.restrictCharacter = restrictCharacter;
		GlobalVariable.printInvoice = false;
		GlobalVariable.isLoginPage = false;
		GlobalVariable.balanceRemaining = 0;
		GlobalVariable.customerFound = false;
		$scope.showEditableFields = false;
		$scope.IMEIProdctFound = false;
		//GlobalVariable.addProductClicked= false;

		var i = 0;


		$rootScope.testData = [];
		$scope.productNames = [];
		$scope.firstNames = [];

		$scope.addRow = function() {
			GlobalVariable.editProduct = false;
			$state.go('product');
		};
		$scope.removeRow = function($index,row) {

			$scope.deleteIndex = $index;
			GlobalVariable.editValues = row;
			GlobalVariable.itemNoToDelete = row.itemId;
			modalService.showModal('', {
				isCancel : true
			}, "Are you Sure Want to Delete ? ", $scope.callBackAction);

		};
		$scope.callBackAction = function(isOKClicked) {

			if (isOKClicked) {
				$rootScope.testData.splice($scope.deleteIndex, 1);
				$scope.loadCheckOutData();
			}
		}
		$scope.editItemNo = function(row) {
			console.log(row);
		};
		$scope.callBackValidateIMEI = function()
		{

			$scope.getAllSellIMEINumbers();
		};
		$scope.getAllSellIMEINumbers = function()
		{
			var url=GlobalConstants.URLCONSTANTS+'getPhoneDetails?productNo='+GlobalVariable.sellProductNo;
			dataService.Get(url,onGetSellIMEISuccess,onGETSellIMEIError,'application/json','application/json');
		};
		function onGetSellIMEISuccess(response)
		{
			$scope.IMEIProdctFound = false;
			if(response.length !== 0)
			{
				for(var i =0;i< response.length;i++)
				{
					if(GlobalVariable.sellIMEINumber == response[i].imeiNo)
					{
						$scope.IMEIProdctFound = true;
						if(response[i].addTax == true)
						{
							var totalWithOutTax = Number((parseFloat(response[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
								.toFixed(2);
							totalWithOutTax = parseFloat(totalWithOutTax);
							var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
						}
						else
						{
							var totalWithOutTax = Number((parseFloat(response[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
								.toFixed(2);
							totalWithOutTax = parseFloat(totalWithOutTax);
							var totalWithTax = totalWithOutTax;
						}
						$rootScope.testData
							.push({
								"itemId":response[i].productId,
								"itemNo" : response[i].productNo,
								"item" : response[i].description,
								"quantity" : response[i].quantity,
								"retail" : response[i].retailPrice,
								"discount" : (parseFloat($scope.discount))
									.toFixed(2),
								"total" : totalWithOutTax,
								"stock" : response[i].stock,
								"costPrice" : response[i].costPrice,
								"categoryName":response[i].categoryName,
								"totalWithTax":totalWithTax,
								"totalTax":parseFloat(totalWithTax)-parseFloat(totalWithOutTax),
								"imeiNo":response[i].imeiNo,
								"categoryId":response[i].categoryId,
								"phoneId":response[i].phoneId,
								"addTax":response[i].addTax
							});
					}
				}
			}
			if($scope.IMEIProdctFound == false)
			{
				$rootScope.testData
					.push({
						"itemId":GlobalVariable.sellProductId,
						"itemNo" :GlobalVariable.sellProductNo,
						"item" : GlobalVariable.sellDescription,
						"quantity" :1,
						"retail" : 0,
						"discount" : 0,
						"total" : 0,
						"stock" :0,
						"costPrice" : 0,
						"categoryName":'',
						"totalWithTax":0,
						"totalTax":0,
						"imeiNo":GlobalVariable.sellIMEINumber,
						"categoryId":GlobalVariable.sellCategoryId,
						"phoneId":'',
						"addTax":GlobalVariable.sellAddTax
					});
			}

			$scope.loadCheckOutData();

		}
		function onGETSellIMEIError(response)
		{

		}
		$scope.loadDtlsByAltNo = function()
		{
			var searchValueAlt = $scope.searchValueAlt.toString();
			$scope.discount = 0;
			for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
				if (searchValueAlt === GlobalVariable.getProducts[i].altNo) {
					if($scope.customerProductPrice)
					{
						for(var k = 0;k< $scope.customerProductPrice.length;k++)
						{
							if($scope.customerProductPrice[k].productNo == GlobalVariable.getProducts[i].productNo)
							{
								GlobalVariable.getProducts[i].retailPrice = $scope.customerProductPrice[k].retailPrice;
							}
						}
					}
					if(	GlobalVariable.getProducts[i].categoryId == 10)
					{
						GlobalVariable.sellProductNo = GlobalVariable.getProducts[i].productNo;
						GlobalVariable.sellProductId =GlobalVariable.getProducts[i].productId;
						GlobalVariable.sellDescription = GlobalVariable.getProducts[i].description;
						GlobalVariable.sellCategoryId = GlobalVariable.getProducts[i].categoryId;
						GlobalVariable.sellAddTax= GlobalVariable.getProducts[i].addTax;

						var _tmPath = 'app/sell/validateIMEI.html';
						var _ctrlPath = 'ValidateIMEIController';
						DialogFactory.show(_tmPath, _ctrlPath, $scope.callBackValidateIMEI);
					}
					else
					{
						if(GlobalVariable.getProducts[i].addTax == true)
						{
							var totalWithOutTax = Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
								.toFixed(2);
							totalWithOutTax = parseFloat(totalWithOutTax);
							var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
						}
						else
						{
							var totalWithOutTax = Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
								.toFixed(2);
							totalWithOutTax = parseFloat(totalWithOutTax);
							var totalWithTax = totalWithOutTax;
						}
						$rootScope.testData
							.push({
								"itemId":GlobalVariable.getProducts[i].productId,
								"itemNo" : GlobalVariable.getProducts[i].productNo,
								"item" : GlobalVariable.getProducts[i].description,
								"quantity" : GlobalVariable.getProducts[i].quantity,
								"retail" : GlobalVariable.getProducts[i].retailPrice,
								"discount" : (parseFloat($scope.discount))
									.toFixed(2),
								"total" : totalWithOutTax,
								"stock" : GlobalVariable.getProducts[i].stock,
								"costPrice" : GlobalVariable.getProducts[i].costPrice,
								"categoryName":GlobalVariable.getProducts[i].categoryName,
								"totalWithTax":totalWithTax,
								"totalTax":parseFloat(totalWithTax)-parseFloat(totalWithOutTax),
								"categoryId":GlobalVariable.getProducts[i].categoryId,
								"imeiNo":GlobalVariable.getProducts[i].imeiNo,
								"phoneId":GlobalVariable.getProducts[i].phoneId,
								"addTax":GlobalVariable.getProducts[i].addTax
							});
						$scope.searchValueAlt = '';
						if(GlobalVariable.getProducts[i].relatedProduct = true)
						{

							var url=GlobalConstants.URLCONSTANTS+"getRelatedProduct?productNo="+GlobalVariable.getProducts[i].productNo;
							dataService.Get(url,onGetRelatedSuccess,onGetRelatedError,'application/json','application/json');
							break;
						}

						break;
					}

				}
				else
				{
					$scope.searchValueAlt = '';
				}
			}
		};
		$scope.changeQuantity = function() {
			var searchTxt = $scope.searchValue.toString();
			if (searchTxt !== '' && searchTxt !== undefined
				&& searchTxt.indexOf(".") !== 0) {
				if (searchTxt.match(/[a-z]/i)) {
					console.log("contains only charcters");
					$scope.discount = 0;
					for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
						if (searchTxt === GlobalVariable.getProducts[i].description) {

							if($scope.customerProductPrice)
							{
								for(var k = 0;k< $scope.customerProductPrice.length;k++)
								{
									if($scope.customerProductPrice[k].productNo == GlobalVariable.getProducts[i].productNo)
									{
										GlobalVariable.getProducts[i].retailPrice = $scope.customerProductPrice[k].retailPrice;
									}
								}
							}
							if(GlobalVariable.getProducts[i].categoryId == 10)
							{
								GlobalVariable.sellProductNo = GlobalVariable.getProducts[i].productNo;
								GlobalVariable.sellProductId =GlobalVariable.getProducts[i].productId;
								GlobalVariable.sellDescription = GlobalVariable.getProducts[i].description;
								GlobalVariable.sellCategoryId = GlobalVariable.getProducts[i].categoryId;
								GlobalVariable.sellAddTax= GlobalVariable.getProducts[i].addTax;

								var _tmPath = 'app/sell/validateIMEI.html';
								var _ctrlPath = 'ValidateIMEIController';
								DialogFactory.show(_tmPath, _ctrlPath, $scope.callBackValidateIMEI);
							}
							else
							{
								if(GlobalVariable.getProducts[i].addTax == true)
								{
									var totalWithOutTax = Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
										.toFixed(2);
									totalWithOutTax = parseFloat(totalWithOutTax);
									var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
								}
								else
								{
									var totalWithOutTax = Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
										.toFixed(2);
									totalWithOutTax = parseFloat(totalWithOutTax);
									var totalWithTax = totalWithOutTax;
								}
								$rootScope.testData
									.push({
										"itemId":GlobalVariable.getProducts[i].productId,
										"itemNo" : GlobalVariable.getProducts[i].productNo,
										"item" : GlobalVariable.getProducts[i].description,
										"quantity" : GlobalVariable.getProducts[i].quantity,
										"retail" : GlobalVariable.getProducts[i].retailPrice,
										"discount" : (parseFloat($scope.discount))
											.toFixed(2),
										"total" : totalWithOutTax,
										"stock" : GlobalVariable.getProducts[i].stock,
										"costPrice" : GlobalVariable.getProducts[i].costPrice,
										"categoryName":GlobalVariable.getProducts[i].categoryName,
										"totalWithTax":totalWithTax,
										"totalTax":parseFloat(totalWithTax)-parseFloat(totalWithOutTax),
										"categoryId":GlobalVariable.getProducts[i].categoryId,
										"imeiNo":GlobalVariable.getProducts[i].imeiNo,
										"phoneId":GlobalVariable.getProducts[i].phoneId,
										"addTax":GlobalVariable.getProducts[i].addTax
									});
								if(GlobalVariable.getProducts[i].relatedProduct = true)
								{

									var url=GlobalConstants.URLCONSTANTS+"getRelatedProduct?productNo="+GlobalVariable.getProducts[i].productNo;
									dataService.Get(url,onGetRelatedSuccess,onGetRelatedError,'application/json','application/json');
									break;
								}

								break;
							}
						}
					}

				} else if (searchTxt.length > 6) {
					console.log("" + $scope.searchValue);
					$scope.discount = 0;
					for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
						if (searchTxt === GlobalVariable.getProducts[i].productNo) {
							$scope.productFound = true;
							if($scope.customerProductPrice)
							{
								for(var k = 0;k< $scope.customerProductPrice.length;k++)
								{
									if($scope.customerProductPrice[k].productNo == GlobalVariable.getProducts[i].productNo)
									{
										GlobalVariable.getProducts[i].retailPrice = $scope.customerProductPrice[k].retailPrice;
									}
								}
							}
							if(GlobalVariable.getProducts[i].categoryId == 10)
							{
								GlobalVariable.sellProductNo = GlobalVariable.getProducts[i].productNo;
								GlobalVariable.sellProductId =GlobalVariable.getProducts[i].productId;
								GlobalVariable.sellDescription = GlobalVariable.getProducts[i].description;
								GlobalVariable.sellCategoryId = GlobalVariable.getProducts[i].categoryId;
								GlobalVariable.sellAddTax= GlobalVariable.getProducts[i].addTax;
								var _tmPath = 'app/sell/validateIMEI.html';
								var _ctrlPath = 'ValidateIMEIController';
								DialogFactory.show(_tmPath, _ctrlPath, $scope.callBackValidateIMEI);
							}
							else
							{

								if(GlobalVariable.getProducts[i].addTax == true)
								{
									var totalWithOutTax = Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
										.toFixed(2);
									totalWithOutTax = parseFloat(totalWithOutTax);
									var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
								}
								else
								{
									var totalWithOutTax =  Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
										.toFixed(2);
									totalWithOutTax = parseFloat(totalWithOutTax);
									var totalWithTax = totalWithOutTax;
								}

								$rootScope.testData
									.push({
										"itemId":GlobalVariable.getProducts[i].productId,
										"itemNo" : GlobalVariable.getProducts[i].productNo,
										"item" : GlobalVariable.getProducts[i].description,
										"quantity" : GlobalVariable.getProducts[i].quantity,
										"retail" : GlobalVariable.getProducts[i].retailPrice,
										"discount" : (parseFloat($scope.discount))
											.toFixed(2),
										"total" : totalWithOutTax,
										"stock" : GlobalVariable.getProducts[i].stock,
										"costPrice" : GlobalVariable.getProducts[i].costPrice,
										"categoryName":GlobalVariable.getProducts[i].categoryName,
										"totalWithTax":totalWithTax,
										"totalTax":parseFloat(totalWithTax)-parseFloat(totalWithOutTax),
										"categoryId":GlobalVariable.getProducts[i].categoryId,
										"imeiNo":GlobalVariable.getProducts[i].imeiNo,
										"phoneId":GlobalVariable.getProducts[i].phoneId,
										"addTax":GlobalVariable.getProducts[i].addTax
									});
								if(GlobalVariable.getProducts[i].relatedProduct = true)
								{

									var url=GlobalConstants.URLCONSTANTS+"getRelatedProduct?productNo="+GlobalVariable.getProducts[i].productNo;
									dataService.Get(url,onGetRelatedSuccess,onGetRelatedError,'application/json','application/json');
									break;
								}
								break;
							}
							break;

						}
						else
						{
							$scope.productFound = false;
						}
					}
					if($scope.productFound == false)
					{
						var msg= 'Item is not in this system,do you want to add this product?';
						msg=$sce.trustAsHtml(msg);
						modalService.showModal('', {isCancel:true,closeButtonText:'Cancel',actionButtonText:'Add'}, msg, $scope.callBackAddProduct);
					}
					/*else
					 {
					 $scope.productFound = false;
					 }*/
				} else {
					if (searchTxt.indexOf(".") > 0) {
						$scope.quantity = $rootScope.testData[$rootScope.testData.length - 1].quantity;
						if (parseFloat($scope.searchValue) > parseFloat(parseFloat($rootScope.testData[$rootScope.testData.length - 1].retail))) {
							$scope.discount = 0;
							$rootScope.testData[$rootScope.testData.length - 1].retail = $scope.searchValue;

						} else {
							$scope.discount = (parseFloat($scope.searchValue))
								.toFixed(2);
						}
						if ($scope.discount == 0) {
							$scope.total = ((parseFloat($rootScope.testData[$rootScope.testData.length - 1].retail) - $scope.discount) * parseFloat($scope.quantity))
								.toFixed(2);
						}
						else {
							$scope.total = (($scope.discount) * parseFloat($scope.quantity))
								.toFixed(2);
						}
						if(($rootScope.testData[$rootScope.testData.length - 1].total == $rootScope.testData[$rootScope.testData.length - 1].totalWithTax) && ($rootScope.testData[$rootScope.testData.length - 1].addTax == false))
						{
							$scope.tWTax = parseFloat($scope.total);
						}
						else
						{
							$scope.tWTax = parseFloat($scope.total)+((parseFloat($scope.total)*parseFloat($scope.totalDefaultTax))/100);
						}
					} else {
						$scope.quantity = $scope.searchValue;
						if (parseFloat($rootScope.testData[$rootScope.testData.length - 1].discount) == 'NaN') {
							$scope.discount = 0
						} else {
							$scope.discount = parseFloat($rootScope.testData[$rootScope.testData.length - 1].discount);
						}
						if ($scope.discount !== 0) {
							$scope.total = (parseFloat($scope.quantity) * parseFloat($scope.discount))
								.toFixed(2);

						} else {
							$scope.total = ((parseFloat($rootScope.testData[$rootScope.testData.length - 1].retail) - parseFloat($scope.discount)) * parseFloat($scope.quantity))
								.toFixed(2);

						}

						if($rootScope.testData[$rootScope.testData.length - 1].total == $rootScope.testData[$rootScope.testData.length - 1].totalWithTax)
						{
							$scope.tWTax = parseFloat($scope.total);
						}
						else
						{
							$scope.tWTax = parseFloat($scope.total)+((parseFloat($scope.total)*parseFloat($scope.totalDefaultTax))/100);
						}
					}
					$rootScope.testData[$rootScope.testData.length - 1].quantity = $scope.quantity;
					$rootScope.testData[$rootScope.testData.length - 1].discount = $scope.discount;
					$rootScope.testData[$rootScope.testData.length - 1].total = parseFloat($scope.total);
					$rootScope.testData[$rootScope.testData.length - 1].totalWithTax = parseFloat($scope.tWTax);
					$rootScope.testData[$rootScope.testData.length - 1].totalTax = parseFloat($rootScope.testData[$rootScope.testData.length - 1].total)-parseFloat($rootScope.testData[$rootScope.testData.length - 1].totalWithTax);
					/*$rootScope.testData
					 .push({
					 "itemId":$rootScope.testData[$rootScope.testData.length - 1].productId,
					 "itemNo" : $rootScope.testData[$rootScope.testData.length - 1].itemNo,
					 "item" : $rootScope.testData[$rootScope.testData.length - 1].item,
					 "quantity" : $scope.quantity,
					 "retail" : $rootScope.testData[$rootScope.testData.length - 1].retail,
					 "discount" : $scope.discount,
					 "total" : parseFloat($scope.total),
					 "stock" : $rootScope.testData[$rootScope.testData.length - 1].stock,
					 "costPrice" : $rootScope.testData[$rootScope.testData.length - 1].costPrice,
					 "categoryName":$rootScope.testData[$rootScope.testData.length - 1].categoryName,
					 "totalWithTax":parseFloat($scope.tWTax),
					 "totalTax":parseFloat($rootScope.testData[$rootScope.testData.length - 1].total)-parseFloat($rootScope.testData[$rootScope.testData.length - 1].totalWithTax),
					 "categoryId":$rootScope.testData[$rootScope.testData.length - 1].categoryId
					 });*/
					// for(var i=0;i<$rootScope.testData.length-1;i++)
					// {
					/*$scope
					 .removeRowOnSearch($rootScope.testData[$rootScope.testData.length - 2].itemNo);*/
					// }
				}

				$scope.loadCheckOutData();
				$scope.searchValue = '';
			}
			if($rootScope.testData.length !==0)
			{
				GlobalVariable.addProductClicked= true;
			}
			else
			{
				GlobalVariable.addProductClicked= false;
			}
			angular.element("#dataTable").scrollTop(angular.element("#table tr:last").position().top);
		};
		$scope.callBackAddProduct = function(ok)
		{
			if(ok)
			{
				$state.go('product');

			}
			//$scope.productFound = true;
		};

		function onGetRelatedSuccess(response)
		{
			if(response.length !== 0)
			{
				for(var k=0;k<response.length;k++) {
					if(response[i].addTax == true)
					{
						var totalWithOutTax = Number((parseFloat(response[k].retailPrice) - (parseFloat($scope.discount))) * parseFloat(response[k].quantity))
							.toFixed(2);
						totalWithOutTax = parseFloat(totalWithOutTax);
						var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
					}
					else
					{
						var totalWithOutTax = Number((parseFloat(response[k].retailPrice) - (parseFloat($scope.discount))) * parseFloat(response[k].quantity))
							.toFixed(2);
						totalWithOutTax = parseFloat(totalWithOutTax);
						var totalWithTax = totalWithOutTax;
					}

					$rootScope.testData
						.push({
							"itemId": response[k].productId,
							"itemNo": response[k].productNo,
							"item": response[k].description,
							"quantity": response[k].quantity,
							"retail": response[k].retailPrice,
							"discount": (parseFloat($scope.discount))
								.toFixed(2),
							"total": totalWithOutTax,
							"stock": response[k].stock,
							"costPrice": response[k].costPrice,
							"categoryName": response[k].categoryName,
							"totalWithTax": totalWithTax,
							"totalTax": parseFloat(totalWithTax) - parseFloat(totalWithOutTax),
							"catgeoryId":response[k].categoryId,
							"imeiNo":response[k].imeiNo,
							"phoneId":response[k].phoneId,
							"addTax":response[k].addTax

						});
				}
			}
			$scope.loadCheckOutData();

		}
		function onGetRelatedError(response)
		{

		}
		$scope.removeRowOnSearch = function(itemNo) {
			var index = -1;
			var comArr = eval($rootScope.testData);
			for (var i = 0; i < comArr.length; i++) {
				if (itemNo.toString().indexOf(".") >= 0) {
					if (comArr[i].itemNo === itemNo) {
						index = i;
						break;
					}
				} else {
					if (comArr[i].itemNo === itemNo) {
						index = i;
						break;
					}
				}

			}
			if (index === -1) {
				alert("Something gone wrong");
			}
			$rootScope.testData.splice(index, 1);
		};
		$scope.openCashPopup = function() {

			var _tmPath = 'app/sell/paymentPopup.html';
			var _ctrlPath = 'paymentPopupController';
			DialogFactory.show(_tmPath, _ctrlPath, callbackPayment);
		};
		$scope.createCustomer = function() {
			var _tmPath = 'app/AddCustomer/addcustomer.html';
			var _ctrlPath = 'addCustomerController';
			DialogFactory.show(_tmPath, _ctrlPath, callbackCust);
		};
		function callbackCust() {
			$timeout(function() {
				$scope.closeBootstrapAlert();
			}, 9000);
		}
		$scope.closeBootstrapAlert = function() {
			GlobalVariable.successCustAlert = false;
			GlobalVariable.addedCustSuccessfull = false;
			GlobalVariable.editCustSuccess = false;
		};
		function callbackPayment() {
			$rootScope.totalQuantity = 0;
			$rootScope.subTotal = 0;
			$rootScope.productTotal = 0;

			$scope.loadCheckOutData();
		}
		$scope.test = function() {
			console.log("" + $scope.searchValue);
		};
		$scope.loadCheckOutData = function() {
			$rootScope.totalQuantity = 0;
			$rootScope.subTotal = 0;
			$rootScope.totalProductPriceAfterTax = 0;
			GlobalVariable.taxTotal=0;
			for (var i = 0; i < $rootScope.testData.length; i++) {
				$rootScope.totalQuantity = parseFloat($rootScope.totalQuantity)
					+ parseFloat($rootScope.testData[i].quantity);
				$rootScope.subTotal = parseFloat($rootScope.subTotal)
					+ parseFloat($rootScope.testData[i].total);
				if(GlobalVariable.selectTax=='default')
				{
					$rootScope.totalProductPriceAfterTax = parseFloat($rootScope.totalProductPriceAfterTax)+
						parseFloat($rootScope.testData[i].totalWithTax);
					GlobalVariable.taxTotal = parseFloat(GlobalVariable.taxTotal)+parseFloat($rootScope.testData[i].totalTax);
				}
				else
				{
					$rootScope.totalProductPriceAfterTax = parseFloat($rootScope.totalProductPriceAfterTax)+
						parseFloat($rootScope.testData[i].total);
					GlobalVariable.taxTotal = 0;
				}



			}
			$rootScope.totalQuantity = (parseFloat($rootScope.totalQuantity))
				.toFixed(2);
			$rootScope.subTotal = Number(parseFloat($rootScope.subTotal)).toFixed(2);
			GlobalVariable.quantityTotal = $rootScope.totalQuantity;
			GlobalVariable.totalSub = $rootScope.subTotal;
			if ($scope.totalDisc == undefined)
				$scope.totalDisc = 0;

			GlobalVariable.discountTotal = $scope.totalDisc;

			if ($scope.totalDisc == "")
				$rootScope.totalProductPriceAfterTax = Number(
					parseFloat($rootScope.totalProductPriceAfterTax)).toFixed(2);
			else
				$rootScope.totalProductPriceAfterTax = Number(
					parseFloat($rootScope.totalProductPriceAfterTax)
					- parseFloat($scope.totalDisc)).toFixed(2);

			// if ($scope.productTotalWithoutTax == 'NaN') {
			// 	$scope.productTotalWithoutTax = 0;
			// }
			GlobalVariable.selectedTaxDrp = GlobalVariable.selectTax;

			// if ($rootScope.selectTax == undefined)
			// 	$scope.totalTax = 0;
			// else if ($rootScope.selectTax == 'default')
			// 	$scope.totalTax = parseFloat($scope.totalDefaultTax);
			// else if ($rootScope.selectTax == 'noTax')
			// 	$scope.totalTax = 0;

			// GlobalVariable.taxTotal = parseFloat($scope.productTotalWithoutTax)
			// 	* (parseFloat($scope.totalTax) / 100);
			$rootScope.productTotal = Number(parseFloat($rootScope.totalProductPriceAfterTax)).toFixed(2);
			// Number(
			// parseFloat($scope.productTotalWithoutTax)
			// + (((parseFloat($scope.productTotalWithoutTax) * parseFloat($scope.totalTax))) / 100))
			// .toFixed(2);

			if (GlobalVariable.balanceRemaining> 0) {
				$rootScope.productTotal = parseFloat($rootScope.productTotal)
					+ parseFloat(GlobalVariable.balanceRemaining);
			}
			$rootScope.totalPayment = parseFloat(Number(parseFloat($rootScope.productTotal)
				.toFixed(2)));
			GlobalVariable.checkOuttotal = parseFloat(Number(parseFloat($rootScope.totalPayment)
				.toFixed(2)));
			GlobalVariable.onAddProduct = $rootScope.testData;
		}
		$scope.editRow = function($index,row) {
			$scope.editIndex = $index;
			GlobalVariable.editQuanDtls = row;
			var _tmPath = 'app/sell/editQuant.html';
			var _ctrlPath = 'EditQuantityController';
			DialogFactory.show(_tmPath, _ctrlPath, $scope.callBackEditQuan);
		};
		$scope.callBackEditQuan = function() {
			/*var index = -1;
			 var comArr = eval($rootScope.testData);
			 for (var i = 0; i < comArr.length; i++) {
			 if (comArr[i].itemNo === GlobalVariable.editQuanDtls.itemNo) {

			 index = i;
			 break;
			 }
			 }
			 if (index === -1) {
			 alert("Something gone wrong");
			 }*/
			$rootScope.testData.splice($scope.editIndex , 1);


			if(parseFloat(GlobalVariable.editQuanDtls.discount) > parseFloat(GlobalVariable.editQuanDtls.retail))
			{

				GlobalVariable.editQuanDtls.retail =  GlobalVariable.editQuanDtls.discount;
				GlobalVariable.editQuanDtls.discount = 0;
			}

			if (parseFloat(GlobalVariable.editQuanDtls.discount) !== 0) {
				var editSub = (parseFloat(GlobalVariable.editQuanDtls.quantity) * parseFloat(GlobalVariable.editQuanDtls.discount))
					.toFixed(2);

			} else {
				var editSub = (parseFloat(GlobalVariable.editQuanDtls.quantity) * parseFloat(GlobalVariable.editQuanDtls.retail))
					.toFixed(2)
			}
			if((GlobalVariable.editQuanDtls.total == GlobalVariable.editQuanDtls.totalWithTax) && GlobalVariable.editQuanDtls.addTax ==  false)
			{
				var editSubTax = parseFloat(editSub);
			}
			else
			{
				var editSubTax = parseFloat(editSub) + (($scope.totalDefaultTax /100) * parseFloat(editSub));
			}
			$rootScope.testData.splice($scope.editIndex , 0, {
				"itemId":GlobalVariable.editQuanDtls.itemId,
				"itemNo" : GlobalVariable.editQuanDtls.itemNo,
				"item" : GlobalVariable.editQuanDtls.item,
				"quantity" : GlobalVariable.editQuanDtls.quantity,
				"retail" : GlobalVariable.editQuanDtls.retail,
				"discount" : GlobalVariable.editQuanDtls.discount,
				"total" : editSub,
				"stock" : GlobalVariable.editQuanDtls.stock,
				"costPrice" : GlobalVariable.editQuanDtls.costPrice,
				"categoryName" : GlobalVariable.editQuanDtls.categoryName,
				"totalWithTax":editSubTax,
				"totalTax":parseFloat(editSubTax)-parseFloat(editSub),
				"categoryId":GlobalVariable.editQuanDtls.categoryId,
				"imeiNo":GlobalVariable.editQuanDtls.imeiNo,
				"phoneId":GlobalVariable.editQuanDtls.phoneId,
				"addTax":GlobalVariable.editQuanDtls.addTax,
			});
			$scope.loadCheckOutData();
		};
		function getCustomerProductPrice()
		{
			var url = GlobalConstants.URLCONSTANTS+'getProductPriceByCustomer?phoneNo='+GlobalVariable.regPhone1;
			dataService.Get(url,onCustomerProductSuccess,onCustomerErrorSuccess,'application/json','application/json');
		}
		function onCustomerProductSuccess(data)
		{
			$scope.customerProductPrice = data;
		}
		function onCustomerErrorSuccess(data)
		{

		}
		$scope.printInvoice = function()
		{
			modalService.showModal('', {
				isCancel : true
			}, "Are you Sure Want to Print Invoice ? ", $scope.callBackPrintInvoiceAction);


		}
		$scope.callBackPrintInvoiceAction = function(ok)
		{
			if(ok)
			{

				$scope.getLastTransId();
			}
			else
			{
				resetData();
			}
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
		$scope.triggerInvoice = function()
		{
			var trasnactionDate = js_yyyy_mm_dd_hh_mm_ss();
			GlobalVariable.transDate = trasnactionDate;
			if(GlobalVariable.onlineTransactionCompId != '' && GlobalVariable.onlineTransactionCompId !=null
				&& GlobalVariable.onlineTransactionCompId != undefined)
			{
				GlobalVariable.transactionCompletedId=GlobalVariable.onlineTransactionCompId;
			}
			else
			{
				GlobalVariable.transactionCompletedId = parseInt(GlobalVariable.lastTransId) +1;
			}



			var url =GlobalConstants.URLCONSTANTS+"addTransaction";
			var request = new Object();
			request = {
				"transactionDate":trasnactionDate,
				"totalAmount":$scope.productTotal,
				"tax":Math.abs(parseFloat(parseFloat(GlobalVariable.taxTotal).toFixed(2))),
				"discount":parseFloat(parseFloat(GlobalVariable.discountTotal).toFixed(2)) ,
				"customerPhoneNo":$rootScope.customerPhone,
				"userId":sessionStorage.userId,
				"userName":sessionStorage.userName,
				"status":'o',
				"paidAmountCash":0,
				"changeAmount":0,
				"paidAmountDebit":0,
				"paidAmountCheck":0,
				"paidAmountCredit":0,
				"transactionCompId":GlobalVariable.transactionCompletedId,
				"subTotal":parseFloat(parseFloat(GlobalVariable.totalSub).toFixed(2)),
				"totalQuantity":parseInt(GlobalVariable.quantityTotal),
				"transCreditId":'',
				"last4Digits":'',
				"prevBalance":parseFloat(parseFloat(GlobalVariable.custBalance).toFixed(2)),
				"balance":0,
				"receiptNote":'',
				"transactionNote":'',
				"customerName":GlobalVariable.customerNameOnSearch

			};
			request = JSON.stringify(request);
			dataService.Post(url,request,addTransactionSuccess1Handler,addTransactionError1Handler,"application/json","application/json");

		}
		function addTransactionSuccess1Handler(data)
		{
			var request = [];

			for(var i=0;i< $rootScope.testData.length ; i++)
			{
				if(parseFloat($rootScope.testData[i].discount) !== 0)
				{
					var discPer = (((parseFloat($rootScope.testData[i].retail)-parseFloat($rootScope.testData[i].discount))/parseFloat($rootScope.testData[i].retail))*100).toFixed(2);
					var discValue = (parseFloat($rootScope.testData[i].retail)-parseFloat($rootScope.testData[i].discount)).toFixed(2);
					discValue= (parseFloat($rootScope.testData[i].quantity) * discValue).toFixed(2);
				}
				else
				{
					var discPer = 0;
					var discValue =0;
				}
				if(GlobalVariable.selectedTaxDrp == 'default')
				{
					var totalProductPriceWithTax = $rootScope.testData[i].totalWithTax;
				}
				else if(GlobalVariable.selectedTaxDrp == 'noTax')
				{
					var totalProductPriceWithTax = $rootScope.testData[i].total;
				}

				request.push({

					"transactionCompId":GlobalVariable.transactionCompletedId,
					"productNumber":$rootScope.testData[i].itemNo,
					"quantity":parseInt($rootScope.testData[i].quantity),
					"retail":parseFloat(parseFloat($rootScope.testData[i].retail).toFixed(2)),
					"cost":parseFloat(parseFloat($rootScope.testData[i].costPrice).toFixed(2)),
					"discount":parseFloat(parseFloat(discValue).toFixed(2)),
					"retailWithDis":parseFloat(parseFloat($rootScope.testData[i].discount).toFixed(2)),
					"totalProductPrice":parseFloat(parseFloat($rootScope.testData[i].total).toFixed(2)),
					"transactionDate":GlobalVariable.transDate,
					"discountPercentage":discPer,
					"transactionStatus":'o',
					"totalProductPriceWithTax":parseFloat(parseFloat(totalProductPriceWithTax).toFixed(2)),
					"imeiNo":$rootScope.testData[i].imeiNo,
					"phoneId":$rootScope.testData[i].phoneId

				});
			}

			var url =GlobalConstants.URLCONSTANTS+"addTransactionLineItem?phoneNo="+$rootScope.customerPhone;
			request = JSON.stringify(request);
			dataService.Post(url,request,addTransactionLineItemSuccessHandler,addTransactionLineItemErrorHandler,"application/json","application/json");


		}
		function addTransactionLineItemSuccessHandler(data)
		{
			GlobalVariable.onlineTransactionCompId = '';

			getStoreAddress();
		}
		function addTransactionLineItemErrorHandler(data)
		{

		}
		function addTransactionError1Handler(error)
		{

		}
		function getStoreAddress()
		{

			var url=GlobalConstants.URLCONSTANTS+'getPageSetUpDetails';
			dataService.Get(url,onStoreSuccess,onStoreError,'application/json','application/json');
		}
		function onStoreSuccess(response)
		{
			GlobalVariable.storeAddress = response[0].storeAddress;
			GlobalVariable.footerReceipt = response[0].footerReceipt;
			if((response[0].receiptType).toString() == "0")
				GlobalVariable.showRcptType = 'A4';
			else if((response[0].receiptType).toString() == "1")
				GlobalVariable.showRcptType = 'Thermal';


				var url=GlobalConstants.URLCONSTANTS+"getReceiptDetails?receiptId="+GlobalVariable.transactionCompletedId;
				dataService.Get(url,getPrintSuccessHandler,getPrintErrorHandler,"application/json","application/json");

		}
		function onStoreError(error)
		{

		}
		function getPrintSuccessHandler(response)
		{
			GlobalVariable.receiptData =response;
			GlobalVariable.receiptCOmmonData = response;

			$rootScope.printTransFirstName='';
			$rootScope.printTransLastName ='';
			$rootScope.printTransStreet='';
			$rootScope.printTransCity='';
			$rootScope.printTransState='';
			$rootScope.printTransCountry='';
			$rootScope.printTranszipCode='';
			$rootScope.printTransPhone='';
			$rootScope.printTransCompany = '';
			if(response.length !==0)
			{
				if(GlobalVariable.receiptData[0].customerDtosList .length !== 0)
				{
					$rootScope.printTransFirstName=GlobalVariable.receiptData[0].customerDtosList[0].firstName;
					$rootScope.printTransLastName =GlobalVariable.receiptData[0].customerDtosList[0].lastName;
					$rootScope.printTransStreet=GlobalVariable.receiptData[0].customerDtosList[0].street;
					$rootScope.printTransCity=GlobalVariable.receiptData[0].customerDtosList[0].city;
					$rootScope.printTransState=GlobalVariable.receiptData[0].customerDtosList[0].state;
					$rootScope.printTransCountry=GlobalVariable.receiptData[0].customerDtosList[0].country;
					$rootScope.printTranszipCode=GlobalVariable.receiptData[0].customerDtosList[0].zipcode;
					$rootScope.printTransPhone=GlobalVariable.receiptData[0].customerDtosList[0].phoneNo;
					$scope.printTransCompany =GlobalVariable.receiptData[0].customerDtosList[0].companyName;

				}
			}

			GlobalVariable.printInvoice = true;
			GlobalVariable.isPrintPage = true;
			$timeout(function () {
				$window.print();
				GlobalVariable.isPrintPage = false;
				GlobalVariable.printInvoice = false;
				resetData();
			}, 2000);

		}
		function resetData()
		{
			$rootScope.testData = [];
			GlobalVariable.onlineSellProduct = false;


			GlobalVariable.custTypeCd = '';
			$rootScope.totalPayment = '0.00';
			$rootScope.customerName = '';
			$rootScope.regPhone = '';
			$rootScope.customerNameOnSearch = '';
			GlobalVariable.customerFound = false;
			$rootScope.totalQuantity = 0;
			$rootScope.subTotal = 0;
			$rootScope.productTotal = 0;
			$rootScope.customerPhone = '';
			GlobalVariable.addProductClicked = false;
			GlobalVariable.userPhone ='';
			GlobalVariable.userFName = '';
			GlobalVariable.customerNameOnSearch = '';
			GlobalVariable.regPhone1 ='';
			GlobalVariable.balanceRemaining = 0;
			GlobalVariable.transId = '';
			GlobalVariable.last4='';
			GlobalVariable.sellIMEINumber = '';
			GlobalVariable.selectTax = 'default';
		}
		function getPrintErrorHandler(response)
		{

		}
		$scope.getLastTransId = function()
		{
			var url=GlobalConstants.URLCONSTANTS+'getLastTransactionId';
			dataService.Get(url,lastTransSuccess,lastTransError,'application/json','application/json');
		}
		function lastTransSuccess(response)
		{
			sessionStorage.lastTransId = parseInt(response);
			GlobalVariable.lastTransId =  parseInt(response);
			$scope.triggerInvoice();
		}
		function lastTransError(response)
		{

		}
		$scope.searchCustomer = function() {
			// $scope.customerPhone;
			getCustomerProductPrice();
			for (var i = 0; i < GlobalVariable.getCustomerDtls.length; i++) {
				if (GlobalVariable.regPhone1 == GlobalVariable.getCustomerDtls[i].phoneNo) {
					GlobalVariable.customerNameOnSearch = GlobalVariable.getCustomerDtls[i].firstName;
					$rootScope.customerPhone = GlobalVariable.regPhone1;
					GlobalVariable.userPhone = $rootScope.customerPhone;
					GlobalVariable.userFName = GlobalVariable.customerNameOnSearch;
					var url = GlobalConstants.URLCONSTANTS+'getCustomerBalance?phoneNo='
						+ GlobalVariable.regPhone1;
					dataService.Get(url, onBalanceSuccess, onBalanceError,
						'application/json', 'application/json');
					GlobalVariable.customerFound = true;
					GlobalVariable.custTypeCd = GlobalVariable.getCustomerDtls[i].customerType;
					if (GlobalVariable.custTypeCd == 'Business') {
						GlobalVariable.selectTax = 'noTax';
						GlobalVariable.selectedTaxDrp = 'noTax';
					}
					else if (GlobalVariable.custTypeCd == 'Retail') {
						GlobalVariable.selectTax = 'default';
						GlobalVariable.selectedTaxDrp = 'default';
					}

					break;
				} else {
					GlobalVariable.customerNameOnSearch = 'No customer found';
					$rootScope.customerPhone = '';
					GlobalVariable.userPhone ='';
					GlobalVariable.userFName = '';
				}

			}
			//$scope.loadCheckOutData();

		};
		function onBalanceSuccess(response) {
			if (response !== null && response !== ''
				&& parseFloat(response) !== 0) {
				GlobalVariable.balanceRemaining= parseFloat(response);
				// GlobalVariable.remainingBalanceAmount =
				// GlobalVariable.balanceRemaining;
				$rootScope.productTotal = GlobalVariable.balanceRemaining;
				GlobalVariable.custBalance = GlobalVariable.balanceRemaining;
				$rootScope.totalPayment = GlobalVariable.balanceRemaining;
				GlobalVariable.checkOuttotal = $rootScope.totalPayment;
			} else {
				GlobalVariable.balanceRemaining = parseFloat(response);
				GlobalVariable.custBalance = GlobalVariable.balanceRemaining;
			}
			$scope.loadCheckOutData();

		}
		function onBalanceError(response) {

		}

		$scope.searchCustomerByFirst = function() {
			for (var i = 0; i < GlobalVariable.getCustomerDtls.length; i++) {
				if (GlobalVariable.customerNameOnSearch == GlobalVariable.getCustomerDtls[i].firstName) {
					GlobalVariable.customerNameOnSearch = GlobalVariable.getCustomerDtls[i].firstName;
					$rootScope.customerPhone = GlobalVariable.getCustomerDtls[i].phoneNo;
					GlobalVariable.regPhone1 = GlobalVariable.getCustomerDtls[i].phoneNo;
					GlobalVariable.userPhone = $rootScope.customerPhone;
					GlobalVariable.userFName = GlobalVariable.customerNameOnSearch;
					GlobalVariable.customerFound = true;
					var url = GlobalConstants.URLCONSTANTS+'getCustomerBalance?phoneNo='
						+ GlobalVariable.regPhone1;
					dataService.Get(url, onBalanceSuccess, onBalanceError,
						'application/json', 'application/json');
					GlobalVariable.custTypeCd = GlobalVariable.getCustomerDtls[i].customerType;
					if (GlobalVariable.custTypeCd == 'Business') {
						GlobalVariable.selectTax = 'noTax';
						GlobalVariable.selectedTaxDrp = 'noTax';
					}
					else if (GlobalVariable.custTypeCd == 'Retail') {
						GlobalVariable.selectTax = 'default';
						GlobalVariable.selectedTaxDrp = 'default';
					}
					break;
				}
				else
				{
					$rootScope.customerPhone = '';
					GlobalVariable.userPhone ='';
					GlobalVariable.userFName = '';
				}
				/*
				 * else { $rootScope.customerName = 'No customer found';
				 * $rootScope.customerPhone = GlobalVariable.regPhone1; }
				 */

			}
			getCustomerProductPrice();

		}
		function render() {

			if (GlobalVariable.onlineSellProduct == true) {
				for (var i = 0; i < GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList.length; i++) {
					$rootScope.testData
						.push({
							"statusId":'r',
							"itemId":GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].productId,
							"itemNo" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].productNumber,
							"item" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].productDescription,
							"quantity" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].quantity,
							"retail" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].retail,
							"discount" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].discount,
							"retWithDisc" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].retailWithDis,
							"total" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].totalProductPrice,
							"stock" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].quantity,
							"costPrice" : GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].cost,
							"totalWithOutTax":GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].totalProductPrice,
							"totalWithTax":GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].totalProductPriceWithTax,
							"totalTax":parseFloat(GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].totalProductPriceWithTax)-parseFloat(GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].totalProductPrice),
							"categoryId":GlobalVariable.getProducts[i].categoryId,
							"imeiNo":GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].imeiNo,
							"phoneId":GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].phoneId,
							"discountPercentage":GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].discountPercentage,
							"addTax":GlobalVariable.getReturnSellDetails[0].transactionLineItemDtoList[i].addTax,
							"categoryName":""
						});

				}

				$scope.loadCheckOutData();
			}


			$scope.currentPageIndexArr = 0;
			GlobalVariable.customerNameOnSearch= '';

			if(GlobalVariable.userPhone !== '' && GlobalVariable.userFName !== '' && GlobalVariable.userPhone != undefined &&
				GlobalVariable.userFName != undefined)
			{
				if (GlobalVariable.custTypeCd == 'Business') {
					GlobalVariable.selectTax = 'noTax';
					GlobalVariable.selectedTaxDrp = 'noTax';
				}
				else if (GlobalVariable.custTypeCd == 'Retail') {
					GlobalVariable.selectTax = 'default';
					GlobalVariable.selectedTaxDrp = 'default';
				}
				GlobalVariable.customerFound = true;
				GlobalVariable.customerNameOnSearch = GlobalVariable.userFName;
				GlobalVariable.regPhone1 = GlobalVariable.userPhone;
				var url = GlobalConstants.URLCONSTANTS+'getCustomerBalance?phoneNo='
					+ GlobalVariable.regPhone1;
				dataService.Get(url, onBalanceSuccess, onBalanceError,
					'application/json', 'application/json');
				//$scope.prevBalance = GlobalVariable.balanceRemaining;
			}
			else
			{
				GlobalVariable.customerFound = false;
			}
			if(GlobalVariable.addProductClicked)
			{
				$rootScope.testData = GlobalVariable.onAddProduct;
			}
			getTaxDetails();

			if(GlobalVariable.getProducts ==  undefined || GlobalVariable.getProducts == null)
			{

				getProductDetails.getProductDetail($scope.getPrdDtls);
				getProductDetails.getCustomerDetails($scope.getCustDtls);
			}
			else
			{
				for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
					$scope.productNames
						.push(GlobalVariable.getProducts[i].description);
				}
				$scope.firstNames = [];
				for (var i = 0; i < GlobalVariable.getCustomerDtls.length; i++) {
					$scope.firstNames
						.push(GlobalVariable.getCustomerDtls[i].firstName);
				}
			}


		}
		$scope.getCustDtls = function(response)
		{
			$scope.firstNames = [];
			for (var i = 0; i < GlobalVariable.getCustomerDtls.length; i++) {
				$scope.firstNames
					.push(GlobalVariable.getCustomerDtls[i].firstName);
			}
		};
		$scope.getPrdDtls = function(response)
		{
			for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
				$scope.productNames
					.push(GlobalVariable.getProducts[i].description);
			}
		};
		$scope.$watch('GlobalVariable.getCustomerDtls',function(newValue)
		{
			$scope.firstNames = [];
			for (var i = 0; i < GlobalVariable.getCustomerDtls.length; i++) {
				$scope.firstNames
					.push(GlobalVariable.getCustomerDtls[i].firstName);
			}
		});
		function getTaxDetails() {
			var url = GlobalConstants.URLCONSTANTS+'getPageSetUpDetails';
			dataService.Get(url, onGetTaxSuccess, onGetTaxError,
				'application/json', 'application/json');
		}
		function onGetTaxSuccess(response) {
			$scope.totalDefaultTax = response[0].tax;

			GlobalVariable.selectTax = "default";
			$scope.loadCheckOutData();
		}
		$scope.clearValue = function(value)
		{
			if(value == '' || value == undefined)
			{
				GlobalVariable.regPhone1 = '';
				GlobalVariable.customerNameOnSearch = '';
				$rootScope.customerPhone = '';
				GlobalVariable.customerFound=false;
				GlobalVariable.selectTax = "default";
				GlobalVariable.selectedTaxDrp = "default";
				GlobalVariable.userPhone = '' ;
				GlobalVariable.userFName = '';
				GlobalVariable.balanceRemaining = 0;
				$rootScope.productTotal =0;
				//if($rootScope.testData.length == 0)
				//{
				$scope.totalDisc = 0;
				$rootScope.totalPayment = 0;
				//}
				$scope.loadCheckOutData();
			}
		};
		$scope.clearValuePhone = function()
		{
			console.log("GlobalVariable.regPhone1= "+GlobalVariable.regPhone1);
			if(GlobalVariable.regPhone1 == '')
			{
				GlobalVariable.customerNameOnSearch = '';
				$rootScope.customerPhone = '';
				GlobalVariable.customerFound=false;
				GlobalVariable.selectTax = "default";
				GlobalVariable.selectedTaxDrp = "default";
				GlobalVariable.userPhone = '' ;
				GlobalVariable.userFName = '';
				GlobalVariable.balanceRemaining = 0;
				$rootScope.productTotal =0;
				//if($rootScope.testData.length == 0)
				//{
				$scope.totalDisc = 0;
				$rootScope.totalPayment = 0;
				//}
				$scope.loadCheckOutData();

			}
		}
		function onGetTaxError(response) {

		}

		render();
	}

})();
