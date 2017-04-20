(function() {
    'use strict';

    angular.module('sampleApp').factory('getPageSetupDetails',getPageSetupDetails);


    getPageSetupDetails.$inject = ['dataService','GlobalVariable','$rootScope','GlobalConstants','util'];

    function getPageSetupDetails(dataService,GlobalVariable,$rootScope,GlobalConstants,util) {

        var getPageSetupDetails = {

            getPageSetUpDtls:getPageSetUpDtls
        };
        return getPageSetupDetails;

        function getPageSetUpDtls ()
        {
            var url=GlobalConstants.URLCONSTANTS+'getPageSetUpDetails';
            dataService.Get(url,onGetSetupSuccess,onGetSetupError,'application/json','application/json');
        }
        function onGetSetupSuccess(response)
        {
            if(response.length!==0)
            {


                if((response[0].receiptType).toString() == "0")
                    GlobalVariable.showRcptType = 'A4';
                else if((response[0].receiptType).toString() == "1")
                    GlobalVariable.showRcptType = 'Thermal';
                /*$scope.footerReceipt = response[0].footerReceipt;
                $scope.footerId = response[0].id;
                $scope.footerTaxId= response[0].tax;
                $scope.footerStore= response[0].storeAddress;*/
                GlobalVariable.wholeSaleFlag =parseInt(response[0].wholeSaleFlag);

                //if(parseInt(response[0].customReceiptFlag) == 1)
                    GlobalVariable.customReceiptFalg = parseInt(response[0].customReceiptFlag);
               // else
                    //GlobalVariable.customReceiptFalg = false;
            }
        }
        function onGetSetupError(response)
        {

        }


    };
})();