(function() {
    'use strict';

    angular.module('sampleApp').controller('CommonController', CommonController);

    CommonController.$inject = [ '$scope', '$rootScope','$sce', 'device.utility','GlobalVariable','DialogFactory','dataService','util','GlobalConstants','RestrictedCharacter.Types'];

    function CommonController($scope, $rootScope,$sce, device ,GlobalVariable,DialogFactory,dataService,util,GlobalConstants,restrictCharacter)
    {
        $scope.GlobalVariable = GlobalVariable;
        console.log("loaded");
        function getStoreAddress()
        {
            var url=GlobalConstants.URLCONSTANTS+'getPageSetUpDetails';
            dataService.Get(url,onStoreSuccess,onStoreError,'application/json','application/json');
        }
        function onStoreSuccess(response)
        {
            GlobalVariable.storeAddress = response[0].storeAddress;
            GlobalVariable.footerReceipt = response[0].footerReceipt;

        }
        function onStoreError(error)
        {

        }
        function getTransDetails()
        {
            var url=GlobalConstants.URLCONSTANTS+"getReceiptDetails?receiptId="+GlobalVariable.commonTransId;
            dataService.Get(url,getPrintSuccessHandler,getPrintErrorHandler,"application/json","application/json");
        }
        function getPrintSuccessHandler(response)
        {
            GlobalVariable.receiptCOmmonData =response;

        }
        function getPrintErrorHandler(response)
        {

        }
        $scope.trustAsHtml = function(string) {
            return $sce.trustAsHtml(string);
        };
        function render()
        {
            console.log("common controller");
            //getStoreAddress();
           // getTransDetails();
        }
        render();
    }

})();