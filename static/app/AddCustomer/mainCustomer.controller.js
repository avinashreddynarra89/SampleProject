(function() {
	'use strict';

	angular.module('sampleApp').controller('mainCustomerController', mainCustomerController);

	mainCustomerController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','$state','DialogFactory','$timeout','dataService','RestrictedCharacter.Types','GlobalConstants'];

	function mainCustomerController($scope, $rootScope, device ,GlobalVariable,$state,DialogFactory,$timeout,dataService,restrictCharacter,GlobalConstants) {
		
		$scope.device = device;
		$scope.GlobalVariable = GlobalVariable;
		GlobalVariable.isLoginPage = false;
		$scope.restrictCharacter = restrictCharacter;

		function getCustomerDetails()
		{
			var url=GlobalConstants.URLCONSTANTS+'getCustomerDetail';
			dataService.Get(url,onGetCustDtlsSuccess,onGetCustDtlsError,'application/json','application/json');
		}
		function onGetCustDtlsSuccess(response)
		{
				$scope.customerData = response;

		}
		function onGetCustDtlsError(response)
		{

		}
		$scope.addNewCustomerDetails = function()
		{
			GlobalVariable.editCustomer = false;
			var _tmPath = 'app/AddCustomer/addcustomer.html';
			var _ctrlPath = 'addCustomerController';
			DialogFactory.show(_tmPath, _ctrlPath, callbackAddCustomer);
		};
		function callbackAddCustomer()
		{
			getCustomerDetails();
			$timeout(function() {
				$scope.closeBootstrapAlert();
			}, 9000);
		}
		$scope.closeBootstrapAlert = function()
		{
			GlobalVariable.successCustAlert = false;
			GlobalVariable.addedCustSuccessfull = false;
			GlobalVariable.editCustSuccess = false;
		};
		$scope.editCustomerDetails = function(row)
		{
			GlobalVariable.editedFirstName = row.onlyFirstName;
			GlobalVariable.editedLastName = row.lastName;
			GlobalVariable.editedPhone = row.phoneNo;
			GlobalVariable.editedFEmail = row.email;
			GlobalVariable.editedDOB = row.dateOfBirth;
			GlobalVariable.editedGender = row.gender;
			GlobalVariable.editedStreet =row.street;
			 GlobalVariable.editedCity = row.city;
			GlobalVariable.editedState =row.state;
			 GlobalVariable.editedCountry = row.country;
			GlobalVariable.editedCode =row.zipcode;
			GlobalVariable.editedCusyType = row.customerType;
			GlobalVariable.editedcompanyName = row.companyName;
			GlobalVariable.editedtaxId = row.taxId;
			GlobalVariable.editedcustomerId = row.customerId;

			GlobalVariable.editCustomer = true;
			var _tmPath = 'app/AddCustomer/addcustomer.html';
			var _ctrlPath = 'addCustomerController';
			DialogFactory.show(_tmPath, _ctrlPath, callbackAddCustomer);
		};
		$scope.barLimit = 50;
		$scope.increaseLimit = function () {
			$scope.barLimit += 50;
			console.log('Increase Bar Limit', $scope.barLimit)
		}
		function render()
		{

			getCustomerDetails();

				
		}
		render();
		
	}
		
})();