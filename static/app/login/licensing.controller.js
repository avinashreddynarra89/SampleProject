(function() {
	'use strict';

	angular.module('sampleApp').controller('LicensingController', LicensingController);

	LicensingController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','RestrictedCharacter.Types'];

	function LicensingController($scope, $rootScope, device ,GlobalVariable,DialogFactory,restrictCharacter)
	{
		$scope.GlobalVariable = GlobalVariable;
		$scope.restrictCharacter=restrictCharacter;
		$scope.closingLicensing = function()
		{
			DialogFactory.close(true);
		};
		function render()
		{
			
		}
		render();
	}
		
})();