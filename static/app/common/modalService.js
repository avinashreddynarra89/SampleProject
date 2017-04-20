(function() {
	'use strict';

	angular.module('sampleApp').service('modalService', ModalService);

	ModalService.$inject = [ '$modal' ];

	function ModalService($modal) {
		var modalDefaults = {
			isCancel : false,
			backdrop : 'static',
			keyboard : true,
			modalFade : true,
			templateUrl : 'app/common/modal.html'
		};

		var modalOptions = {
			closeButtonText : 'Cancel',
			actionButtonText : 'OK',
			headerText : '',
			bodyText : ''
		};

		this.showModal = function(customModalDefaults, customModalOptions, _customMsg, callbackModalFn) {
			if (!customModalDefaults)
				customModalDefaults = {};
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions, _customMsg, callbackModalFn);
		};

		this.show = function(customModalDefaults, customModalOptions, _customMsg, callbackModalFn) {
			// Create temp objects to work with since we're in a singleton
			// service
			var tempModalDefaults = {};
			var tempModalOptions = {};

			// Map angular-ui modal custom defaults to modal defaults
			// defined in this service
			angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

			// Map modal.html $scope custom properties to defaults defined
			// in this service
			angular.extend(tempModalOptions, modalOptions, customModalOptions);

			if (!tempModalDefaults.controller) {
				tempModalDefaults.controller = [ '$scope', '$modalInstance', function($scope, $modalInstance) {

					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.bodyText = _customMsg;
					$scope.modalOptions.ok = function(result) {
						result = true;
						$modalInstance.close('ok');
						//if (_.isFunction(callbackModalFn))
							callbackModalFn(result);

					};
					$scope.showCancel = $scope.modalOptions.isCancel;
					$scope.modalOptions.close = function(result) {
						$modalInstance.close('cancel');
					};
					$scope.modalOptions.xclose = function(result) {
						if (!$scope.showCancel) {
							$modalInstance.close('ok');
							//if (_.isFunction(callbackModalFn))
								callbackModalFn(result);
						} else {
							$modalInstance.close('cancel');
						}
					};
				} ];
			}

			return $modal.open(tempModalDefaults);
		};
	}
})();
