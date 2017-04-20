(function() {
	'use strict';

	angular.module('sampleApp').controller('addLastFourController', addLastFourController);

	addLastFourController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','RestrictedCharacter.Types'];

	function addLastFourController($scope, $rootScope, device ,GlobalVariable,DialogFactory,restrictCharacter)
	{
		$scope.GlobalVariable = GlobalVariable;
		$scope.restrictCharacter=restrictCharacter;
		$scope.onaddFour = function()
		{
			DialogFactory.close(true);
		};
		function render()
		{
			
		}
		render();
	}
		
})();