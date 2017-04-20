(function() {
	'use strict';

	angular.module('sampleApp').controller('historyPopupController', historyPopupController);

	historyPopupController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','modalService','dataService','$state','RestrictedCharacter.Types','$filter','GlobalConstants'];

	function historyPopupController($scope, $rootScope, device ,GlobalVariable,DialogFactory,modalService,dataService,$state,restrictCharacter,$filter,GlobalConstants)
	{
		$scope.GlobalVariable = GlobalVariable;
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
		$scope.loadsalesHist=function(saleDate)
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
			loadHistoryData(start,end)
		};
		$scope.applySalesByType = function(type)
		{

			$scope.loadsalesHist(type);
		};
		function loadHistoryData(start,end)
		{

			var url =GlobalConstants.URLCONSTANTS+'getProductHistory?productNo='+GlobalVariable.productIdHistory+'&startDate='+start+'&endDate='+end;
			dataService.Get(url,getProductHistorySuccessHandler,getProductHistroyErrorHandler,"application/json","application/json");
			
		}
		function getProductHistorySuccessHandler(response)
		{
			$scope.getProductHistory = response;
			
		}
		function getProductHistroyErrorHandler(response)
		{
			
		}
		function render()
		{
			$scope.salesHist='todaySales';
			$scope.loadsalesHist($scope.salesHist);
			/** Options for the date picker directive * */
			$scope.dateRangeOptions = {
				//startDate : moment(),
				showDropdowns : true,
				format : 'yyyy-MM-dd',
				singleDatePicker : true
			};
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
		render();
	}
		
})();