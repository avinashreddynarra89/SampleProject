(function() {
	'use strict';

	angular.module('sampleApp').controller('CreateUserController', CreateUserController);

	CreateUserController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','dataService','util','GlobalConstants','RestrictedCharacter.Types'];

	function CreateUserController($scope, $rootScope, device ,GlobalVariable,DialogFactory,dataService,util,GlobalConstants,restrictCharacter)
	{
		$scope.GlobalVariable = GlobalVariable;
		var authElemArray = new Array();
		$scope.restrictCharacter=restrictCharacter;
		//GlobalVariable.editUser = false;
		$scope.closeCreateUser = function()
		{
			DialogFactory.close(true);
		};
		$scope.addUser = function()
		{
			var request = {};
			request =   {
				"username": $scope.userName,
				"password": $scope.newPassword,
				"userRole": $scope.userRole,
				"createdDate": js_yyyy_mm_dd_hh_mm_ss (),
				"horlyRate":$scope.hrlyRate.replace('$','').replace(/,/g,''),
				"userCommissionPercentage":$scope.comPer
			}
			request = JSON.stringify(request);
			var url=GlobalConstants.URLCONSTANTS+"addUser";
			dataService.Post(url,request,onAddUserSuccess,onAddUserError,'application/json','application/json');
		}
		$scope.editUser = function()
		{
			util.customError.hide(['newRePassword']);
			authElemArray = new Array();
			if($scope.newPassword !=  $scope.newRePassword)
			{
				authElemArray.push({
					'id' : 'newRePassword',
					'msg' : 'Password and Confirm Passwors donot match'
				});
			}
			if (authElemArray.length >= 1) {
				util.customError.show(authElemArray, "");

				return false;
			} else {
				var request = {};
				request =   {
					"username": $scope.userName,
					"password": $scope.newPassword,
					"userRole": $scope.userRole,
					"userId":GlobalVariable.editUserId,
					"horlyRate":$scope.hrlyRate.replace('$','').replace(/,/g,''),
					"userCommissionPercentage":$scope.comPer
				};
				request = JSON.stringify(request);
				var url=GlobalConstants.URLCONSTANTS+"editUser";
				dataService.Post(url,request,onEditUserSuccess,onEditUserError,'application/json','application/json');
			}

		};
		function onEditUserSuccess(response)
		{
			DialogFactory.close(true);
			GlobalVariable.successUsesAlert = true;
			GlobalVariable.editSuccess = true;
		}
		function onEditUserError()
		{
			DialogFactory.close(true);
			GlobalVariable.successUsesAlert = false;
			GlobalVariable.editSuccess = false;
		}
		function onAddUserSuccess(response)
		{
			DialogFactory.close(true);
			GlobalVariable.successUsesAlert = true;
			GlobalVariable.addedSuccessfull = true;
		}
		function onAddUserError(response)
		{
			DialogFactory.close(true);
			GlobalVariable.successUsesAlert = false;
			GlobalVariable.addedSuccessfull = false;
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
		function render()
		{
			if(GlobalVariable.editUser == true)
			{
					$scope.userName = GlobalVariable.edituserName;
					$scope.password = GlobalVariable.editPassword;
					$scope.userRole = GlobalVariable.editUserRole;
					$scope.createdDate = GlobalVariable.editCreatedDate;
					$scope.hrlyRate = "$"+GlobalVariable.editHrlyRate;
					$scope.lastName = GlobalVariable.editComPer;
				$scope.comPer = GlobalVariable.editComPer;
			}
		}
		render();
	}
		
})();