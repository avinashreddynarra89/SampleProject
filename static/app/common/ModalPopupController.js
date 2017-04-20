(function() {
	"use strict";

	angular.module('sampleApp').controller('ModalPopupController', ModalPopup);

	ModalPopup.$inject = [ '$scope', '$sce', 'DialogFactory', 'scopeOptions', 'GlobalVariable' ];

	function ModalPopup($scope, $sce, dialog, scopeOptions, GlobalVariable) {
		$scope.showModalFooter = scopeOptions.isOK;
		$scope.showModalOK = scopeOptions.isOK;
		$scope.showModalCancel = scopeOptions.isCancel;
		$scope.titleText = (scopeOptions.title != undefined) ? scopeOptions.title : "";
		$scope.okBtnLabel = (scopeOptions.okBtnLabel != undefined) ? scopeOptions.okBtnLabel : "Ok";
		$scope.isCenterAlign = (scopeOptions.isCenterAlign != undefined) ? scopeOptions.isCenterAlign : false;
		if (GlobalVariable.getTransactions != undefined) {
			$scope.receiptDetails = GlobalVariable.getTransactions.receiptDetails;
		}

		function render() {
			$scope.popupContent = $sce.trustAsHtml(scopeOptions.modalMsg);
		}

		$scope.closeModal = function(result) {
			dialog.close(result);
		};

		render();
	}

})();