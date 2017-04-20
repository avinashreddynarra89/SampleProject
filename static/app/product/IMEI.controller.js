(function() {
    'use strict';

    angular.module('sampleApp').controller('IMEIController', IMEIController);

    IMEIController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','dataService','$timeout','$state','getProductDetails','RestrictedCharacter.Types','GlobalConstants','util'];

    function IMEIController($scope, $rootScope, device ,GlobalVariable,DialogFactory,dataService,$timeout,$state,getProductDetails,restrictCharacter,GlobalConstants,util)
    {
        $scope.device= device;
        $scope.GlobalVariable = GlobalVariable;
        $scope.restrictCharacter=restrictCharacter;
        $scope.successAlert = false;
        var authElemArray = new Array();
        $scope.closePopup = function()
        {
            DialogFactory.close(true);
        };

        $scope.populateRetailPrice1 = function()
        {
            if($scope.prodIMEICP !== '' && $scope.prodIMEICP !== undefined)
            {
                if($scope.prodIMEIMarkup !== '' && $scope.prodIMEIMarkup !== undefined)
                {
                    $scope.prodIMEIRetail =(parseFloat($scope.prodIMEICP))+(parseFloat($scope.prodIMEICP) *( (parseFloat($scope.prodIMEIMarkup))/100));
                }
            }
            else
            {
                $scope.prodIMEIRetail = 0;
            }
        };

        $scope.populateMarkup1 = function()
        {
            if($scope.prodIMEIRetail !== '' && $scope.prodIMEIRetail !== undefined)
            {
                if($scope.prodIMEICP !== '' && $scope.prodIMEICP !== undefined)
                {
                    $scope.prodIMEIMarkup = ((parseFloat($scope.prodIMEIRetail) -(parseFloat($scope.prodIMEICP)))/(parseFloat($scope.prodIMEICP))) * 100;
                }
                if($scope.prodIMEIMarkup == 'Infinity')
                {
                    $scope.prodIMEIMarkup = 0;
                }
            }
            else
            {
                $scope.prodIEMIRetail = 0;
                $scope.prodIMEIMarkup =0;
            }
        };
        function validated()
        {
            authElemArray = new Array();
            if($scope.imeiNumber == '' || $scope.imeiNumber== undefined)
            {
                authElemArray.push({
                    'id' : 'imeiNumber',
                    'msg' : 'imeiNumber Number cannot be empty'
                });
            }
            if (authElemArray.length >= 1) {
                util.customError.show(authElemArray, "");

                return false;
            } else {
                return true;
            }
        }
        $scope.addIMEI = function()
        {
            util.customError.hide(['imeiNumber']);
            if(validated()) {
                var url = GlobalConstants.URLCONSTANTS + 'addIMEINo';
                var request = {
                    "productNo": (GlobalVariable.IMEIProductID).toString(),
                    "imeiNo": $scope.imeiNumber,
                    "costPrice": $scope.prodIMEICP,
                    "retailPrice": $scope.prodIMEIRetail,
                    "markup": $scope.prodIMEIMarkup,
                    "lastUpdatedTimeStamp": js_yyyy_mm_dd_hh_mm_ss()
                };
                request = JSON.stringify(request);
                dataService.Post(url, request, onAddIMEISuccess, onAddIMEIError, 'application/json', 'application/json');
            }

        };
        function onAddIMEISuccess(response)
        {
            DialogFactory.close(true);
        }
        function onAddIMEIError(response)
        {

        }
        $scope.editIMEI = function()
        {
            var url=GlobalConstants.URLCONSTANTS+'editIMEINo';
            var request={
                "productNo":(GlobalVariable.IMEIProductID).toString(),
                "imeiNo":$scope.imeiNumber,
                "costPrice":$scope.prodIMEICP,
                "retailPrice":$scope.prodIMEIRetail,
                "markup":$scope.prodIMEIMarkup,
                "lastUpdatedTimeStamp":js_yyyy_mm_dd_hh_mm_ss(),
                "phoneId":GlobalVariable.editIMEIDtls.phoneId
            };
            request=JSON.stringify(request);
            dataService.Post(url,request,onEditIMEISuccess,onEditIMEIError,'application/json','application/json');
        };
        function onEditIMEISuccess(response)
        {
            DialogFactory.close(true);
        }
        function onEditIMEIError(response)
        {

        }
        function js_yyyy_mm_dd_hh_mm_ss () {
            var now = new Date();
            var year = "" + now.getFullYear();
            var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
            var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
            var  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
            var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
            var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
            return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        }
        function render()
        {

                if(GlobalVariable.editIMEI == true)
                {
                        $scope.imeiNumber = GlobalVariable.editIMEIDtls.imeiNo;
                    $scope.prodIMEICP=GlobalVariable.editIMEIDtls.costPrice;
                   $scope.prodIMEIRetail=GlobalVariable.editIMEIDtls.retailPrice;
                 $scope.prodIMEIMarkup=GlobalVariable.editIMEIDtls.markup;

                }
        }
        render();
    }

})();