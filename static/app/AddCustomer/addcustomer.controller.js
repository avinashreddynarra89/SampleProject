(function() {
	'use strict';

	angular.module('sampleApp').controller('addCustomerController', addCustomerController);

	addCustomerController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','dataService','util','RestrictedCharacter.Types','getProductDetails','StateResponse','$filter','GlobalConstants'];

	function addCustomerController($scope, $rootScope, device ,GlobalVariable,DialogFactory,dataService,util,restrictCharacter,getProductDetails,StateResponse,$filter,GlobalConstants)
	{
		GlobalVariable.addedCustSuccessfull = false;
		GlobalVariable.successCustAlert = false;
		GlobalVariable.editCustSuccess = false;
		$scope.restrictCharacter = restrictCharacter;
		$scope.GlobalVariable = GlobalVariable;
		var authElemArray = new Array();
		$scope.closePopup = function()
		{
			DialogFactory.close(true);
		};
		$scope.openEndCalendar = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.openEnd = true;
		};
		$scope.onDateSelected = function(startDate, endDate, label, element) {
			var receiptIndex = element.attr('data-receipt-index');
			element.find('span').eq(0).html(endDate.format('dd-MM-yyyy'));
		};
		$scope.validations = function()
		{
			authElemArray = new Array();
			if($scope.firstName == '' || $scope.firstName == undefined)
			{
				authElemArray.push({
					'id' : 'firstName',
					'msg' : 'First Name cannot be empty'
				});
			}
			if($scope.phoneNumber == '' || $scope.phoneNumber == undefined)
			{
				authElemArray.push({
					'id' : 'phoneNumber',
					'msg' : 'Phone Number cannot be empty'
				});
			}

			if(GlobalVariable.editCustomer == false)
			{
				for(var i=0;i<GlobalVariable.getCustomerDtls.length;i++)
				{
					if($scope.phoneNumber == GlobalVariable.getCustomerDtls[i].phoneNo)
					{
						authElemArray.push({
							'id' : 'phoneNumber',
							'msg' : 'Phone Number already exists'
						});
					}
				}
			}
			{
				if((GlobalVariable.editedPhone !== $scope.phoneNumber)&&(GlobalVariable.editCustomer == true)) {
					for (var i = 0; i < GlobalVariable.getCustomerDtls.length; i++) {
						if ($scope.phoneNumber == GlobalVariable.getCustomerDtls[i].phoneNo) {
							authElemArray.push({
								'id': 'phoneNumber',
								'msg': 'Phone Number already exists'
							});
						}
					}
				}
			}


			if (authElemArray.length >= 1) {
				util.customError.show(authElemArray, "");

				return false;
			} else {
				return true;
			}
		};
		$scope.createNewCustomer = function()
		{
			util.customError.hide(['firstName','phoneNumber']);
			if($scope.validations()) {
				var request = {};
				request = {
					"onlyFirstName": $scope.firstName,
					"firstName":$scope.firstName,
					"lastName": $scope.lastName,
					"phoneNo": $scope.phoneNumber,
					"email": $scope.email,
					"dateOfBirth": $filter('date')($scope.DOB, "yyyy-MM-dd"),
					"customerType": $scope.custType,
					"gender": $scope.gender,
					"street": $scope.street,
					"city": $scope.City,
					"state": $scope.State,
					"country": $scope.Country,
					"zipcode": $scope.postalCode,
					"fax": null,
					"customerCreatedDate": js_yyyy_mm_dd_hh_mm_ss(),
					"balance": 0,
					"taxId":$scope.taxId,
					"companyName":$scope.companyName
				};
				request = JSON.stringify(request);
				var url = GlobalConstants.URLCONSTANTS+'addCustomer';
				dataService.Post(url, request, onAddCustDtlsSuccess, onAddCustDtlsError, 'application/json', 'application/json');
			}

		};
		$scope.editNewCustomer = function()
		{
			util.customError.hide(['firstName','phoneNumber']);
			var request = {};
			if($scope.validations()) {
				request = {
					"customerId": GlobalVariable.editedcustomerId,
					"onlyFirstName": $scope.firstName,
					"firstName": $scope.firstName,
					"lastName": $scope.lastName,
					"phoneNo": $scope.phoneNumber,
					"oldPhoneNo": GlobalVariable.editedPhone,
					"email": $scope.email,
					"dateOfBirth": $filter('date')($scope.DOB, "yyyy-MM-dd"),
					"customerType": $scope.custType,
					"gender": $scope.gender,
					"street": $scope.street,
					"city": $scope.City,
					"state": $scope.State,
					"country": $scope.Country,
					"zipcode": $scope.postalCode,
					"fax": "TestFax",
					"customerCreatedDate": js_yyyy_mm_dd_hh_mm_ss(),
					"taxId": $scope.taxId,
					"companyName": $scope.companyName
				};

				request = JSON.stringify(request);
				var url = GlobalConstants.URLCONSTANTS+'editCustomer';
				dataService.Post(url, request, onEditCustDtlsSuccess, onEditCustDtlsError, 'application/json', 'application/json');
			}
		};
		function onEditCustDtlsSuccess(response)
		{
			DialogFactory.close(true);
			GlobalVariable.editCustSuccess = true;
			GlobalVariable.successCustAlert = true;
		}
		function onEditCustDtlsError(response)
		{
			DialogFactory.close(true);
			GlobalVariable.editCustSuccess = false;
			GlobalVariable.successCustAlert = false;
		}
		function onAddCustDtlsSuccess(response)
		{
			DialogFactory.close(true);
			GlobalVariable.addedCustSuccessfull = true;
			GlobalVariable.successCustAlert = true;
			getProductDetails.getCustomerDetails();
		}
		function onAddCustDtlsError(response)
		{
			DialogFactory.close(true);
			GlobalVariable.addedCustSuccessfull = false;
			GlobalVariable.successCustAlert = false;
		}
		function render()
		{
			$scope.custType = 'Retail';
			$scope.gender = "Male";
			$scope.dateRangeOptions = {
				//startDate : moment(),
				showDropdowns : true,
				format : 'dd-MM-yyyy',
				singleDatePicker : true
			};
			if(GlobalVariable.editCustomer == true)
			{
				$scope.firstName = GlobalVariable.editedFirstName;
				 $scope.lastName = GlobalVariable.editedLastName;
				$scope.phoneNumber = GlobalVariable.editedPhone;
				$scope.email= GlobalVariable.editedFEmail;
				$scope.DOB = GlobalVariable.editedDOB;
				$scope.custType = GlobalVariable.editedCusyType
				$scope.gender = GlobalVariable.editedGender;
				$scope.street = GlobalVariable.editedStreet;
				$scope.City = GlobalVariable.editedCity;
				 $scope.State = GlobalVariable.editedState;
				$scope.Country = GlobalVariable.editedCountry;
				$scope.postalCode = GlobalVariable.editedCode;
				$scope.companyName = GlobalVariable.editedcompanyName;
				$scope.taxId = GlobalVariable.editedtaxId	;
			}

			$scope.stateOptions = StateResponse.stateResponse.Response.stateDetail;
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