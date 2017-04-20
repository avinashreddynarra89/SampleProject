(function() {
	'use strict';

	angular.module('sampleApp').controller('ReportController', ReportController);

	ReportController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','dataService','$window','$filter','$timeout','RestrictedCharacter.Types','GlobalConstants'];

	function ReportController($scope, $rootScope, device ,GlobalVariable,DialogFactory,dataService,$window,$filter,$timeout,restrictCharacter,GlobalConstants)
	{
		GlobalVariable.isLoginPage = false;
		$scope.yearlySummary = [];
		$scope.salesByUser = [];
		$scope.salesByCategory = [];
		$scope.salesByTop50 = [];
		$scope.salesByBrand = [];
		$scope.salesByVendor = [];
		$scope.salesByProduct =[];
		$scope.salesByCustomer = [];
		$scope.restrictCharacter=restrictCharacter;
		$scope.maxDate = new Date();
		$scope.minDate = moment().subtract(1, "days").toDate();

		$scope.printReports = function(type,saleDate,slsdate)
		{
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

			if(type == 'salesCategory')
			{
				var url=GlobalConstants.URLCONSTANTS+'printSaleByCommonNames?startDate='+start+'&endDate='+end+'&reportNo=1';
			}
			else if(type == 'top50Selling')
			{
				var url=GlobalConstants.URLCONSTANTS+'printSaleByCommonNames?startDate='+start+'&endDate='+end+'&reportNo=7';
			}
			else if(type == 'salesBrand')
			{
				var url=GlobalConstants.URLCONSTANTS+'printSaleByCommonNames?startDate='+start+'&endDate='+end+'&reportNo=3';
			}
			else if(type == 'salesVendor')
			{
				var url=GlobalConstants.URLCONSTANTS+'printSaleByCommonNames?startDate='+start+'&endDate='+end+'&reportNo=2';
			}
			else if(type == 'salesUser')
			{
				var url=GlobalConstants.URLCONSTANTS+'printSaleByCommonNames?startDate='+start+'&endDate='+end+'&reportNo=5';
			}
			else if(type == 'salesProduct')
			{
				var url=GlobalConstants.URLCONSTANTS+'printSaleByCommonNames?startDate='+start+'&endDate='+end+'&reportNo=4';
			}
			else if(type == 'salesCustomer')
			{
				var url=GlobalConstants.URLCONSTANTS+'printSaleByCommonNames?startDate='+start+'&endDate='+end+'&reportNo=6';
			}
			else if(type == 'inventorySummary')
			{
				if($scope.cType == 'cat')
					var url=GlobalConstants.URLCONSTANTS+'printInventorySummaryByCommonNames?reportNo=1';
				else if($scope.cType == 'ven')
					var url=GlobalConstants.URLCONSTANTS+'printInventorySummaryByCommonNames?reportNo=2';
				else if($scope.cType == 'bran')
					var url=GlobalConstants.URLCONSTANTS+'printInventorySummaryByCommonNames?reportNo=3';
			}
			else if(type == 'salesSummary')
			{
				if(slsdate == 'yearlySummary')
					var url =GlobalConstants.URLCONSTANTS+'printYearlySalesReport?startDate='+start+'&endDate='+end+'&reportNo=1';
				else if(slsdate == 'monthlySummary')
					var url =GlobalConstants.URLCONSTANTS+'printYearlySalesReport?startDate='+start+'&endDate='+end+'&reportNo=2';
				else if(slsdate == 'weeklySummary')
					var url =GlobalConstants.URLCONSTANTS+'printYearlySalesReport?startDate='+start+'&endDate='+end+'&reportNo=3';
				else if(slsdate == 'dailySummary')
					var url =GlobalConstants.URLCONSTANTS+'printYearlySalesReport?startDate='+start+'&endDate='+end+'&reportNo=4';
				else if(slsdate == 'hourlySummary')
					var url =GlobalConstants.URLCONSTANTS+'printYearlySalesReport?startDate='+start+'&endDate='+end+'&reportNo=4';
			}

			$window.open(url, '_blank');

		};

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
		function render()
		{
			$scope.reportType = 'salesSummary';
			$scope.measureType = 'yearlySummary';
			$scope.dlyTransType = 'thisDay';
			$scope.hlyTransType = 'today';
			$scope.slCatType = 'todaySales';
			$scope.cType = 'cat';
			
			//$scope.startDate = moment();
			/** Options for the date picker directive * */
			$scope.dateRangeOptions = {
				//startDate : moment(),
				showDropdowns : true,
				format : 'yyyy-MM-dd',
				singleDatePicker : true
			};
			$scope.yrlyTransType = 'thisYear';
			$scope.mntTransType = 'Jan';
			$scope.startDate = $filter('date')(new Date(), "MM/dd/yyyy");
			$scope.endDate = $scope.startDate;
			var years = getCurrentandPreviousYear().split("-");
			var currentStartDate =years[0]+"-01-01 00:00:00";
			var currentEndDate =years[0]+"-12-31 23:59:59";
			loadSalesYearlyData(currentStartDate,currentEndDate);
			
		}
		$scope.checkType = function()
		{
			$scope.slCatType = 'todaySales';
			if($scope.reportType == 'salesCategory')
			{
				$scope.loadSalesCatData('todaySales','salesCategory');
			}
			else if($scope.reportType == 'top50Selling')
			{
				$scope.loadSalesCatData('todaySales','top50Selling');
			}
			else if($scope.reportType == 'salesBrand')
			{
				$scope.loadSalesCatData('todaySales','salesBrand');
			}
			else if($scope.reportType == 'salesVendor')
			{
				$scope.loadSalesCatData('todaySales','salesVendor');
			}
			else if($scope.reportType == 'salesUser')
			{
				$scope.loadSalesCatData('todaySales','salesUser');
			}
			else if($scope.reportType == 'salesProduct')
			{
				$scope.loadSalesCatData('todaySales','salesProduct');
			}
			else if($scope.reportType == 'salesCustomer')
			{
				$scope.loadSalesCatData('todaySales','salesCustomer');
			}
			else if($scope.reportType == 'salesSummary')
			{
				$scope.measureType = 'yearlySummary';
				var years = getCurrentandPreviousYear().split("-");
				var currentStartDate =years[0]+"-01-01 00:00:00";
				var currentEndDate =years[0]+"-12-31 23:59:59";
				loadSalesYearlyData(currentStartDate,currentEndDate);
			}
			else if($scope.reportType == 'inventorySummary')
			{
					$scope.loadSalesIneventory('cat');
			}
		};

		$scope.loadSalesIneventory = function(type)
		{
			var url;
			if(type == 'cat')
			{
				url =GlobalConstants.URLCONSTANTS+'getInventoryByCategory';
			}
			else if(type == 'ven')
			{
				url =GlobalConstants.URLCONSTANTS+'getInventoryByVendor';
			}
			else if(type == 'bran')
			{
				url =GlobalConstants.URLCONSTANTS+'getInventoryByBrand';
			}
			else if(type == 'tin')
			{

			}
			dataService.Get(url,onSalesInvSuccess,onSalesInvError,'application/json','application/json');
		};
		function onSalesInvSuccess(response)
		{
			$scope.inventorySummary = [];
			for(var i=0;i<response.commonInventoryDtos.length;i++)
			{
				$scope.inventorySummary.push({
					"commonName": response.commonInventoryDtos[i].commonName,
					"noOfProducts": Number(parseFloat(response.commonInventoryDtos[i].noOfProducts)).toFixed(2),
					"cost": Number(parseFloat(response.commonInventoryDtos[i].cost)).toFixed(2),
					"retail": Number(parseFloat(response.commonInventoryDtos[i].retail)).toFixed(2),
					"margin": Number(parseFloat(response.commonInventoryDtos[i].margin)).toFixed(2)
				});
			}
			$scope.inventorySummary.push({
				"commonName":"Total",
				"noOfProducts": Number(parseFloat(response.finalTotalForInventoryDtos[0].totalQuantity)).toFixed(2),
				"cost": Number(parseFloat(response.finalTotalForInventoryDtos[0].totalCost)).toFixed(2),
				"retail": Number(parseFloat(response.finalTotalForInventoryDtos[0].totalRetail)).toFixed(2),
				"margin": Number(parseFloat(response.finalTotalForInventoryDtos[0].avgMargin)).toFixed(2)
			});
		}
		function onSalesInvError(response)
		{

		}

		$scope.checkMeasure = function()
		{
			if($scope.measureType == 'monthlySummary')
			{
				$scope.loadSalesMonthlyData('Jan');
			}
			else if($scope.measureType == 'dailySummary')
			{
				$scope.loadSalesDailyData('thisDay');
			}
			else if($scope.measureType == 'hourlySummary')
			{
				$scope.loadSalesHourlyData('today');
			}
			else if($scope.measureType == 'yearlySummary')
			{
				var years = getCurrentandPreviousYear().split("-");
				var currentStartDate =years[0]+"-01-01 00:00:00";
				var currentEndDate =years[0]+"-12-31 23:59:59";
				loadSalesYearlyData(currentStartDate,currentEndDate);
			}
		};
		$scope.applySalesByType = function(type)
		{
			$scope.loadSalesCatData('',type);
		};
		$scope.loadSalesCatData = function(saleDate,type)
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


			if(type == 'salesCategory')
			{
				var url=GlobalConstants.URLCONSTANTS+'getSalesByCategory?startDate='+start+'&endDate='+end;
			}
			else if(type == 'top50Selling')
			{
				var url=GlobalConstants.URLCONSTANTS+'getTop50Items?startDate='+start+'&endDate='+end;
			}
			else if(type == 'salesBrand')
			{
				var url=GlobalConstants.URLCONSTANTS+'getSalesByBrand?startDate='+start+'&endDate='+end;
			}
			else if(type == 'salesVendor')
			{
				var url=GlobalConstants.URLCONSTANTS+'getSalesByVendor?startDate='+start+'&endDate='+end;
			}
			else if(type == 'salesUser')
			{
				var url=GlobalConstants.URLCONSTANTS+'getSalesByUser?startDate='+start+'&endDate='+end;
			}
			else if(type == 'salesProduct')
			{
				var url=GlobalConstants.URLCONSTANTS+'getSalesByProduct?startDate='+start+'&endDate='+end;
			}
			else if(type == 'salesCustomer')
			{
				var url=GlobalConstants.URLCONSTANTS+'getSalesByCustomer?startDate='+start+'&endDate='+end;
			}


			/*else
			{
				start = $filter('date')($scope.startTransDate, "yyyy-MM-dd HH:mm:ss");
				end = $filter('date')($scope.endTransDate, "yyyy-MM-dd HH:mm:ss");
			}*/

			dataService.Get(url,onSalesSuccess,onSalesError,'application/json','application/json');
		};
		function onSalesSuccess(response)
		{
			if($scope.reportType == 'salesUser')
			{
				$scope.salesByUser = [];
				if(response.commonComparisonDtos !== null && response.commonComparisonDtos != '')
				{
					for(var i=0;i<response.commonComparisonDtos.length;i++)
					{
						$scope.salesByUser.push({
							"commanName": response.commonComparisonDtos[i].commanName,
							"quantity": Number(parseFloat(response.commonComparisonDtos[i].quantity)).toFixed(2),
							"tax":Number(parseFloat(response.commonComparisonDtos[i].tax)).toFixed(2),
							"salesTotal": Number(parseFloat(response.commonComparisonDtos[i].salesTotal)).toFixed(2),
							"avgSalesTotal": Number(parseFloat(response.commonComparisonDtos[i].avgSalesTotal)).toFixed(2),
							"profitAmount": Number(parseFloat(response.commonComparisonDtos[i].profitAmount)).toFixed(2),
							"markup": Number(parseFloat(response.commonComparisonDtos[i].markup)).toFixed(2),
							"discount": Number(parseFloat(response.commonComparisonDtos[i].discount)).toFixed(2),
							"perOfTotalProfit": Number(parseFloat(response.commonComparisonDtos[i].perOfTotalProfit)).toFixed(2)
						});
					}
					$scope.salesByUser.push({
						"commanName":"Total",
						"quantity": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalQuantity)).toFixed(2),
						"tax": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalTax)).toFixed(2),
						"salesTotal":Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalSales)).toFixed(2),
						"avgSalesTotal":"",
						"profitAmount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalProfit)).toFixed(2),
						"markup": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalMarkUp)).toFixed(2),
						"discount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalDiscount)).toFixed(2),
						"perOfTotalProfit": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalPer)).toFixed(2)
					});
				}
				else
				{
					$scope.salesByUser = [];
				}
			}
			else if($scope.reportType == 'salesCustomer')
			{
				$scope.salesByCustomer = [];
				if(response.commonComparisonDtos !== null && response.commonComparisonDtos != '')
				{
					for(var i=0;i<response.commonComparisonDtos.length;i++)
					{
						$scope.salesByCustomer.push({
							"commanName": response.commonComparisonDtos[i].commanName,
							"quantity": Number(parseFloat(response.commonComparisonDtos[i].quantity)).toFixed(2),
							"tax":Number(parseFloat(response.commonComparisonDtos[i].tax)).toFixed(2),
							"salesTotal": Number(parseFloat(response.commonComparisonDtos[i].salesTotal)).toFixed(2),
							"avgSalesTotal": Number(parseFloat(response.commonComparisonDtos[i].avgSalesTotal)).toFixed(2),
							"profitAmount": Number(parseFloat(response.commonComparisonDtos[i].profitAmount)).toFixed(2),
							"markup": Number(parseFloat(response.commonComparisonDtos[i].markup)).toFixed(2),
							"discount": Number(parseFloat(response.commonComparisonDtos[i].discount)).toFixed(2),
							"perOfTotalProfit": Number(parseFloat(response.commonComparisonDtos[i].perOfTotalProfit)).toFixed(2)
						});
					}
					$scope.salesByCustomer.push({
						"commanName":"Total",
						"quantity": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalQuantity)).toFixed(2),
						"tax": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalTax)).toFixed(2),
						"salesTotal":Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalSales)).toFixed(2),
						"avgSalesTotal":"",
						"profitAmount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalProfit)).toFixed(2),
						"markup": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalMarkUp)).toFixed(2),
						"discount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalDiscount)).toFixed(2),
						"perOfTotalProfit": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalPer)).toFixed(2)
					});
				}
				else
				{
					$scope.salesByCustomer= [];
				}
			}
			else if($scope.reportType == 'salesProduct')
			{
				$scope.salesByProduct = [];
				if(response.commonComparisonDtos !== null && response.commonComparisonDtos != '')
				{
					for(var i=0;i<response.commonComparisonDtos.length;i++)
					{
						$scope.salesByProduct.push({
							"commanName": response.commonComparisonDtos[i].commanName,
							"quantity": Number(parseFloat(response.commonComparisonDtos[i].quantity)).toFixed(2),
							"tax":Number(parseFloat(response.commonComparisonDtos[i].tax)).toFixed(2),
							"salesTotal": Number(parseFloat(response.commonComparisonDtos[i].salesTotal)).toFixed(2),
							"avgSalesTotal": Number(parseFloat(response.commonComparisonDtos[i].avgSalesTotal)).toFixed(2),
							"profitAmount": Number(parseFloat(response.commonComparisonDtos[i].profitAmount)).toFixed(2),
							"markup": Number(parseFloat(response.commonComparisonDtos[i].markup)).toFixed(2),
							"discount": Number(parseFloat(response.commonComparisonDtos[i].discount)).toFixed(2),
							"perOfTotalProfit": Number(parseFloat(response.commonComparisonDtos[i].perOfTotalProfit)).toFixed(2)
						});
					}
					$scope.salesByProduct.push({
						"commanName":"Total",
						"quantity": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalQuantity)).toFixed(2),
						"tax": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalTax)).toFixed(2),
						"salesTotal":Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalSales)).toFixed(2),
						"avgSalesTotal":"",
						"profitAmount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalProfit)).toFixed(2),
						"markup": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalMarkUp)).toFixed(2),
						"discount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalDiscount)).toFixed(2),
						"perOfTotalProfit": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalPer)).toFixed(2)
					});
				}
				else
				{
					$scope.salesByProduct= [];
				}
			}
			else if($scope.reportType == 'salesBrand')
			{
				$scope.salesByBrand = [];
				if(response.commonComparisonDtos !== null && response.commonComparisonDtos != '')
				{
					for(var i=0;i<response.commonComparisonDtos.length;i++)
					{
						$scope.salesByBrand.push({
							"commanName": response.commonComparisonDtos[i].commanName,
							"quantity": Number(parseFloat(response.commonComparisonDtos[i].quantity)).toFixed(2),
							"tax":Number(parseFloat(response.commonComparisonDtos[i].tax)).toFixed(2),
							"salesTotal": Number(parseFloat(response.commonComparisonDtos[i].salesTotal)).toFixed(2),
							"avgSalesTotal": Number(parseFloat(response.commonComparisonDtos[i].avgSalesTotal)).toFixed(2),
							"profitAmount": Number(parseFloat(response.commonComparisonDtos[i].profitAmount)).toFixed(2),
							"markup": Number(parseFloat(response.commonComparisonDtos[i].markup)).toFixed(2),
							"discount": Number(parseFloat(response.commonComparisonDtos[i].discount)).toFixed(2),
							"perOfTotalProfit": Number(parseFloat(response.commonComparisonDtos[i].perOfTotalProfit)).toFixed(2)
						});
					}
					$scope.salesByBrand.push({
						"commanName":"Total",
						"quantity": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalQuantity)).toFixed(2),
						"tax": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalTax)).toFixed(2),
						"salesTotal":Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalSales)).toFixed(2),
						"avgSalesTotal":"",
						"profitAmount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalProfit)).toFixed(2),
						"markup": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalMarkUp)).toFixed(2),
						"discount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalDiscount)).toFixed(2),
						"perOfTotalProfit": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalPer)).toFixed(2)
					});
				}
				else
				{
					$scope.salesByBrand= [];
				}
			}
			else if($scope.reportType == 'salesVendor')
			{
				$scope.salesByVendor = [];
				if(response.commonComparisonDtos !== null && response.commonComparisonDtos != '')
				{
					for(var i=0;i<response.commonComparisonDtos.length;i++)
					{
						$scope.salesByVendor.push({
							"commanName": response.commonComparisonDtos[i].commanName,
							"quantity": Number(parseFloat(response.commonComparisonDtos[i].quantity)).toFixed(2),
							"tax":Number(parseFloat(response.commonComparisonDtos[i].tax)).toFixed(2),
							"salesTotal": Number(parseFloat(response.commonComparisonDtos[i].salesTotal)).toFixed(2),
							"avgSalesTotal": Number(parseFloat(response.commonComparisonDtos[i].avgSalesTotal)).toFixed(2),
							"profitAmount": Number(parseFloat(response.commonComparisonDtos[i].profitAmount)).toFixed(2),
							"markup": Number(parseFloat(response.commonComparisonDtos[i].markup)).toFixed(2),
							"discount": Number(parseFloat(response.commonComparisonDtos[i].discount)).toFixed(2),
							"perOfTotalProfit": Number(parseFloat(response.commonComparisonDtos[i].perOfTotalProfit)).toFixed(2)
						});
					}
					$scope.salesByVendor.push({
						"commanName":"Total",
						"quantity": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalQuantity)).toFixed(2),
						"tax": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalTax)).toFixed(2),
						"salesTotal":Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalSales)).toFixed(2),
						"avgSalesTotal":"",
						"profitAmount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalProfit)).toFixed(2),
						"markup": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalMarkUp)).toFixed(2),
						"discount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalDiscount)).toFixed(2),
						"perOfTotalProfit": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalPer)).toFixed(2)
					});
				}
				else
				{
					$scope.salesByVendor= [];
				}
			}
			else if($scope.reportType == 'salesCategory')
			{
				$scope.salesByCategory = [];
				if(response.commonComparisonDtos !== null && response.commonComparisonDtos != '')
				{
					for(var i=0;i<response.commonComparisonDtos.length;i++)
					{
						$scope.salesByCategory.push({
							"commanName": response.commonComparisonDtos[i].commanName,
							"quantity": Number(parseFloat(response.commonComparisonDtos[i].quantity)).toFixed(2),
							"tax":Number(parseFloat(response.commonComparisonDtos[i].tax)).toFixed(2),
							"salesTotal": Number(parseFloat(response.commonComparisonDtos[i].salesTotal)).toFixed(2),
							"avgSalesTotal": Number(parseFloat(response.commonComparisonDtos[i].avgSalesTotal)).toFixed(2),
							"profitAmount": Number(parseFloat(response.commonComparisonDtos[i].profitAmount)).toFixed(2),
							"markup": Number(parseFloat(response.commonComparisonDtos[i].markup)).toFixed(2),
							"discount": Number(parseFloat(response.commonComparisonDtos[i].discount)).toFixed(2),
							"perOfTotalProfit": Number(parseFloat(response.commonComparisonDtos[i].perOfTotalProfit)).toFixed(2)
						});
					}
					$scope.salesByCategory.push({
						"commanName":"Total",
						"quantity": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalQuantity)).toFixed(2),
						"tax": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalTax)).toFixed(2),
						"salesTotal":Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalSales)).toFixed(2),
						"avgSalesTotal":"",
						"profitAmount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalProfit)).toFixed(2),
						"markup": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalMarkUp)).toFixed(2),
						"discount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalDiscount)).toFixed(2),
						"perOfTotalProfit": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalPer)).toFixed(2)
					});
				}
				else
				{
					$scope.salesByCategory= [];
				}
			}
			else if($scope.reportType == 'top50Selling')
			{
				$scope.salesByTop50 = [];
				if(response.commonComparisonDtos !== null && response.commonComparisonDtos != '')
				{
					for(var i=0;i<response.commonComparisonDtos.length;i++)
					{
						$scope.salesByTop50.push({
							"commanName": response.commonComparisonDtos[i].commanName,
							"quantity": Number(parseFloat(response.commonComparisonDtos[i].quantity)).toFixed(2),
							"tax":Number(parseFloat(response.commonComparisonDtos[i].tax)).toFixed(2),
							"salesTotal": Number(parseFloat(response.commonComparisonDtos[i].salesTotal)).toFixed(2),
							"avgSalesTotal": Number(parseFloat(response.commonComparisonDtos[i].avgSalesTotal)).toFixed(2),
							"profitAmount": Number(parseFloat(response.commonComparisonDtos[i].profitAmount)).toFixed(2),
							"markup": Number(parseFloat(response.commonComparisonDtos[i].markup)).toFixed(2),
							"discount": Number(parseFloat(response.commonComparisonDtos[i].discount)).toFixed(2),
							"perOfTotalProfit": Number(parseFloat(response.commonComparisonDtos[i].perOfTotalProfit)).toFixed(2)
						});
					}
					$scope.salesByTop50.push({
						"commanName":"Total",
						"quantity": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalQuantity)).toFixed(2),
						"tax": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalTax)).toFixed(2),
						"salesTotal":Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalSales)).toFixed(2),
						"avgSalesTotal":"",
						"profitAmount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalProfit)).toFixed(2),
						"markup": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalMarkUp)).toFixed(2),
						"discount": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalDiscount)).toFixed(2),
						"perOfTotalProfit": Number(parseFloat(response.finalTotalForCommonComparisonDtos[0].totalPer)).toFixed(2)
					});
				}
				else
				{
					$scope.salesByTop50= [];
				}
			}
		};
		function onSalesError(response)
		{

		};
		$scope.loadSalesHourlyData = function(hr)
		{
			var start,end;

			if(hr=='today')
			{
				start = getCurrentDay()+''+' 00:00:00';
				end = getCurrentDay()+''+' 23:59:59';
			}
			else if(hr == 'yest')
			{
				start = getPreviousDay()+''+' 00:00:00';
				end = getPreviousDay()+''+' 23:59:59';
			}
			else if(hr == 'lastWeek')
			{
					start = getLast7Day()+' 00:00:00';
					end = getCurrentDay()+' 23:59:59';
			}
			else if(hr == 'thisMonth')
			{
				start = getcurrentYear()+"-"+getcurrentMonth()+"-01 00:00:00";
				end = getcurrentYear()+"-"+getcurrentMonth()+"-31 23:59:59";
			}
			else if(hr == 'lastMonth')
			{
					start = getlastMonth()+" 00:00:00";
					end = getCurrentDay()+" 23:59:59";
			}
			else if(hr == 'last3Months')
			{
				start = getlast3Months()+" 00:00:00";
				end = getCurrentDay()+" 23:59:59";
			}
			else if(hr == 'last6Months')
			{
					start = getlast6Months()+" 00:00:00";
					end = getCurrentDay()+" 23:59:59";
			}
			else if(hr == 'thisYear')
			{
				var years = getCurrentandPreviousYear().split("-");
				start =years[0]+"-01-01 00:00:00";
				end =years[0]+"-12-31 23:59:59";
			}
			else if(hr == 'lastYear')
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
			var url=GlobalConstants.URLCONSTANTS+'getHourlyTransactionDetails?startDate='+start+'&endDate='+end;
			dataService.Get(url,onHourlySucces,onHourlyError,'application/json','application/json');


		}
		function onHourlySucces(response)
		{
			if(response.hourlyDtoList !== null) {
				$scope.hourlySummary = response.hourlyDtoList;
				$scope.hourlySummary.push({
					"hour": "Total",
					"debit": parseFloat(response.finalTotalForReportsDtoList[0].totalDebit).toFixed(2),
					"credit": parseFloat(response.finalTotalForReportsDtoList[0].totalCredit).toFixed(2),
					"cash": parseFloat(response.finalTotalForReportsDtoList[0].totalCash).toFixed(2),
					"check": parseFloat(response.finalTotalForReportsDtoList[0].totalCheck).toFixed(2),
					"tax": parseFloat(response.finalTotalForReportsDtoList[0].totalTax).toFixed(2),
					"discount": parseFloat(response.finalTotalForReportsDtoList[0].totalDiscount).toFixed(2),
					"returnAmount": parseFloat(response.finalTotalForReportsDtoList[0].totalReturn).toFixed(2),
					"profit": parseFloat(response.finalTotalForReportsDtoList[0].totalProfit).toFixed(2),
					"total": parseFloat(response.finalTotalForReportsDtoList[0].grandTotal).toFixed(2),
					"monthAvg": 0.0,
					"cost": 0.0,
					"retail": 0.0,
					"noOfTrans": parseFloat(response.finalTotalForReportsDtoList[0].noOfTrans).toFixed(2),
					"avgBasketSize": parseFloat(response.finalTotalForReportsDtoList[0].avgBasketSize).toFixed(2)});
			}
			else
				$scope.hourlySummary = [];

		}
		function onHourlyError(response)
		{

		}
		$scope.applyHourlyMonthly = function()
		{
			$scope.loadSalesHourlyData('');
		};

		$scope.loadSalesDailyData = function(day)
		{
			var start,end;
			if(day == 'thisDay')
			{
				start = getCurrentDay()+''+' 00:00:00';
				end = getCurrentDay()+''+' 23:59:59';
			}
			else if(day == 'lastDay')
			{
				start = getPreviousDay()+''+' 00:00:00';
				end = getPreviousDay()+''+' 23:59:59';
			}
			else
			{
				start = $filter('date')($scope.startTransDailyDate, "yyyy-MM-dd")+" 00:00:00";
				end = $filter('date')($scope.startTransDailyDate, "yyyy-MM-dd")+" 23:59:59";
			}
			var url=GlobalConstants.URLCONSTANTS+"getDailyTransactionDetails?startDate="+start+"&endDate="+end;
				dataService.Get(url,onDailySucces,onDailyError,'application/json','application/json');
		};
		function onDailySucces(response)
		{
				$scope.dailySummary = response;
		};

		function onDailyError(response)
		{

		};
		$scope.applyDailyMonthly = function()
		{
			$scope.loadSalesDailyData('');
		};
		$scope.getYearlyTransData = function ()
		{
			if($scope.yrlyTransType == 'thisYear')
			{
				var years = getCurrentandPreviousYear().split("-");
				var currentStartDate =years[0]+"-01-01 00:00:00";
				var currentEndDate =years[0]+"-12-31 23:59:59";
				loadSalesYearlyData(currentStartDate,currentEndDate);
			}
			else
			{
				var years = getCurrentandPreviousYear().split("-");
				var currentStartDate =years[1]+"-01-01 00:00:00";
				var currentEndDate =years[1]+"-12-31 23:59:59";
				loadSalesYearlyData(currentStartDate,currentEndDate);
			}
		}
		function loadSalesYearlyData(start,end)
		{
			var url=GlobalConstants.URLCONSTANTS+'getYearlyTransactionDetails?startDate='+start+'&endDate='+end;
			dataService.Get(url,onYearlySucces,onYearlyError,'application/json','application/json');

			
		}
		function onYearlySucces(response)
		{
			$scope.yearlySummary = [];
			if(response.yearlyListDtos !== null && response.yearlyListDtos !== '')
			{
				//$scope.yearlySummary = response.yearlyListDtos;
				for(var i=0;i<response.yearlyListDtos.length;i++)
				{
					$scope.yearlySummary.push({
						"monthName": response.yearlyListDtos[i].monthName,
						"debit": parseFloat(response.yearlyListDtos[i].debit).toFixed(2),
						"credit": parseFloat(response.yearlyListDtos[i].credit).toFixed(2),
						"cash": parseFloat(response.yearlyListDtos[i].cash).toFixed(2),
						"check": parseFloat(response.yearlyListDtos[i].check).toFixed(2),
						"tax": parseFloat(response.yearlyListDtos[i].tax).toFixed(2),
						"discount": parseFloat(response.yearlyListDtos[i].discount).toFixed(2),
						"returnAmount": parseFloat(response.yearlyListDtos[i].returnAmount).toFixed(2),
						"profit": parseFloat(response.yearlyListDtos[i].profit).toFixed(2),
						"total": parseFloat(response.yearlyListDtos[i].total).toFixed(2),
						"monthAvg": parseFloat(response.yearlyListDtos[i].monthAvg).toFixed(2),
						"cost": parseFloat(response.yearlyListDtos[i].cost).toFixed(2),
						"retail": parseFloat(response.yearlyListDtos[i].retail).toFixed(2),
						"noOfTrans": parseFloat(response.yearlyListDtos[i].noOfTrans).toFixed(2),
						"avgBasketSize": parseFloat(response.yearlyListDtos[i].avgBasketSize).toFixed(2)


					});
				}
				$scope.yearlySummary.push({
				"monthName": "Total",
					"debit": parseFloat(response.finalTotalForReportsDtos[0].totalDebit).toFixed(2),
				"credit": parseFloat(response.finalTotalForReportsDtos[0].totalCredit).toFixed(2),
				"cash": parseFloat(response.finalTotalForReportsDtos[0].totalCash).toFixed(2),
				"check": parseFloat(response.finalTotalForReportsDtos[0].totalCheck).toFixed(2),
				"tax": parseFloat(response.finalTotalForReportsDtos[0].totalTax).toFixed(2),
				"discount": parseFloat(response.finalTotalForReportsDtos[0].totalDiscount).toFixed(2),
				"returnAmount": parseFloat(response.finalTotalForReportsDtos[0].totalReturn).toFixed(2),
				"profit": parseFloat(response.finalTotalForReportsDtos[0].totalProfit).toFixed(2),
				"total": parseFloat(response.finalTotalForReportsDtos[0].grandTotal).toFixed(2),
				"monthAvg": 0.0,
				"cost": 0.0,
				"retail": 0.0,
				"noOfTrans": parseFloat(response.finalTotalForReportsDtos[0].noOfTrans).toFixed(2),
				"avgBasketSize": parseFloat(response.finalTotalForReportsDtos[0].avgBasketSize).toFixed(2)});
			}
			//$scope.yearlySummary = response.yearlyListDtos;

		}
		function onYearlyError(response)
		{
			
		}

		$scope.loadSalesMonthlyData = function(month)
		{
			var startDate,endDate;
			var years = getCurrentandPreviousYear().split("-");
			if(month == 'Jan')
			{
				startDate = years[0]+'-01-01 00:00:000';
				endDate = years[0]+'-01-31 23:59:59';
			}
			else if(month == 'Feb')
			{
				startDate = years[0]+'-02-01 00:00:000';
				endDate = years[0]+'-02-31 23:59:59';
			}
			else if(month == 'Mar')
			{
				startDate = years[0]+'-03-01 00:00:000';
				endDate = years[0]+'-03-31 23:59:59';
			}
			else if(month == 'Apr')
			{
				startDate = years[0]+'-04-01 00:00:000';
				endDate = years[0]+'-04-31 23:59:59';
			}
			else if(month == 'May')
			{
				startDate = years[0]+'-05-01 00:00:000';
				endDate = years[0]+'-05-31 23:59:59';
			}
			else if(month == 'Jun')
			{
				startDate = years[0]+'-06-01 00:00:000';
				endDate = years[0]+'-06-31 23:59:59';
			}
			else if(month == 'Jul')
			{
				startDate = years[0]+'-07-01 00:00:000';
				endDate = years[0]+'-07-31 23:59:59';
			}
			else if(month == 'Aug')
			{
				startDate = years[0]+'-08-01 00:00:000';
				endDate = years[0]+'-08-31 23:59:59';
			}
			else if(month == 'Sep')
			{
				startDate = years[0]+'-09-01 00:00:000';
				endDate = years[0]+'-09-31 23:59:59';
			}
			else if(month == 'Oct')
			{
				startDate = years[0]+'-10-01 00:00:000';
				endDate = years[0]+'-10-31 23:59:59';
			}
			else if(month == 'Nov')
			{
				startDate = years[0]+'-11-01 00:00:000';
				endDate = years[0]+'-11-31 23:59:59';
			}
			else if(month == 'Dec')
			{
				startDate = years[0]+'-12-01 00:00:000';
				endDate = years[0]+'-12-31 23:59:59';
			}
			else
			{
				startDate = $filter('date')($scope.startTransDate, "yyyy-MM-dd")+" 00:00:00";
				endDate = $filter('date')($scope.endTransDate, "yyyy-MM-dd")+" 23:59:59";
			}
			var url=GlobalConstants.URLCONSTANTS+'getMonthlyTransactionDetails?startDate='+startDate+'&endDate='+endDate;
			dataService.Get(url,onMonthlySucces,onMonthlyError,'application/json','application/json');
			//onMonthlySucces('');
			
		}
		$scope.applyFilterMonthly = function()
		{
			$scope.loadSalesMonthlyData('');
		};
		function onMonthlySucces(response)
		{
			if(response.monthDtos !== '' && response.monthDtos !== null)
			{
				$scope.monthlySummary = response.monthDtos;
				$scope.monthlySummary.push({
					"date": "Total",
					"debit": parseFloat(response.finalTotalForReportsDtos[0].totalDebit).toFixed(2),
					"credit": parseFloat(response.finalTotalForReportsDtos[0].totalCredit).toFixed(2),
					"cash": parseFloat(response.finalTotalForReportsDtos[0].totalCash).toFixed(2),
					"check": parseFloat(response.finalTotalForReportsDtos[0].totalCheck).toFixed(2),
					"tax": parseFloat(response.finalTotalForReportsDtos[0].totalTax).toFixed(2),
					"discount": parseFloat(response.finalTotalForReportsDtos[0].totalDiscount).toFixed(2),
					"returnAmount": parseFloat(response.finalTotalForReportsDtos[0].totalReturn).toFixed(2),
					"profit": parseFloat(response.finalTotalForReportsDtos[0].totalProfit).toFixed(2),
					"total": parseFloat(response.finalTotalForReportsDtos[0].grandTotal).toFixed(2),
					"monthAvg": 0.0,
					"cost": 0.0,
					"retail": 0.0,
					"noOfTrans": parseFloat(response.finalTotalForReportsDtos[0].noOfTrans).toFixed(2),
					"avgBasketSize": parseFloat(response.finalTotalForReportsDtos[0].avgBasketSize).toFixed(2)});
			}


		}
		function onMonthlyError(response)
		{
			
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
	}
		
})();