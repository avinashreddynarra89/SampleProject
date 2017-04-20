(function() {
	'use strict';

	angular.module('sampleApp').controller('CloseRegisterController',
		CloseRegisterController);

	CloseRegisterController.$inject = [ '$scope', '$rootScope',
		'device.utility', 'GlobalVariable', '$state', 'dataService',
		'RestrictedCharacter.Types', '$filter', '$timeout', '$window' ,'GlobalConstants'];

	function CloseRegisterController($scope, $rootScope, device,
									 GlobalVariable, $state, dataService, restrictCharacter, $filter,
									 $timeout, $window,GlobalConstants) {
		$scope.totalUser = 0;
		$scope.totalInValue = 0;
		$scope.userCash = 0;
		$scope.userDebit = 0;
		$scope.userCheck = 0;
		$scope.difDebit = 0;
		$scope.difCash = 0;
		$scope.difCheck = 0;
		$scope.totalDiff = 0;
		$scope.userDebitCard = 0;
		$scope.systemDebitCard = 0;
		$scope.diffDebitCard = 0;
		$scope.maxDate = new Date();
		$scope.showCloseRegister = true;
		$scope.restrictCharacter = restrictCharacter;
		$scope.loadcloseRegister=function(saleDate)
		{
			var url;
			var start,end;

			if(saleDate=='todaySales')
			{
				$scope.showCloseRegister = true;
				start = getCurrentDay()+''+' 00:00:00';
				end = getCurrentDay()+''+' 23:59:59';
			}
			else if(saleDate == 'yestSales')
			{
				$scope.showCloseRegister = false;
				start = getPreviousDay()+''+' 00:00:00';
				end = getPreviousDay()+''+' 23:59:59';
			}
			else if(saleDate == 'lastWeekSales')
			{
				$scope.showCloseRegister = false;
				start = getLast7Day()+' 00:00:00';
				end = getCurrentDay()+' 23:59:59';
			}
			else if(saleDate == 'thisMonthSales')
			{
				$scope.showCloseRegister = false;
				start = getcurrentYear()+"-"+getcurrentMonth()+"-01 00:00:00";
				end = getcurrentYear()+"-"+getcurrentMonth()+"-31 23:59:59";
			}
			else if(saleDate == 'lastMonthSales')
			{
				$scope.showCloseRegister = false;
				start = getlastMonth()+" 00:00:00";
				end = getCurrentDay()+" 23:59:59";
			}
			else if(saleDate == 'last3MonthsSales')
			{
				$scope.showCloseRegister = false;
				start = getlast3Months()+" 00:00:00";
				end = getCurrentDay()+" 23:59:59";
			}
			else if(saleDate == 'last6MonthsSales')
			{
				$scope.showCloseRegister = false;
				start = getlast6Months()+" 00:00:00";
				end = getCurrentDay()+" 23:59:59";
			}
			else if(saleDate == 'thisYearSales')
			{
				$scope.showCloseRegister = false;
				var years = getCurrentandPreviousYear().split("-");
				start =years[0]+"-01-01 00:00:00";
				end =years[0]+"-12-31 23:59:59";
			}
			else if(saleDate == 'lastYearSales')
			{
				$scope.showCloseRegister = false;
				var years = getCurrentandPreviousYear().split("-");
				start =years[1]+"-01-01 00:00:00";
				end =years[1]+"-12-31 23:59:59";
			}
			else
			{
				$scope.showCloseRegister = false;
				start = $filter('date')($scope.startTransDate, "yyyy-MM-dd")+" 00:00:00";
				end = $filter('date')($scope.endTransDate, "yyyy-MM-dd")+" 23:59:59";
			}
			getClosingDetails(start,end)
			getPaidOutDetails(start,end);
		};
		function getClosingDetails(startDate, endDate) {
			if(($scope.showWholeSale == true) && (GlobalVariable.wholeSaleFlag == 1))
			{
				var url = GlobalConstants.URLCONSTANTS+"getClosingDetailsForWholesale?startDate="
					+ startDate + "&endDate=" + endDate;
			}
			else
			{
				var url = GlobalConstants.URLCONSTANTS+"getClosingDetails?startDate="
					+ startDate + "&endDate=" + endDate;
			}

			dataService.Get(url, getClosingDetailsSuccessHandler,
				getClosingDtlsErrorHandler, 'application/json',
				'application/json');
			// getClosingDetailsSuccessHandler('');
		}
		function getClosingDetailsSuccessHandler(response) {
			$scope.getClosingDtls = response;

			if (response.length !== 0) {
				$scope.systemDebit = parseFloat(parseFloat($scope.getClosingDtls[0].reportCredit).toFixed(2));
				$scope.systemDebitCard = parseFloat(parseFloat($scope.getClosingDtls[0].reportDebit).toFixed(2));
				$scope.systemCash = parseFloat(parseFloat($scope.getClosingDtls[0].reportCash).toFixed(2));
				$scope.sysCheck = parseFloat(parseFloat($scope.getClosingDtls[0].reportCheck).toFixed(2));
				$scope.userCash = $scope.getClosingDtls[0].closeCash;
				$scope.userDebit = $scope.getClosingDtls[0].closeCredit;
				$scope.userDebitCard = $scope.getClosingDtls[0].closeDebit;
				$scope.totalSys = parseFloat(parseFloat($scope.getClosingDtls[0].reportTotalAmount).toFixed(2));
				$scope.registerId = $scope.getClosingDtls[0].registerId;
				$scope.totalUser = $scope.getClosingDtls[0].closeTotalAmount;
				$scope.totalUser = parseFloat($scope.totalUser).toFixed(2);
				$scope.difCash = parseFloat(parseFloat($scope.getClosingDtls[0].differenceCash).toFixed(2));
				$scope.difDebit = parseFloat(parseFloat($scope.getClosingDtls[0].differenceCredit).toFixed(2));
				$scope.difDebitCard = parseFloat(parseFloat($scope.getClosingDtls[0].differenceDebit).toFixed(2));
				$scope.totalDiff = parseFloat(parseFloat($scope.getClosingDtls[0].totalDifference).toFixed(2));
				$scope.totalProfit = parseFloat(parseFloat($scope.getClosingDtls[0].totalProfit).toFixed(2));
				$scope.totalDisc = parseFloat(parseFloat($scope.getClosingDtls[0].totalDiscount).toFixed(2));
				$scope.totalTax = parseFloat(parseFloat($scope.getClosingDtls[0].totalTax).toFixed(2));
				$scope.totalMarkup = parseFloat(parseFloat($scope.getClosingDtls[0].totalMarkup).toFixed(2));
				$scope.totalBusinessAmount = parseFloat(parseFloat($scope.getClosingDtls[0].totalBusinessAmount).toFixed(2));
				$scope.netSales = parseFloat($scope.userCash)
					+ parseFloat($scope.userDebit)
					+ parseFloat($scope.userDebitCard)
					+ parseFloat($scope.userCheck)
					- parseFloat($scope.totalTax);
				$scope.dateTime = js_yyyy_mm_dd_hh_mm_ss1();
				$scope.bankDeposit=$scope.getClosingDtls[0].bankDeposit;
				$scope.custBalance =$scope.getClosingDtls[0].customerBalance;
				$scope.commission = $scope.getClosingDtls[0].commission;
				$scope.cashHand = $scope.getClosingDtls[0].cashInHand;
			} else {
				$scope.cashHand = 0;
				$scope.userDebitCard = 0;
				$scope.systemDebitCard =0;
				$scope.diffDebitCard = 0;
				$scope.systemDebit = 0;
				$scope.systemCash = 0;
				$scope.sysCheck = 0;
				$scope.userCash = 0;
				$scope.userDebit = 0;
				$scope.totalSys = 0;
				$scope.registerId = 0;
				$scope.totalUser = 0;
				$scope.totalUser = 0;
				$scope.difCash = 0;
				$scope.difDebit = 0;
				$scope.totalDiff = 0;
				$scope.totalProfit = 0;
				$scope.totalDisc = 0;
				$scope.totalTax = 0;
				$scope.bankDeposit=0;
				$scope.custBalance =0;
				$scope.commission = 0;

			}

		}
		function getClosingDtlsErrorHandler(response) {

		}
		$scope.getUserDebit = function(value) {
			if ($scope.userDebit == '')
				$scope.userDebit = 0;
			if ($scope.userCash == '')
				$scope.userCash = 0;
			if ($scope.userCheck == '')
				$scope.userCheck = 0;
			if($scope.bankDeposit == '')
				$scope.bankDeposit = 0;
			if($scope.userDebitCard == '')
				$scope.userDebitCard = 0;
			if($scope.userPaid == '')
				$scope.userPaid = 0;
			if($scope.systemPaid == '')
				$scope.systemPaid = 0;
			if($scope.difPaid == '')
				$scope.difPaid = 0;

			$scope.totalUser = parseFloat($scope.userDebit)
					+parseFloat($scope.userDebitCard)
				+ parseFloat($scope.userCash)
				+ parseFloat($scope.userCheck)+parseFloat($scope.userPaid)+parseFloat($scope.systemPaid)+parseFloat($scope.difPaid);
			$scope.totalUser = parseFloat(parseFloat($scope.totalUser).toFixed(2));
			$scope.difDebit = parseFloat($scope.userDebit)
				- parseFloat($scope.systemDebit);
			$scope.difDebit = parseFloat(parseFloat($scope.difDebit).toFixed(2));
			$scope.totalDiff = parseFloat($scope.totalUser)
				- parseFloat($scope.totalSys)
			$scope.totalDiff = parseFloat(parseFloat($scope.totalDiff).toFixed(2));
			if ($scope.difDebit > 0)
				$scope.debitColor = 'green';
			else if ($scope.difDebit < 0)
				$scope.debitColor = 'red';
			else
				$scope.debitColor = 'black';

			if ($scope.totalDiff > 0)
				$scope.totalColor = 'green';
			else if ($scope.totalDiff < 0)
				$scope.totalColor = 'red';
			else
				$scope.totalColor = 'black';
		};
		$scope.getUserDebitCard = function(value) {
			if ($scope.userDebit == '')
				$scope.userDebit = 0;
			if ($scope.userCash == '')
				$scope.userCash = 0;
			if ($scope.userCheck == '')
				$scope.userCheck = 0;
			if($scope.bankDeposit == '')
				$scope.bankDeposit = 0;
			if ($scope.userDebitCard == '')
				$scope.userDebitCard = 0;
			if($scope.userPaid == '')
				$scope.userPaid = 0;
			if($scope.systemPaid == '')
				$scope.systemPaid = 0;
			if($scope.difPaid == '')
				$scope.difPaid = 0;

			$scope.totalUser = parseFloat($scope.userDebit)
				+parseFloat($scope.userDebitCard)
				+ parseFloat($scope.userCash)
				+ parseFloat($scope.userCheck)+parseFloat($scope.userPaid)+parseFloat($scope.systemPaid)+parseFloat($scope.difPaid);
			$scope.totalUser = parseFloat($scope.totalUser).toFixed(2);
			$scope.difDebitCard = parseFloat($scope.userDebitCard)
				- parseFloat($scope.systemDebitCard);
			$scope.totalDiff = parseFloat($scope.totalUser)
				- parseFloat($scope.totalSys);
			$scope.totalDiff = parseFloat(parseFloat($scope.totalDiff).toFixed(2));
			if ($scope.difDebitCard > 0)
				$scope.debitColor = 'green';
			else if ($scope.difDebitCard < 0)
				$scope.debitColor = 'red';
			else
				$scope.debitColor = 'black';

			if ($scope.totalDiff > 0)
				$scope.totalColor = 'green';
			else if ($scope.totalDiff < 0)
				$scope.totalColor = 'red';
			else
				$scope.totalColor = 'black';
		};

		$scope.getBankDeposit = function(value)
		{
			$scope.cashHand= parseFloat($scope.userCash) - parseFloat($scope.bankDeposit);
		};
		$scope.getUserCash = function(value) {
			if ($scope.userDebit == '')
				$scope.userDebit = 0;
			if ($scope.userCash == '')
				$scope.userCash = 0;
			if ($scope.userCheck == '')
				$scope.userCheck = 0;
			if($scope.bankDeposit == '')
				$scope.bankDeposit = 0;
			if ($scope.userDebitCard == '')
				$scope.userDebitCard = 0;

			if($scope.userPaid == '')
				$scope.userPaid = 0;
			if($scope.systemPaid == '')
				$scope.systemPaid = 0;
			if($scope.difPaid == '')
				$scope.difPaid = 0;

			$scope.totalUser = parseFloat($scope.userDebit)
				+parseFloat($scope.userDebitCard)
				+ parseFloat($scope.userCash)
				+ parseFloat($scope.userCheck)+parseFloat($scope.userPaid)+parseFloat($scope.systemPaid)+parseFloat($scope.difPaid);
			$scope.totalUser = parseFloat($scope.totalUser).toFixed(2);
			$scope.difCash = parseFloat($scope.userCash)+parseFloat($scope.bankDeposit)
				- parseFloat($scope.systemCash);
			$scope.totalDiff = parseFloat($scope.totalUser)
				- parseFloat($scope.totalSys);
			$scope.totalDiff = parseFloat(parseFloat($scope.totalDiff).toFixed(2));
			$scope.cashHand= parseFloat($scope.userCash) - parseFloat($scope.bankDeposit);
			if ($scope.difCash > 0)
				$scope.cashColor = 'green';
			else if ($scope.difCash < 0)
				$scope.cashColor = 'red';
			else
				$scope.cashColor = 'black';

			if ($scope.totalDiff > 0)
				$scope.totalColor = 'green';
			else if ($scope.totalDiff < 0)
				$scope.totalColor = 'red';
			else
				$scope.totalColor = 'black';
		};
		$scope.getUserCheck = function(value) {
			if ($scope.userDebit == '')
				$scope.userDebit = 0;
			if ($scope.userCash == '')
				$scope.userCash = 0;
			if ($scope.userCheck == '')
				$scope.userCheck = 0;
			if($scope.bankDeposit == '')
				$scope.bankDeposit = 0;
			if ($scope.userDebitCard == '')
				$scope.userDebitCard = 0;

			if($scope.userPaid == '')
				$scope.userPaid = 0;
			if($scope.systemPaid == '')
				$scope.systemPaid = 0;
			if($scope.difPaid == '')
				$scope.difPaid = 0;

			$scope.totalUser = parseFloat($scope.userDebit)
				+parseFloat($scope.userDebitCard)
				+ parseFloat($scope.userCash)
				+ parseFloat($scope.userCheck)+parseFloat($scope.userPaid)+parseFloat($scope.systemPaid)+parseFloat($scope.difPaid);
			$scope.totalUser = parseFloat($scope.totalUser).toFixed(2);
			$scope.difCheck = parseFloat($scope.userCheck)
				- parseFloat($scope.sysCheck);
			$scope.totalDiff = parseFloat($scope.totalUser)
				- parseFloat($scope.totalSys)

			if ($scope.difCheck > 0)
				$scope.checkColor = 'green';
			else if ($scope.difCheck < 0)
				$scope.checkColor = 'red';
			else
				$scope.checkColor = 'black';

			if ($scope.totalDiff > 0)
				$scope.totalColor = 'green';
			else if ($scope.totalDiff < 0)
				$scope.totalColor = 'red';
			else
				$scope.totalColor = 'black';
		};
		$scope.getUserPaid = function(paid)
		{
			if ($scope.userDebit == '')
				$scope.userDebit = 0;
			if ($scope.userCash == '')
				$scope.userCash = 0;
			if ($scope.userCheck == '')
				$scope.userCheck = 0;
			if($scope.bankDeposit == '')
				$scope.bankDeposit = 0;
			if ($scope.userDebitCard == '')
				$scope.userDebitCard = 0;
			if($scope.userPaid == '')
				$scope.userPaid = 0;
			if($scope.systemPaid == '')
				$scope.systemPaid = 0;
			if($scope.difPaid == '')
				$scope.difPaid = 0;

			$scope.totalUser = parseFloat($scope.userDebit)
				+parseFloat($scope.userDebitCard)
				+ parseFloat($scope.userCash)
				+ parseFloat($scope.userCheck)+parseFloat($scope.userPaid)+parseFloat($scope.systemPaid)+parseFloat($scope.difPaid);
			$scope.totalUser = parseFloat(Number($scope.totalUser).toFixed(2));
			$scope.totalDiff = parseFloat($scope.totalUser)
				- parseFloat($scope.totalSys);
			$scope.totalDiff = parseFloat(parseFloat($scope.totalDiff).toFixed(2));
		};
		$scope.getTotal = function(value, entText) {

			$scope.totalInValue = 0;


			if($scope.hundred !== undefined && $scope.hundred !== '')
			{
				$scope.totalInValue = parseFloat($scope.totalInValue)
					+ (parseFloat($scope.hundred) * 100);
			}
			if($scope.fifty !== undefined && $scope.fifty !== '')
			{
				$scope.totalInValue = parseFloat($scope.totalInValue)
					+ (parseFloat($scope.fifty) * 50);
			}
			if($scope.twenty !== undefined && $scope.twenty !== '')
			{
				$scope.totalInValue = parseFloat($scope.totalInValue)
					+ (parseFloat($scope.twenty) * 20);
			}
			if($scope.ten !== undefined && $scope.ten !== '')
			{
				$scope.totalInValue = parseFloat($scope.totalInValue)
					+ (parseFloat($scope.ten) * 10);
			}
			if($scope.five !== undefined && $scope.five !== '')
			{
				$scope.totalInValue = parseFloat($scope.totalInValue)
					+ (parseFloat($scope.five) * 5);
			}
			if($scope.two !== undefined && $scope.two !== '')
			{
				$scope.totalInValue = parseFloat($scope.totalInValue)
					+ (parseFloat($scope.two) * 2);
			}
			if($scope.one !== undefined && $scope.one !== '')
			{
				$scope.totalInValue = parseFloat($scope.totalInValue)
					+ (parseFloat($scope.one) * 1);
			}
		};
		$scope.closeRegister = function() {
			var request = {
				"userIdClose" : $scope.registerId,
				"reportCash" : parseFloat($scope.systemCash).toFixed(2),
				"reportCredit" : parseFloat($scope.systemDebit).toFixed(2),
				"reportDebit" : parseFloat($scope.systemDebitCard).toFixed(2),
				"reportTotalAmount" : parseFloat($scope.totalSys).toFixed(2),
				"closeCash" : parseFloat($scope.userCash).toFixed(2),
				"closeCredit" : parseFloat($scope.userDebit).toFixed(2),
				"closeDebit" : parseFloat($scope.userDebitCard).toFixed(2),
				"closeDate" : js_yyyy_mm_dd_hh_mm_ss1(),
				"closeTotalAmount" : parseFloat($scope.totalUser).toFixed(2),
				"differenceCash" : parseFloat($scope.difCash).toFixed(2),
				"differenceCredit" : parseFloat($scope.difDebit).toFixed(2),
				"differenceDebit" : parseFloat($scope.difDebitCard).toFixed(2),
				"totalDifference" : parseFloat($scope.totalDiff).toFixed(2),
				"totalBusinessAmount" : $scope.totalBusinessAmount,
				"totalTax" : parseFloat($scope.totalTax).toFixed(2),
				"totalDiscount" : parseFloat($scope.totalDisc).toFixed(2),
				"totalProfit" : parseFloat($scope.totalProfit).toFixed(2),
				"totalMarkup" : $scope.totalMarkup,
				"registerStatus" : null,
				"registerId" : $scope.registerId,
				"customerBalance":$scope.custBalance,
				"bankDeposit":$scope.bankDeposit,
				"commission":$scope.commission,
				"cashInHand":$scope.cashHand
			};
			if(($scope.showWholeSale == true) && (GlobalVariable.customReceiptFalg == 1))
			{
				var url = GlobalConstants.URLCONSTANTS+"addClosingDetailsForWholeSale";
			}
			else
			{
				var url = GlobalConstants.URLCONSTANTS+"addClosingDetails";
			}

			dataService.Post(url, request, getSuccessAddhandler,
				getErrorAddHandler, 'application/json', 'application/json');

		};
		function getSuccessAddhandler(response) {
			var startDate = js_yyyy_mm_dd_hh_mm_ss() + '' + ' 00:00:00';
			var endDate = js_yyyy_mm_dd_hh_mm_ss() + '' + ' 23:59:59';
			getClosingDetails(startDate, endDate);
			$scope.addPaidOut();
		}
		;
		function getErrorAddHandler(response) {

		}
		;
		function render() {
			$scope.dateRangeOptions = {
				// startDate : moment(),
				showDropdowns : true,
				format : 'yyyy-MM-dd',
				singleDatePicker : true
			};
			//var startDate = js_yyyy_mm_dd_hh_mm_ss() + '' + ' 00:00:00';
			//var endDate = js_yyyy_mm_dd_hh_mm_ss() + '' + ' 23:59:59';
			//$scope.startDate = $filter('date')(new Date(), "yyyy-MM-dd");
			//getClosingDetails(startDate, endDate);
			//getPaidOutDetails(startDate, endDate);
			$scope.clsRegister='todaySales';
			$scope.loadcloseRegister($scope.clsRegister);
		}
		function getPaidOutDetails(startDate, endDate) {
			var url = GlobalConstants.URLCONSTANTS+"getPaidOut?startDate=" + startDate
				+ "&endDate=" + endDate;
			dataService.Get(url, getaddPaidSuccessHandler,
				getaddpaidErrorHandler, 'application/json',
				'application/json');
			// getaddPaidSuccessHandler('');
		}
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
		$scope.applySalesByTypeCls = function(type)
		{

			$scope.loadcloseRegister(type);
		};
		/*$scope.changeDtls = function() {
			var chnDt = $filter('date')($scope.startDate, "yyyy-MM-dd");
			var start = $filter('date')($scope.startDate, "yyyy-MM-dd") + ''
				+ ' 00:00:00';
			var end = $filter('date')($scope.startDate, "yyyy-MM-dd") + ''
				+ ' 23:59:59';
			if (chnDt < js_yyyy_mm_dd_hh_mm_ss()) {
				$scope.showCloseRegister = false;
			} else {
				$scope.showCloseRegister = true;
			}
			getPaidOutDetails(start, end);
			getClosingDetails(start, end);
		};*/
		function getaddPaidSuccessHandler(response) {
			// $scope.getPaidOutDtls = response;
			/*
			 * response=[ { "paidOutId": 13, "paidOutAmount1": 32.99,
			 * "paidOutAmount2": 23, "paidOutAmount3": 32, "paidOutReason1":
			 * "test", "paidOutReason2": null, "paidOutReason3": null,
			 * "paidOutDate": "2016-07-17 00:00:00.0", "sumPaidOut": 0 } ];
			 */
			if (response.length !== 0) {
				$scope.userPaid = response[0].paidOutAmount1;
				$scope.userReason = response[0].paidOutReason1;
				$scope.systemPaid = response[0].paidOutAmount2;
				$scope.sysReason = response[0].paidOutReason2;
				$scope.difPaid = response[0].paidOutAmount3;
				$scope.difReason = response[0].paidOutReason3;
				$scope.paidOutId = response[0].paidOutId;
				} else {
				$scope.userPaid = 0;
				$scope.userReason = '';
				$scope.systemPaid = 0;
				$scope.sysReason = '';
				$scope.difPaid = 0;
				$scope.difReason = '';
				$scope.paidOutId = '';
			}
			$scope.totalPaid = parseFloat($scope.userPaid)
				+ parseFloat($scope.systemPaid)
				+ parseFloat($scope.difPaid);
			//$scope.totalUser = parseFloat($scope.totalUser)+parseFloat($scope.totalPaid);
			$scope.netSales = parseFloat($scope.netSales)
				+ $scope.totalPaid;
			$scope.grossSales = (parseFloat($scope.userDebit)+parseFloat($scope.userCash)+parseFloat($scope.userCheck)).toFixed(2);


			/*
			 * $scope.totalPaidOut =0; for(var i=0;i<response.length;i++) {
			 * $scope.totalPaidOut = $scope.totalPaidOut +
			 * parseFloat(response[i].paidOutAmount); }
			 */
		}
		function getaddpaidErrorHandler(response) {

		}

		$scope.addPaidOut = function() {
			var request = {

				"paidOutAmount1" : $scope.userPaid,
				"paidOutReason1" : $scope.userReason,
				"paidOutAmount2" : $scope.systemPaid,
				"paidOutReason2" : $scope.sysReason,
				"paidOutAmount3" : $scope.difPaid,
				"paidOutReason3" : $scope.difReason,
				"paidOutId" : $scope.paidOutId,
				"paidOutDate" : js_yyyy_mm_dd_hh_mm_ss(),
				'sumPaidOut' : parseFloat($scope.userPaid)
				+ parseFloat($scope.systemPaid)
				+ parseFloat($scope.difPaid)
			};
			request = JSON.stringify(request);
			var url = GlobalConstants.URLCONSTANTS+"addPaidOut";
			dataService
				.Post(url, request, addPaidSuccessHandler,
					addPaidErrorHandler, 'application/json',
					'application/json');

		};
		function addPaidSuccessHandler(response) {
			//sendEmail('alokpatel.au@gmail.com', "hi", "hello");
			var startDate = js_yyyy_mm_dd_hh_mm_ss() + '' + ' 00:00:00';
			var endDate = js_yyyy_mm_dd_hh_mm_ss() + '' + ' 23:59:59';
			getPaidOutDetails(startDate, endDate);
			// getClosingDetails(startDate,endDate);
		}
		function sendEmail(email, subject, body) {
			var link = "mailto:" + email + "?subject=New%20email "
				+ escape(subject) + "&body=" + escape(body);

			window.location.href = link;
		}
		function addPaidErrorHandler(response) {

		}
		render();
		function js_yyyy_mm_dd_hh_mm_ss() {
			var now = new Date();
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth() + 1);
			if (month.length == 1) {
				month = "0" + month;
			}
			var day = "" + now.getDate();
			if (day.length == 1) {
				day = "0" + day;
			}
			var hour = "" + now.getHours();
			if (hour.length == 1) {
				hour = "0" + hour;
			}
			var minute = "" + now.getMinutes();
			if (minute.length == 1) {
				minute = "0" + minute;
			}
			var second = "" + now.getSeconds();
			if (second.length == 1) {
				second = "0" + second;
			}
			return year + "-" + month + "-" + day;
		}
		function js_yyyy_mm_dd_hh_mm_ss1() {
			var now = new Date();
			var year = "" + now.getFullYear();
			var month = "" + (now.getMonth() + 1);
			if (month.length == 1) {
				month = "0" + month;
			}
			var day = "" + now.getDate();
			if (day.length == 1) {
				day = "0" + day;
			}
			var hour = "" + now.getHours();
			if (hour.length == 1) {
				hour = "0" + hour;
			}
			var minute = "" + now.getMinutes();
			if (minute.length == 1) {
				minute = "0" + minute;
			}
			var second = "" + now.getSeconds();
			if (second.length == 1) {
				second = "0" + second;
			}
			return year + "-" + month + "-" + day + " " + hour + ":" + minute
				+ ":" + second;
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
		$scope.printCloseRegister = function(saleDate) {
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
			url=GlobalConstants.URLCONSTANTS+'printClosingDetails?startDate='+start+'&endDate='+end;
			$window.open(url,'_blank');
		};
	}
})();
