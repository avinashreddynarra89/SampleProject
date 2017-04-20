(function() {
    'use strict';

    angular.module('sampleApp').controller('EditQuantityController', EditQuantityController);

    EditQuantityController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','RestrictedCharacter.Types'];

    function EditQuantityController($scope, $rootScope, device ,GlobalVariable,DialogFactory,restrictCharacter)
    {
        $scope.GlobalVariable = GlobalVariable;
        $scope.restrictCharacter=restrictCharacter;
        $scope.closeEditQuan = function()
        {
            DialogFactory.close(true);
        };
        function render()
        {


        }
        render();
    }

})();