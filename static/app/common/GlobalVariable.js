(function() {
	'use strict';

	angular.module('sampleApp').factory('GlobalVariable', Global);

	Global.$inject = [];

	function Global() {
		var GlobalVarObj = {
		};
		GlobalVarObj.isLoginPage = true;
		GlobalVarObj.editProduct = false;
		GlobalVarObj.returnProduct = false;
		GlobalVarObj.productSuccessAlert = false;
		GlobalVarObj.addedSucces= false;
		GlobalVarObj.editedSuccess= false;
		GlobalVarObj.isPrintPage = false;
		GlobalVarObj.editUser == false;
		GlobalVarObj.editTax = false;
		GlobalVarObj.editCustomer = false;
		GlobalVarObj.onAddProduct = '';
		GlobalVarObj.addProductClicked= false;
		GlobalVarObj.onlineTransactionCompId = '';
		
		return GlobalVarObj;
	}
})();
