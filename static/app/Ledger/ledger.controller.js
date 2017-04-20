(function() {
	'use strict';

	angular.module('sampleApp').controller('LedgerController', LedgerController);

	LedgerController.$inject = [ '$scope','modalService', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','dataService','$window','$filter','$timeout','RestrictedCharacter.Types','$state','GlobalConstants'];

	function LedgerController($scope,modalService, $rootScope, device ,GlobalVariable,DialogFactory,dataService,$window,$filter,$timeout,restrictCharacter,$state,GlobalConstants)
	{
		$scope.restrictCharacter=restrictCharacter;
		$scope.maxDate = new Date();
		$scope.Math = window.Math;
		$scope.modifiedData = [];
		$scope.barLimit = 100;
		$scope.GlobalVariable = GlobalVariable;
		//$scope.test = GlobalVariable.customReceiptFalg;
		if(GlobalVariable.customReceiptFalg === 1)
		$scope.test = true;
		else
			$scope.test = false;
		console.log("$scope.testtrue= "+$scope.testtrue);
		$scope.increaseLimit = function () {
			$scope.barLimit += 50;
			console.log('Increase Bar Limit', $scope.barLimit)
		};
		$scope.closePopup = function()
		{ 
			DialogFactory.close(true);
		};
		$scope.maxDate = new Date();
		$scope.minDate = moment().subtract(1, "days").toDate();
		$scope.openStartCalendar = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.openStart = true;
		};
		$scope.openStartCalendarDaily = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.openStartDaily = true;
		};
		$scope.openEndCalendar = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.openEnd = true;
		};
		$scope.onDateSelected = function(startDate, endDate, label, element) {
			var receiptIndex = element.attr('data-receipt-index');
			element.find('span').eq(0).html(endDate.format('yyyy-MM-dd'));
		};
		$scope.loadslshisType=function(saleDate)
		{
			var url;
			var start,end;

			if(saleDate=='todaySales')
			{
				start = getCurrentDay()+''+' 00:00:00';
				end = getCurrentDay()+''+' 23:59:59';
			}
			else if(saleDate == 'yestSales')
			{
				start = getPreviousDay()+''+' 00:00:00';
				end = getPreviousDay()+''+' 23:59:59';
			}
			else if(saleDate == 'lastWeekSales')
			{
				start = getLast7Day()+' 00:00:00';
				end = getCurrentDay()+' 23:59:59';
			}
			else if(saleDate == 'thisMonthSales')
			{
				start = getcurrentYear()+"-"+getcurrentMonth()+"-01 00:00:00";
				end = getcurrentYear()+"-"+getcurrentMonth()+"-31 23:59:59";
			}
			else if(saleDate == 'lastMonthSales')
			{
				start = getlastMonth()+" 00:00:00";
				end = getCurrentDay()+" 23:59:59";
			}
			else if(saleDate == 'last3MonthsSales')
			{
				start = getlast3Months()+" 00:00:00";
				end = getCurrentDay()+" 23:59:59";
			}
			else if(saleDate == 'last6MonthsSales')
			{
				start = getlast6Months()+" 00:00:00";
				end = getCurrentDay()+" 23:59:59";
			}
			else if(saleDate == 'thisYearSales')
			{
				var years = getCurrentandPreviousYear().split("-");
				start =years[0]+"-01-01 00:00:00";
				end =years[0]+"-12-31 23:59:59";
			}
			else if(saleDate == 'lastYearSales')
			{
				var years = getCurrentandPreviousYear().split("-");
				start =years[1]+"-01-01 00:00:00";
				end =years[1]+"-12-31 23:59:59";
			}
			else
			{
				start = $filter('date')($scope.startTransDate, "yyyy-MM-dd")+" 00:00:00";
				end = $filter('date')($scope.endTransDate, "yyyy-MM-dd")+" 23:59:59";
			}
			loadSalesHistoryData(start,end);
		};
		$scope.applySalesHisByTypeClck = function(type)
		{

			$scope.loadslshisType(type);
		};
		function loadSalesHistoryData(startDate,endDate)
		{
			var url =GlobalConstants.URLCONSTANTS+'getSalesHistory?startDate='+startDate+'&endDate='+endDate;
			dataService.Get(url,getSalesHistorySuccessHandler,getSalesHistroyErrorHandler,"application/json","application/json");
			
			
		}
		$scope.sendMail = function(id)
		{
			$scope.emailId = id;
			modalService.showModal('', {
				isCancel : true
			}, "Are you Sure Want to Send Email ? ", $scope.callBackEmail);


		}
		$scope.callBackEmail = function(ok)
		{
			if(ok)
			{
				var url =GlobalConstants.URLCONSTANTS+'sendEmail?receiptId='+$scope.emailId;
				dataService.Get(url,getEmailSuccess,getEmailError,"application/json","application/json");
			}
		}
		function getEmailSuccess(data)
		{
			if(data == true)
			{

			}
		}
		function getEmailError(data)
		{

		}
		$scope.onDateSelected = function(startDate, endDate, label, element) {
			var receiptIndex = element.attr('data-receipt-index');
			element.find('span').eq(0).html(endDate.format('yyyy-MM-dd'));
		};
		$scope.filterSalesHistory =  function(value)
		{
			console.log(value);
			$scope.filterHistory = value;
		};
		$scope.checkfilterValue = function(value)
		{
			if(($scope.custName == undefined && $scope.receiptNumber == undefined) || ($scope.custName == "" && $scope.receiptNumber == "")
					||($scope.custName == undefined && $scope.receiptNumber == "")||($scope.custName == "" && $scope.receiptNumber == undefined))
			{
				$scope.filterHistory= '';
			}
			else
				$scope.filterHistory = value;
		};
		
		function getSalesHistorySuccessHandler(response)
		{
			$scope.salesHistory = response;
			GlobalVariable.histroyData = $scope.salesHistory;
		}
		function getSalesHistroyErrorHandler(response)
		{
			
		}
		$scope.print = function(id)
		{
			$scope.printLedgId = id;
			GlobalVariable.commonTransId = $scope.printLedgId;
			getStoreAddress();

			
			
		};
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

			if(GlobalVariable.showRcptType == 'Thermal')
			{
				$window.open(GlobalConstants.URLCONSTANTS+'getReceiptDetailsForThermalPrint?receiptId='+$scope.printLedgId
					,'_blank');
			}
			else {
				var url = GlobalConstants.URLCONSTANTS + "getReceiptDetails?receiptId=" + $scope.printLedgId;
				dataService.Get(url, getPrintSuccessHandler, getPrintErrorHandler, "application/json", "application/json");
			}
		}
		function onStoreError(error)
		{

		}
		function getPrintSuccessHandler(response)
		{
			GlobalVariable.receiptCOmmonData = response;
			GlobalVariable.receiptData =response;
			$scope.itemTotal =Number(parseFloat(GlobalVariable.receiptData[0].transactionDtoList[0].subTotal)+parseFloat(GlobalVariable.receiptData[0].transactionDtoList[0].lineItemDiscount)).toFixed(2);
			$scope.itemTotal = Number($scope.itemTotal).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].prevBalance = Number(GlobalVariable.receiptData[0].transactionDtoList[0].prevBalance).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].tax=Number(GlobalVariable.receiptData[0].transactionDtoList[0].tax).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].totalAmount=Number(GlobalVariable.receiptData[0].transactionDtoList[0].totalAmount).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCash = Number(GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCash).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCredit = Number(GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCredit).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountDebit = Number(GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountDebit).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCheck = Number(GlobalVariable.receiptData[0].transactionDtoList[0].paidAmountCheck).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].changeAmount = Number(GlobalVariable.receiptData[0].transactionDtoList[0].changeAmount).toFixed(2);
			GlobalVariable.receiptData[0].transactionDtoList[0].balance = Number(GlobalVariable.receiptData[0].transactionDtoList[0].balance).toFixed(2);

			$scope.modifiedData=[];
			$scope.printFirstName='';
			$scope.printLastName ='';
			$scope.printStreet='';
			$scope.printCity='';
			$scope.printState='';
			$scope.printCountry='';
			$scope.printzipCode='';
			$scope.printPhone='';
			$scope.printCompany='';
			for(var i=0;i<GlobalVariable.receiptData[0].transactionLineItemDtoList.length;i++)
			{
				$scope.modifiedData.push(
					{
						"productNumber":GlobalVariable.receiptData[0].transactionLineItemDtoList[i].productNumber,
						"productDescription":GlobalVariable.receiptData[0].transactionLineItemDtoList[i].productDescription,
						"retail":GlobalVariable.receiptData[0].transactionLineItemDtoList[i].retail,
						"discountPercentage":GlobalVariable.receiptData[0].transactionLineItemDtoList[i].discountPercentage,
						"retwdisc":(parseFloat(GlobalVariable.receiptData[0].transactionLineItemDtoList[i].totalProductPrice)/parseFloat(GlobalVariable.receiptData[0].transactionLineItemDtoList[i].quantity)).toFixed(2),
						"quantity":GlobalVariable.receiptData[0].transactionLineItemDtoList[i].quantity,
						"totalProductPrice":GlobalVariable.receiptData[0].transactionLineItemDtoList[i].totalProductPrice,
						"imeiNo":GlobalVariable.receiptData[0].transactionLineItemDtoList[i].imeiNo
					}
				);
			}

			//GlobalVariable.isPrintPage = true;
			if(GlobalVariable.receiptData[0].customerDtosList .length !== 0)
			{

				$scope.printFirstName=GlobalVariable.receiptData[0].customerDtosList[0].firstName;
					$scope.printLastName =GlobalVariable.receiptData[0].customerDtosList[0].lastName;
						$scope.printStreet=GlobalVariable.receiptData[0].customerDtosList[0].street;
							$scope.printCity=GlobalVariable.receiptData[0].customerDtosList[0].city;
								$scope.printState=GlobalVariable.receiptData[0].customerDtosList[0].state;
									$scope.printCountry=GlobalVariable.receiptData[0].customerDtosList[0].country;
										$scope.printzipCode=GlobalVariable.receiptData[0].customerDtosList[0].zipcode;
						$scope.printPhone=GlobalVariable.receiptData[0].customerDtosList[0].phoneNo;
				$scope.printCompany =GlobalVariable.receiptData[0].customerDtosList[0].companyName;

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
		$scope.navigateToReturnPage = function(transactionDate,transactionCompId)
	{
		/*var request = new Object();
		 request.transactionDate = transactionDate;
		 request.transactionCompId = transactionCompId;
		 request = JSON.stringify(request);*/
		var url=GlobalConstants.URLCONSTANTS+"getReceiptDetails?receiptId="+transactionCompId;
		dataService.Get(url,getReturnsSuccessHandler,getReturnsErrorHandler,"application/json","application/json");


	};
		function getReturnsSuccessHandler(response)
		{
			GlobalVariable.getReturnDetails = response;

			GlobalVariable.returnProduct = true;
			$state.go('return');
		}
		function getReturnsErrorHandler(response)
		{

		}
/*		salesDate : moment($scope.salesDates[receiptIndex]).format("MM/DD/YYYY")
*/
		$scope.navigateToSellPage = function(transactionDate,transactionCompId)
		{
			/*var request = new Object();
			 request.transactionDate = transactionDate;
			 request.transactionCompId = transactiorannCompId;
			 request = JSON.stringify(request);*/
			GlobalVariable.onlineTransactionCompId = transactionCompId;
			var url=GlobalConstants.URLCONSTANTS+"getReceiptDetails?receiptId="+transactionCompId;
			dataService.Get(url,getReturnSellSuccessHandler,getReturnSellErrorHandler,"application/json","application/json");


		};
		function getReturnSellSuccessHandler(response)
		{
			GlobalVariable.getReturnSellDetails = response;

			GlobalVariable.onlineSellProduct = true;
			$state.go('sell');
		}
		function getReturnSellErrorHandler(response)
		{

		}
		$scope.showTransNotes = function(row)
		{
			$scope.editNotesId = row.transactionCompId;
			if(row.receiptNote == null)
			{
				GlobalVariable.rcptNote= '';
				GlobalVariable.transNote='';
			}
			else
			{
				GlobalVariable.rcptNote= row.receiptNote;
				GlobalVariable.transNote=row.transactionNote;
			}

			var _tmPath = 'app/Ledger/ShowNotes.html';
			var _ctrlPath = 'showNotesController';
			DialogFactory.show(_tmPath, _ctrlPath, $scope.editRcptNotes);
		};
		$scope.editRcptNotes = function()
		{
				var url = GlobalConstants.URLCONSTANTS+'editReceiptNote?transactionId='+$scope.editNotesId+
						'&receiptNote='+GlobalVariable.rcptNote+'&transactionNote='+GlobalVariable.transNote;
				var request={};
				dataService.Post(url,request,onEditNoteSuccess,onEditNoteError,'application/json','application/json');
		};
		function onEditNoteSuccess(response)
		{
			$scope.slsHisType = 'todaySales';
			$scope.loadslshisType('todaySales');
		}
		function onEditNoteError(response)
		{

		}
		function render()
		{
			//$scope.startDate = moment();
			$scope.slsHisType = 'todaySales';
			/** Options for the date picker directive * */
			$scope.dateRangeOptions = {
				//startDate : moment(),
				showDropdowns : true,
				format : 'yyyy-MM-dd',
				singleDatePicker : true
			};

			$scope.loadslshisType('todaySales');
			//getStoreAddress();
		}
		/*function getStoreAddress()
		{
			var url=GlobalConstants.URLCONSTANTS+'getPageSetUpDetails';
			dataService.Get(url,onStoreSuccess,onStoreError,'application/json','application/json');
		}
		function onStoreSuccess(response)
		{
			GlobalVariable.storeAddress = response[0].storeAddress;
			GlobalVariable.footerReceipt = response[0].footerReceipt;
		}
		function onStoreError(error)
		{

		}*/
		function getPreviousDay () {
			var now = new Date();
			now.setDate(now.getDate() - 1);
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
			var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			var  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
			return year + "-" + month + "-" + day ;

		}
		function getLast7Day () {
			var now = new Date();
			now.setDate(now.getDate() - 7);
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
			var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			var  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
			return year + "-" + month + "-" + day ;

		}
		function getlast6Months () {
			var now = new Date();
			now.setMonth(now.getMonth()-6);
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
			var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			var  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
			return year + "-" + month + "-" + day ;

		}
		function getlast3Months () {
			var now = new Date();
			now.setMonth(now.getMonth()-3);
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
			var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			var  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
			return year + "-" + month + "-" + day ;

		}
		function getlastMonth()
		{
			var now = new Date();
			now.setMonth(now.getMonth()-1);
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth()+1); if (month.length == 1) { month = "0" + month; }
			var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			return year + "-" + month + "-" + day ;
		}
		function getcurrentMonth()
		{
			var now = new Date();
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth()+1); if (month.length == 1) { month = "0" + month; }

			return month ;
		}
		function getcurrentYear () {
			var now = new Date();
			var year = "" + now.getFullYear();

			return year;
		}
		function getCurrentandPreviousYear () {
			var now = new Date();
			var year = "" + now.getFullYear();
			var prevoiusYear = now.getFullYear()-1;

			return year + "-" + prevoiusYear;
		}
		function getCurrentMonth()
		{
			var now = new Date();
			var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
			var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			var  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }

			return month;
		}
		function getCurrentDay () {
			var now = new Date();
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
			var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
			var  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
			var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
			var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
			return year + "-" + month + "-" + day;
		}
		render();
	}

		
})();