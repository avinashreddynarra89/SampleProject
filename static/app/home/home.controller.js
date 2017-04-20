(function() {
	'use strict';

	angular.module('sampleApp').controller('HomeController', HomeController);

	HomeController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','dataService','$window','$filter','$timeout','RestrictedCharacter.Types','GlobalConstants'];

	function HomeController($scope, $rootScope, device ,GlobalVariable,DialogFactory,dataService,$window,$filter,$timeout,restrictCharacter,GlobalConstants)
	{
		GlobalVariable.isLoginPage = false;
		$scope.restrictCharacter=restrictCharacter;
		$scope.totalRevenueData=[];
		$scope.revData=[];
		$scope.labels = [];
		$scope.prevRevData=[];
		$scope.cashData=[];
		$scope.cData=[];$scope.cDataPrev=[];
		$scope.creditData=[];
		$scope.crData =[];$scope.crDataPrev=[];
		$scope.profitData=[];
		$scope.pData=[];$scope.pDataPrev=[];
		$scope.taxData1=[];
		$scope.taxData=[];$scope.taxDataPrev=[];;
		$scope.discData1=[];
		$scope.discData=[];$scope.discDataPrev=[];
		$scope.transData=[];
		$scope.nData=[];$scope.nDataPrev=[];
		$scope.debitData=[];
		$scope.nvgData=[];$scope.nvgDataPrev=[];
		var date = new Date();
	    $scope.series = [date.getFullYear(), date.getFullYear()-1];
	    $scope.onClick = function (points, evt) {
	      console.log(points, evt);
	    };
	    $scope.onHover = function (points) {
	      if (points.length > 0) {
	        //console.log('Point', points[0].value);
	      } else {
	        //console.log('No point');
	      }
	    };
	    
		function render()
		{
			$scope.dashboardDrop = 'monthWiseDash';
			$scope.getDashboardDetails();
		}
		$scope.getDashboardDetails = function()
		{
			var url;
			var years = getCurrentandPreviousYear().split("-");
			var currentStartDate =years[0]+"-01-01 00:00:00";
			var currentEndDate =years[0]+"-12-31 23:59:59";
			$scope.previousStartDate = years[1]+"-01-01 00:00:00";
			$scope.previousEndDate = years[1]+"-12-31 23:59:59";
			
			if($scope.dashboardDrop == 'monthWiseDash')
			{

				url = GlobalConstants.URLCONSTANTS+"getYearlyTransactionDetails?startDate="+currentStartDate+"&endDate="+currentEndDate;
				
				dataService.Get(url,getReportsMonthlySuccessHandler,getReportsMonthlyErrorHandler,'application/json','application/json');
				
			}
			else
			{
				var currentDayStartDate = years[0]+"-"+getCurrentMonth()+"-01 00:00:00";
				var currentDayEndDate = years[0]+"-"+getCurrentMonth()+"-07 23:59:59";
				
				var previousDayStartDate = years[1]+"-"+getCurrentMonth()+"-01 00:00:00";
				var previousDayEndDate = years[1]+"-"+getCurrentMonth()+"-07 23:59:59";
			}	
		};
		function getReportsMonthlyPrevSuccessHandler(response)
		{
			$scope.monthlyPrevResponse = response;
			if($scope.monthlyPrevResponse.yearlyListDtos == null)
			{
				$scope.monthlyPrevResponse = {
											"finalTotalForReportsDtos": [{
												"totalCredit": 0,
												"totalCash": 0,
												"totalCheck": 0,
												"totalTax": 0,
												"totalDiscount": 0,
												"grandTotal": 0,
												"totalProfit": 0,
												"totalReturn": 0.0,
												"avgMargin": 0.0,
												"noOfTrans": 0,
												"avgBasketSize": 0
											}],
											"yearlyListDtos":[]
										};
				for(var i=0;i<12;i++)
				{
					$scope.monthlyPrevResponse.yearlyListDtos.push({
							"total":0,
							"credit":0,
							"cash":0,
							"tax":0,
							"discount":0,
							"profit":0,
							"noOfTrans":0,
							"avgBasketSize":0
					});
				}
			}

				for(var i=0;i<$scope.monthlyPrevResponse.yearlyListDtos.length;i++)
				{

					$scope.prevRevData.push($scope.monthlyPrevResponse.yearlyListDtos[i].total);
					$scope.cDataPrev.push($scope.monthlyPrevResponse.yearlyListDtos[i].cash);
					$scope.crDataPrev.push($scope.monthlyPrevResponse.yearlyListDtos[i].credit);
					$scope.pDataPrev.push($scope.monthlyPrevResponse.yearlyListDtos[i].profit);
					$scope.taxDataPrev.push($scope.monthlyPrevResponse.yearlyListDtos[i].tax);
					$scope.discDataPrev.push($scope.monthlyPrevResponse.yearlyListDtos[i].discount);
					$scope.nDataPrev.push($scope.monthlyPrevResponse.yearlyListDtos[i].noOfTrans);
					$scope.nvgDataPrev.push($scope.monthlyPrevResponse.yearlyListDtos[i].totalDebit);
				}
				$scope.totalRevenueData.push($scope.prevRevData);
				$scope.cashData.push($scope.cDataPrev);
				$scope.creditData.push($scope.crDataPrev);
				$scope.profitData.push($scope.pDataPrev);
				$scope.taxData.push($scope.taxDataPrev);
				$scope.discData.push($scope.discDataPrev);
				$scope.transData.push($scope.nDataPrev);
				$scope.debitData.push($scope.nvgDataPrev);
		}
		function getReportsMonthlyPrevErrorHandler()
		{
			
		}
		function getReportsMonthlySuccessHandler(response)
		{
			
			$scope.monthlyResponse = response;
			if($scope.monthlyResponse.yearlyListDtos == null)
			{
				$scope.monthlyResponse = {
					"finalTotalForReportsDtos": [{
						"totalCredit": 0,
						"totalCash": 0,
						"totalCheck": 0,
						"totalTax": 0,
						"totalDiscount": 0,
						"grandTotal": 0,
						"totalProfit": 0,
						"totalReturn": 0.0,
						"avgMargin": 0.0,
						"noOfTrans": 0,
						"avgBasketSize": 0
					}],
					"yearlyListDtos":[]
				};
				for(var i=0;i<12;i++)
				{
					$scope.monthlyResponse.yearlyListDtos.push({
						"total":0,
						"credit":0,
						"cash":0,
						"tax":0,
						"discount":0,
						"profit":0,
						"noOfTrans":0,
						"avgBasketSize":0
					});
				}
			}

				for(var i=0;i<$scope.monthlyResponse.yearlyListDtos.length;i++)
				{
					$scope.revData.push($scope.monthlyResponse.yearlyListDtos[i].total);
					$scope.cData.push($scope.monthlyResponse.yearlyListDtos[i].cash);
					$scope.crData.push($scope.monthlyResponse.yearlyListDtos[i].credit);
					$scope.pData.push($scope.monthlyResponse.yearlyListDtos[i].profit);
					$scope.taxData1.push($scope.monthlyResponse.yearlyListDtos[i].tax);
					$scope.discData1.push($scope.monthlyResponse.yearlyListDtos[i].discount);
					$scope.nData.push($scope.monthlyResponse.yearlyListDtos[i].noOfTrans);
					$scope.nvgData.push($scope.monthlyResponse.yearlyListDtos[i].debit);
				}
				$scope.totalRevenueData.push($scope.revData);
				$scope.cashData.push($scope.cData);
				$scope.creditData.push($scope.crData);
				$scope.profitData.push($scope.pData);
				$scope.taxData.push($scope.taxData1);
				$scope.discData.push($scope.discData1);
				$scope.transData.push($scope.nData);
				$scope.debitData.push($scope.nvgData);
			for(var i=0;i<$scope.monthlyResponse.yearlyListDtos.length;i++)
			{
				$scope.labels.push($scope.monthlyResponse.yearlyListDtos[i].monthName);
			}


			var urlPreviuos = GlobalConstants.URLCONSTANTS+"getYearlyTransactionDetails?startDate="+$scope.previousStartDate+"&endDate="+$scope.previousEndDate;
			dataService.Get(urlPreviuos,getReportsMonthlyPrevSuccessHandler,getReportsMonthlyPrevErrorHandler,'application/json','application/json');
			
			
		}
		function getReportsMonthlyErrorHandler(response)
		{
			
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