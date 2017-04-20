(function() {
    'use strict';

    angular.module('sampleApp').controller('ValidateIMEIController', ValidateIMEIController);

    ValidateIMEIController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','RestrictedCharacter.Types','dataService','GlobalConstants'];

    function ValidateIMEIController($scope, $rootScope, device ,GlobalVariable,DialogFactory,restrictCharacter,dataService,GlobalConstants)
    {
        $scope.GlobalVariable = GlobalVariable;
        $scope.restrictCharacter=restrictCharacter;
        $scope.foundIMEINUmber = false;
        $scope.showErrorFound = false;
        $scope.closeIMEI = function()
        {
            DialogFactory.close(true);
        };
        $scope.validateIMEI = function()
        {
            $scope.getAllValidateIMEINumbers();
        };
        $scope.getAllValidateIMEINumbers = function()
        {
            var url=GlobalConstants.URLCONSTANTS+'getPhoneDetails?productNo='+GlobalVariable.sellProductNo;
            dataService.Get(url,onGetSellIMEISuccess,onGETSellIMEIError,'application/json','application/json');
        };
        function onGetSellIMEISuccess(response)
        {
            $scope.foundIMEINUmber == false;
            if(response.length !== 0)
            {
                for(var i =0;i< response.length;i++)
                {
                    if(GlobalVariable.sellIMEINumber == response[i].imeiNo)
                    {
                        $scope.foundIMEINUmber = true;
                    }
                }

            }
            else
            {
                $scope.showErrorFound = true;
            }
            if($scope.foundIMEINUmber == true)
            {
                $scope.showErrorFound = false;
                DialogFactory.close(true);

            }
            else
            {
                $scope.showErrorFound = true;
            }



        }
        function onGETSellIMEIError(response)
        {

        }
        function render()
        {

        }
        render();
    }

})();