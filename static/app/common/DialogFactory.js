(function() {
	'use strict';
	angular.module('sampleApp').factory('DialogFactory', DialogFactory);

	DialogFactory.$inject = [ '$modal', 'GlobalVariable' ];

	function DialogFactory($modal, GlobalVariable) {
		var dialogObj = null;
		var dialog = {
			show : function(_tmPath, _ctrlPath, _callbkfn, _isTemplate, _scopeOptions, size, windowClass) {
				var thisObj = this;
				// require([ _ctrlPath ], function(_ctrlObj) {
				thisObj.OpenDialog(_tmPath, _ctrlPath, _callbkfn, _isTemplate, _scopeOptions, size, windowClass);
				//});
			},
			OpenDialog : function(_tmPath, _ctrlNm, _callbkfn, _isTemplate, _scopeOptions, size, windowClass) {
				var dialogOptions = {
					dialogClass : 'modal',
					backdropClass : 'modal-backdrop',
					transitionClass : 'fade',
					triggerClass : 'in',
					backdropFade : true,
					dialogFade : true,
					keyboard : false,
					backdropClick : true,
					position : [ 'center', 'center' ],
					controller : _ctrlNm || {},
					backdrop : 'static',
					resolve : {
						scopeOptions : function() {
							if (_scopeOptions)
								return angular.copy(_scopeOptions);
						}
					}
				};
				if (size !== undefined)
					dialogOptions.size = size;
				if (windowClass !== undefined)
					dialogOptions.windowClass = windowClass;

				var templateObject = new Object();
				templateObject = (_isTemplate) ? ({
					template : _tmPath
				}) : ({
					templateUrl : _tmPath
				});
				angular.extend(dialogOptions, templateObject);
				dialogObj = $modal.open(dialogOptions);

				// HACK
				angular.element('body').addClass('modal-open');

				/** This is used to close the dialog when session expires * */
				GlobalVariable.dialogObj = dialogObj;

				dialogObj.result.then(function(result) {
					if (_callbkfn) {
						_callbkfn(result);
					}
				});
			},
			close : function(_flag) {
				if (dialogObj != null) {
					// HACK
					angular.element('body').removeClass('modal-open');
					dialogObj.close(_flag);
				}
			},
			closeWarning : function(_flag) {
				if (dialogObj != null) {
					dialogObj.close(_flag);
				}
			}
		};
		return dialog;
	}
})();