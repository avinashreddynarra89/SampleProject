(function() {
	'use strict';

	angular.module('sampleApp').controller('paymentPopupController', paymentPopupController);

	paymentPopupController.$inject = [ '$timeout','$scope', '$sce','$window','$rootScope', 'device.utility','GlobalVariable','DialogFactory','modalService','dataService','$state','RestrictedCharacter.Types','getProductDetails','GlobalConstants'];

	function paymentPopupController($timeout,$scope,$sce,$window ,$rootScope, device ,GlobalVariable,DialogFactory,modalService,dataService,$state,restrictCharacter,getProductDetails,GlobalConstants)
	{
		$scope.color= false;
		$scope.paidAmountCash =0;
		$scope.paidAmountCredit =0;
		$scope.paidAmountDebit =0;
		$scope.paidAmountCheck =0;
		$scope.restrictCharacter=restrictCharacter;

		$scope.GlobalVariable = GlobalVariable;
		$rootScope.modifiedTransData = [];
		
		$scope.closePopup = function()
		{
			DialogFactory.close(true);
		};
		/*$scope.addAmount = function(amount)
		{
			$scope.paidAmountCash =parseFloat($scope.paidAmountCash)+parseFloat(amount);
			$scope.cashId = 1;
			$scope.balanceAmount =parseFloat((parseFloat($scope.balanceAmount)-parseFloat(amount)).toFixed(2));
			if($scope.balanecAmount <= 0 && $scope.paidAmountCredit ==0)
			{
				$scope.paidAmountCash = GlobalVariable.checkOuttotal;
				$rootScope.amountBalance =$scope.balanceAmount;
				DialogFactory.close(true);
				var _tmPath = 'app/sell/printReceiptModal.html';
				var _ctrlPath = 'PrintRecepitController';
				DialogFactory.show(_tmPath, _ctrlPath, $scope.getLastTransId);
				$scope.color = true;
			}	
		};*/
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
		$scope.getLastTransId = function()
		{
			var url=GlobalConstants.URLCONSTANTS+'getLastTransactionId';
			dataService.Get(url,lastTransSuccess,lastTransError,'application/json','application/json');
		}
		function lastTransSuccess(response)
		{
			sessionStorage.lastTransId = parseInt(response);
			GlobalVariable.lastTransId =  parseInt(response);
			$scope.callBackCheckout();
		}
		function lastTransError(response)
		{

		}

		$rootScope.callBackCheckout = function()
		{

			var trasnactionDate = js_yyyy_mm_dd_hh_mm_ss();
			GlobalVariable.transDate = trasnactionDate;
			GlobalVariable.transactionCompletedId = parseInt(GlobalVariable.lastTransId) +1;
			DialogFactory.close(true);
			if($scope.balanceAmount == 0)
			{
				$scope.amountPaid = parseFloat($scope.checkPayment);
				$scope.changeAmount = 0;
			}
			else if($scope.balanceAmount < 0)
			{
				$scope.amountPaid = parseFloat($scope.checkPayment)-parseFloat($scope.balanceAmount);
				$scope.changeAmount = -(parseFloat($scope.balanceAmount));
			}
			else if($scope.balanceAmount > 0)
			{
				$scope.amountPaid = parseFloat($scope.checkPayment)-parseFloat($scope.balanceAmount);
				$scope.changeAmount = $scope.balanceAmount;
			}	
			
			if($scope.cashId == undefined)
				$scope.cashId = '';
			if($scope.paidAmountCash == undefined)
				$scope.paidAmountCash = '';
			if($scope.creditIdMulty == undefined)
				$scope.creditIdMulty = '';
			if($scope.paidAmountCredit == undefined)
				$scope.paidAmountCredit = '';
			if($scope.paidAmountDebit == undefined)
				$scope.paidAmountDebit = '';
			if($scope.paidAmountCheck == undefined)
				$scope.paidAmountCheck = '';
			if(GlobalVariable.customerFound == true)
			{
				/*if($scope.balanceAmount > 0)
					GlobalVariable.custBalance = $scope.balanceAmount;
				else
					GlobalVariable.custBalance = 0;*/
				GlobalVariable.custBalance = GlobalVariable.balanceRemaining;
			}
			else
			{
				GlobalVariable.custBalance = 0;
			}

            if(parseFloat($scope.balanceAmount) == parseFloat($scope.checkPayment))
            {
                var paidAmtCash = 0;
                var paidAmtCredit =0;
				var paidAmtDebit = 0;
				var paidAmtCheck = 0;

            }
            else
            {
                var paidAmtCash = parseFloat(parseFloat($scope.paidAmountCash).toFixed(2));
                var paidAmtCredit =parseFloat(parseFloat($scope.paidAmountCredit).toFixed(2));
				var paidAmtDebit = parseFloat(parseFloat($scope.paidAmountDebit).toFixed(2));
				var paidAmtCheck = parseFloat(parseFloat($scope.paidAmountCheck).toFixed(2));

            }

            if(parseFloat($scope.balanceAmount) < 0)
			{
				var chnAmount =Math.abs(parseFloat(parseFloat($scope.balanceAmount).toFixed(2)));
			}
			else
			{
				var chnAmount =0;
			}
            if(Math.abs(parseFloat($scope.balanceAmount)) == parseFloat($scope.balanceAmount))
            {
                $scope.balanceAmount = parseFloat(parseFloat($scope.balanceAmount).toFixed(2));
            }
            else
            {
                $scope.balanceAmount = 0;
            }
			if(GlobalVariable.custTypeCd == 'Business' && GlobalVariable.wholeSaleFlag == 1)
			{
				var transStat = "w";
			}
			else
			{
				var transStat = "c";
			}
			var url =GlobalConstants.URLCONSTANTS+"addTransaction";
			var request = new Object();
			request = {
				"transactionDate":trasnactionDate,  
				"totalAmount":parseFloat(parseFloat(GlobalVariable.checkOuttotal).toFixed(2)),
				"tax":Math.abs(parseFloat(parseFloat(GlobalVariable.taxTotal).toFixed(2))),
				"discount":parseFloat(parseFloat(GlobalVariable.discountTotal).toFixed(2)) ,
				"customerPhoneNo":$rootScope.customerPhone,
				"userId":sessionStorage.userId,
				"userName":sessionStorage.userName,
				"status":transStat,
			"paidAmountCash":paidAmtCash,
			"changeAmount":chnAmount,
			"paidAmountDebit":paidAmtDebit,
				"paidAmountCheck":paidAmtCheck,
				"paidAmountCredit":paidAmtCredit,
			"transactionCompId":GlobalVariable.transactionCompletedId,
			"subTotal":parseFloat(parseFloat(GlobalVariable.totalSub).toFixed(2)),
			"totalQuantity":parseInt(GlobalVariable.quantityTotal),
			"transCreditId":GlobalVariable.transId,
			"last4Digits":GlobalVariable.last4,
				"prevBalance":parseFloat(parseFloat(GlobalVariable.custBalance).toFixed(2)),
                "balance":$scope.balanceAmount,
				"receiptNote":GlobalVariable.receiptNotes,
				"transactionNote":GlobalVariable.transNotes,
				"customerName":GlobalVariable.customerNameOnSearch

			};
			request = JSON.stringify(request);
			dataService.Post(url,request,addTransactionSuccessHandler,addTransactionErrorHandler,"application/json","application/json");
			
		};
		function addTransactionSuccessHandler(response)
		{	
			var request = [];
			if(GlobalVariable.custTypeCd == 'Business' && GlobalVariable.wholeSaleFlag == 1)
			{
				var transStat = "w";
			}
			else
			{
				var transStat = "c";
			}
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
				/*if((GlobalVariable.sellIMEINumber !== undefined || GlobalVariable.sellIMEINumber !== '') && (($rootScope.testData[i].categoryName !== 'Phone')&&(parseInt($rootScope.testData[i].categoryId) !== 10)))
				{
					var imeiNo = '';
				}
				else
				{
					var imeiNo = GlobalVariable.sellIMEINumber;
				}*/
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
					"transactionStatus":transStat,
					"totalProductPriceWithTax":parseFloat(parseFloat(totalProductPriceWithTax).toFixed(2)),
					"imeiNo":$rootScope.testData[i].imeiNo,
					"phoneId":$rootScope.testData[i].phoneId
					 
			});
			}

			var url =GlobalConstants.URLCONSTANTS+"addTransactionLineItem?phoneNo="+$rootScope.customerPhone;
			request = JSON.stringify(request);
			dataService.Post(url,request,addTransactionLineItemSuccessHandler,addTransactionLineItemErrorHandler,"application/json","application/json");
			
			
		};
		function addTransactionErrorHandler(response)
		{

		}
		function addTransactionLineItemSuccessHandler(response)
		{
			$rootScope.testData = [];
			GlobalVariable.onlineSellProduct = false;

			/*var msg= 'Print Receipt or Cancel';
			msg=$sce.trustAsHtml(msg);
			modalService.showModal('', {isCancel:true,closeButtonText:'Cancel',actionButtonText:'Print'}, msg, $scope.callBackCheckoutComplete);
			*/
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
			getProductDetails.getProductDetail();
			if(GlobalVariable.printReceiptTrans == true)
			{
				GlobalVariable.printInvoice = false;
				getStoreAddress();



			}




		};
		function getStoreAddress()
		{
			GlobalVariable.commonTransId =GlobalVariable.transactionCompletedId;
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

			if(GlobalVariable.showRcptType == 'Thermal')
			{
				$window.open(GlobalConstants.URLCONSTANTS+'getReceiptDetailsForThermalPrint?receiptId='+GlobalVariable.transactionCompletedId
					,'_blank');
			}
			else
			{
				var url=GlobalConstants.URLCONSTANTS+"getReceiptDetails?receiptId="+GlobalVariable.transactionCompletedId;
				dataService.Get(url,getPrintSuccessHandler,getPrintErrorHandler,"application/json","application/json");
			}
		}
		function onStoreError(error)
		{

		}
		function getPrintSuccessHandler(response)
		{
			GlobalVariable.receiptData =response;
			GlobalVariable.receiptCOmmonData = response;

			if(response.length!== 0) {
				$rootScope.itemTotal = Number(parseFloat(GlobalVariable.receiptData[0].transactionDtoList[0].subTotal) + parseFloat(GlobalVariable.receiptData[0].transactionDtoList[0].lineItemDiscount)).toFixed(2);

				$rootScope.itemTotal = Number($rootScope.itemTotal).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].prevBalance = Number(GlobalVariable.receiptData[0].transactionDtoList[0].prevBalance).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].tax=Number(GlobalVariable.receiptData[0].transactionDtoList[0].tax).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].totalAmount=Number(GlobalVariable.receiptData[0].transactionDtoList[0].totalAmount).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCash = Number(GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCash).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCredit = Number(GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCredit).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountDebit = Number(GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountDebit).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCheck = Number(GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCheck).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].changeAmount = Number(GlobalVariable.receiptData[0].transactionDtoList[0].changeAmount).toFixed(2);
				GlobalVariable.receiptData[0].transactionDtoList[0].balance = Number(GlobalVariable.receiptData[0].transactionDtoList[0].balance).toFixed(2);


				for (var i = 0; i < GlobalVariable.receiptData[0].transactionLineItemDtoList.length; i++) {
					$rootScope.modifiedTransData.push(
						{
							"productNumber": GlobalVariable.receiptData[0].transactionLineItemDtoList[i].productNumber,
							"productDescription": GlobalVariable.receiptData[0].transactionLineItemDtoList[i].productDescription,
							"retail": GlobalVariable.receiptData[0].transactionLineItemDtoList[i].retail,
							"discountPercentage": GlobalVariable.receiptData[0].transactionLineItemDtoList[i].discountPercentage,
							"retwdisc": (parseFloat(GlobalVariable.receiptData[0].transactionLineItemDtoList[i].totalProductPrice) / parseFloat(GlobalVariable.receiptData[0].transactionLineItemDtoList[i].quantity)).toFixed(2),
							"quantity": GlobalVariable.receiptData[0].transactionLineItemDtoList[i].quantity,
							"totalProductPrice": GlobalVariable.receiptData[0].transactionLineItemDtoList[i].totalProductPrice,
							"imeiNo":GlobalVariable.receiptData[0].transactionLineItemDtoList[i].imeiNo
						}
					);
				}
			}

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

		//if(GlobalVariable.showRcptType == 'A4') {
			GlobalVariable.isPrintPage = true;
			$timeout(function () {
				$window.print();
				GlobalVariable.isPrintPage = false;
			}, 2000);
		//}
		/*else if(GlobalVariable.showRcptType == 'Thermal')
		{
			GlobalVariable.isPrintPage = false;
			$window.open(GlobalConstants.URLCONSTANTS+'getReceiptDetailsForThermalPrint?receiptId=10'
		,'_blank');
		}*/

		}
		function getPrintErrorHandler(response)
		{

		}
		/*$scope.callBackCheckoutComplete = function()
		{
			DialogFactory.close(true);
			$window.print();
		};*/
		function addTransactionLineItemErrorHandler(response)
		{
			
		}
		$scope.payOutMax = function(value)
		{
			
			if(value == 'cash')
			{
				$scope.cashId =1;
				$scope.paidAmountCash = parseFloat($scope.paidAmountCash) + parseFloat($scope.balanceAmount);
			}
			else if(value == 'debit')
			{
				$scope.debitId =1;
				$scope.paidAmountDebit = parseFloat($scope.paidAmountDebit) + parseFloat($scope.balanceAmount);
			}
			else if(value == 'check')
			{
				$scope.checkId =1;
				$scope.paidAmountCheck= parseFloat($scope.paidAmountCheck) + parseFloat($scope.balanceAmount);
			}
			else
			{
				$scope.creditIdMulty = 2;
				$scope.paidAmountCredit = parseFloat($scope.paidAmountCredit) + parseFloat($scope.balanceAmount);
			}
			
				$scope.balanceAmount =0;
			$rootScope.amountBalance =0;
				
				$scope.checkPayout = GlobalVariable.checkOuttotal;
				$scope.creditcardPayout = GlobalVariable.checkOuttotal;
				$scope.debitcardPayout = GlobalVariable.checkOuttotal;
				$scope.cashPayout = GlobalVariable.checkOuttotal;

				DialogFactory.close(true);
				if(value == 'credit')
				{
					/*var msg='<div class="row padding-top-15">'+
					'<div class="col-md-6">'+
                '<label for="transId" class="padding-bottom-5 font-weight-label">Trans ID</label>'+
                '<input type="text" class="form-control" name="transId" id="transId" data-ng-model="transId"'+
                'autocomplete="off"  style="width:100%;height:50px;" />'+
		'</div>'+
		'<div class="col-md-6">'+
                '<label for="last4" class="padding-bottom-5 font-weight-label">Last 4 Digits</label>'+
                '<input type="text" class="form-control" name="last4" id="last4" data-ng-model="last4"'+
                'autocomplete="off"  style="width:100%;height:50px;" />'+
		'</div>'+
	'</div>'; 
				msg=$sce.trustAsHtml(msg);	
				modalService.showModal('', '', msg, $scope.callBackCheckoutCredit);*/
				var _tmPath = 'app/sell/addlastfour.html';
				var _ctrlPath = 'addLastFourController';
				DialogFactory.show(_tmPath, _ctrlPath, $scope.callBackCheckoutCredit);
				}	
				else
				{
					/*var msg= 'Your total balance <span style="color:red;font-size:30px;">is</span> '+Number(parseFloat($scope.balanceAmount)).toFixed(2);
					msg=$sce.trustAsHtml(msg);	
					modalService.showModal('', '', msg, $scope.callBackCheckout);*/
					var _tmPath = 'app/sell/printReceiptModal.html';
					var _ctrlPath = 'PrintRecepitController';
					DialogFactory.show(_tmPath, _ctrlPath, $scope.getLastTransId);
						$scope.color = true;
				}	
				
			/*var msg= 'Your total balance <span style="color:red;font-size:30px;">is1</span> '+Number(parseFloat($scope.balanceAmount)).toFixed(2);
			msg=$sce.trustAsHtml(msg);	
			modalService.showModal('', '', msg, $scope.callBackCheckout);
				$scope.color = true;*/
				

		};
		
		$scope.callBackCheckoutCredit = function()
		{
			console.log($rootScope.last4+""+$rootScope.transId);
			/*var msg= 'Your total balance is '+Number(parseFloat($scope.balanceAmount)).toFixed(2);
			msg=$sce.trustAsHtml(msg);	
			modalService.showModal('', '', msg, $scope.callBackCheckout);*/
			var _tmPath = 'app/sell/printReceiptModal.html';
			var _ctrlPath = 'PrintRecepitController';
			DialogFactory.show(_tmPath, _ctrlPath, $scope.getLastTransId);
				$scope.color = true;
		};
		$scope.makePartialPayment = function()
		{
		    GlobalVariable.partialPaymentClicked=true;
			$rootScope.amountBalance = $scope.balanceAmount;
			DialogFactory.close(true);
			var _tmPath = 'app/sell/printReceiptModal.html';
			var _ctrlPath = 'PrintRecepitController';
			DialogFactory.show(_tmPath, _ctrlPath, $scope.getLastTransId);
		};
		$scope.calculateAmount = function(value,means)
		{
			if(value == "" || value == undefined) {
				value = 0;
				$scope.balanceAmount = GlobalVariable.checkOuttotal;
			}

			if(means == 'debit')
			{
				$scope.debitId = 3;
				if(parseFloat($scope.balanceAmount) > parseFloat(value) )
				{
					$scope.paidAmountDebit = parseFloat($scope.paidAmountDebit) + parseFloat(value);
				}
				else
				{
					$scope.paidAmountDebit =  parseFloat($scope.paidAmountDebit) +  $scope.balanceAmount  ;
				}
				$scope.balanceAmount =parseFloat(parseFloat(parseFloat($scope.balanceAmount)-parseFloat(value)).toFixed(2));
				if($scope.balanceAmount <= 0 && $scope.paidAmountCash == 0) {

					$scope.paidAmountDebit = GlobalVariable.checkOuttotal;
				}
			}
			else if(means == 'check')
			{
				$scope.checkId = 4;
				if(parseFloat($scope.balanceAmount) > parseFloat(value) )
				{
					$scope.paidAmountCheck = parseFloat($scope.paidAmountCheck) + parseFloat(value);
				}
				else
				{
					$scope.paidAmountCheck=  parseFloat($scope.paidAmountCheck) +  $scope.balanceAmount  ;
				}
				$scope.balanceAmount =parseFloat(parseFloat(parseFloat($scope.balanceAmount)-parseFloat(value)).toFixed(2));
				if($scope.balanceAmount <= 0 && $scope.paidAmountCheck == 0) {

					$scope.paidAmountCheck = GlobalVariable.checkOuttotal;
				}
			}
			else if(means == 'cash')
			{
				$scope.cashId =1;
				if(parseFloat($scope.balanceAmount) > parseFloat(value))
				{
					$scope.paidAmountCash = parseFloat($scope.paidAmountCash) + parseFloat(value);
				}
				else
				{
					$scope.paidAmountCash =  parseFloat($scope.paidAmountCash) +  $scope.balanceAmount  ;
				}
				$scope.balanceAmount =parseFloat(parseFloat(parseFloat($scope.balanceAmount)-parseFloat(value)).toFixed(2));
				if($scope.balanceAmount <= 0 && $scope.paidAmountCredit == 0) {

					$scope.paidAmountCash = GlobalVariable.checkOuttotal;
				}

			}
			else
			{
				$scope.creditIdMulty = 2;
				if(parseFloat($scope.balanceAmount) > parseFloat(value) )
				{
					$scope.paidAmountCredit = parseFloat($scope.paidAmountCredit) + parseFloat(value);
				}
				else
				{
					$scope.paidAmountCredit =  parseFloat($scope.paidAmountCredit) +  $scope.balanceAmount  ;
				}
				$scope.balanceAmount =parseFloat(parseFloat(parseFloat($scope.balanceAmount)-parseFloat(value)).toFixed(2));
				if($scope.balanceAmount <= 0 && $scope.paidAmountCash == 0) {

					$scope.paidAmountCredit = GlobalVariable.checkOuttotal;
				}
			}
			
			//$scope.remainingBalance = parseFloat(GlobalVariable.checkOuttotal)-parseFloat(value);

			if($scope.balanceAmount <= 0)
			{
				$rootScope.amountBalance =$scope.balanceAmount;
				DialogFactory.close(true);
				var _tmPath = 'app/sell/printReceiptModal.html';
				var _ctrlPath = 'PrintRecepitController';
				DialogFactory.show(_tmPath, _ctrlPath,$scope.getLastTransId);
				$scope.color = true;
			}
		};
		function render()
		{
			$scope.checkPayment = GlobalVariable.checkOuttotal;
			$scope.balanceAmount = GlobalVariable.checkOuttotal;
		}
		render();
	}
		
})();