(function() {
	'use strict';

	angular.module('sampleApp').controller('ClockInController', ClockInController);

	ClockInController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','RestrictedCharacter.Types','dataService','util','modalService'];

	function ClockInController($scope, $rootScope, device ,GlobalVariable,DialogFactory,restrictCharacter,dataService,util,modalService)
	{
		$scope.GlobalVariable = GlobalVariable;
		$scope.restrictCharacter=restrictCharacter;
		$scope.alreadtClockedIn = false;
		$scope.clockedInTime = '';
		var authElemArray = new Array();
		$scope.showError = false;
		$scope.closeClock = function()
		{
			DialogFactory.close(true);
		};
		function render()
		{
			//getClockInDetails();
			$scope.clockedInTime= '';
			GlobalVariable.userNameClock = null;
			GlobalVariable.pwdClock='';
		}
		$scope.getClockInDetails =function()
		{
				var url='http://localhost:8080/getUserClockIn?username='+GlobalVariable.userNameClock+'&date='+getCurrentDay();
				dataService.Get(url,onGetClockSuccess,onGetClockError,'application/json','application/json');
		}
		function onGetClockSuccess(response)
		{
			if(response.length == 0)
			{
				$scope.alreadtClockedIn = false;
				$scope.userClockedIn = false;
				$scope.clockedInTime = '';
				//GlobalVariable.userNameClock = '';
			}
			else
			{
				if(response[0].clockInTime !== null && response[0].clockOutTime == null)
				{
					$scope.alreadtClockedIn = false;
					$scope.userClockedIn = true;
					$scope.clockedInTime = response[0].clockInTime;
					GlobalVariable.userNameClock = response[0].username;
					$scope.clockInId = response[0].clockInId;
					var date1 = new Date($scope.clockedInTime);
					var date2 = new Date(js_yyyy_mm_dd_hh_mm_ss());
					var hours = Number(Math.abs(date1 - date2) / 36e5).toFixed(2);
					$scope.hrWorked = hours;
				}
				else if(response[0].clockInTime !== null && response[0].clockOutTime !== null)
				{
					$scope.alreadtClockedIn = true;
				}
				else
				{
					$scope.alreadtClockedIn = false;
					$scope.userClockedIn = false;
					$scope.clockedInTime = '';
					GlobalVariable.userNameClock = null;
				}
			}


		}
		function onGetClockError(response)
		{

		}
		$scope.addClockOut = function()
		{
			$scope.showError = false;
			util.customError.hide(['userName','pwdClock']);
			authElemArray = new Array();
			if(GlobalVariable.userNameClock == '' || GlobalVariable.userNameClock== undefined)
			{
				authElemArray.push({
					'id' : 'userName',
					'msg' : 'Please select user name'
				});
			}
			if(GlobalVariable.pwdClock == undefined || GlobalVariable.pwdClock == '')
			{
				authElemArray.push({
					'id' : 'pwdClock',
					'msg' : 'Password cannot be blank'
				});
			}
			if (authElemArray.length >= 1) {
				util.customError.show(authElemArray, "");

				return false;
			} else {
				var date1 = new Date($scope.clockedInTime );
				var date2 = new Date(js_yyyy_mm_dd_hh_mm_ss());
				var hours = Number(Math.abs(date1 - date2) / 36e5).toFixed(2);
				var url='http://localhost:8080/addUserClockOut';
				var request = {
					"clockInId":$scope.clockInId,
					"username":GlobalVariable.userNameClock,
					"password":GlobalVariable.pwdClock,
					"clockOutTime":js_yyyy_mm_dd_hh_mm_ss(),
					"date":getCurrentDay(),
					"noOfhours":hours,
				};
				request=JSON.stringify(request);
				dataService.Post(url,request,onremoveClockSuccess,onremoveClockError,'application/json','application/json');
			}
		};
		function onremoveClockSuccess(response)
		{
			if(response ==  true)
			{
				$scope.alreadtClockedIn = false;
				$scope.userClockedIn = false;
				$scope.clockedInTime = '';
				GlobalVariable.userNameClock = null;
				GlobalVariable.pwdClock = '';
				$scope.showError = false;
				DialogFactory.close(true);
				modalService.showModal('', '', "User Clocked Out Successfully", $scope.callBackSuccess);

			}
			else
			{
				$scope.showError=true;
			}
		}
		function onremoveClockError(response)
		{

		}
		$scope.addClockIn = function()
		{
			$scope.showError = false;
			util.customError.hide(['userName','pwdClock']);
			authElemArray = new Array();
			if(GlobalVariable.userNameClock == '' || GlobalVariable.userNameClock== undefined)
			{
				authElemArray.push({
					'id' : 'userName',
					'msg' : 'Please select user name'
				});
			}
			if(GlobalVariable.pwdClock == undefined || GlobalVariable.pwdClock == '')
			{
				authElemArray.push({
					'id' : 'pwdClock',
					'msg' : 'Password cannot be blank'
				});
			}
			if (authElemArray.length >= 1) {
				util.customError.show(authElemArray, "");

				return false;
			} else {
				var url='http://localhost:8080/addUserClockIn';
				var request = {
					"username":GlobalVariable.userNameClock,
					"password":GlobalVariable.pwdClock,
					"clockInTime":js_yyyy_mm_dd_hh_mm_ss(),
					"date":getCurrentDay()
				};
				request=JSON.stringify(request);
				dataService.Post(url,request,onAddClockSuccess,onAddClockError,'application/json','application/json');
			}

		};
		function onAddClockSuccess(response)
		{
				if(response ==  true)
				{

					$scope.showError = false;
					DialogFactory.close(true);
					modalService.showModal('', '', "User Clocked In Successfully", $scope.callBackSuccess);

				}
				else
				{
					$scope.showError=true;
				}
		}
		function onAddClockError(response)
		{

		}
		$scope.callBackSuccess = function(ok)
		{
			if(ok)
			{
				DialogFactory.close(true);
			}
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
		render();
	}
		
})();