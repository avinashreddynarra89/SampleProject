(function() {
    'use strict';

    angular.module('sampleApp').controller('EditClockController', EditClockController);

    EditClockController.$inject = [ '$scope', '$rootScope', 'device.utility','GlobalVariable','DialogFactory','RestrictedCharacter.Types','GlobalConstants','dataService','$filter'];

    function EditClockController($scope, $rootScope, device ,GlobalVariable,DialogFactory,restrictCharacter,GlobalConstants,dataService,$filter)
    {
        $scope.GlobalVariable = GlobalVariable;
        $scope.restrictCharacter=restrictCharacter;
        $scope.maxDate = new Date();
        $scope.minDate = new Date();
        $scope.numbersTime = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'];
        $scope.numbersHrs=['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
        $scope.onaddFour = function()
        {
            DialogFactory.close(true);
        };
        $scope.openclockInDateCalendar = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openStart = true;
        };
        $scope.openclockOutDateCalendar = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openEnd = true;
        };
        $scope.onDateSelected = function(startDate, endDate, label, element) {
            var receiptIndex = element.attr('data-receipt-index');
            element.find('span').eq(0).html(endDate.format('yyyy-MM-dd'));
        };
        $scope.editClockInDetails = function()
        {
            $scope.clockInDate=$scope.clckDate+" "+$scope.clkInHrs+":"+$scope.clkInMin+":"+$scope.clkInSec;
            $scope.clockOutDate = $scope.clckDate+" "+$scope.clkOtHrs+":"+$scope.clkOtMin+":"+$scope.clkOtSec;
            var date1 = new Date($scope.clockInDate);
            var date2 = new Date($scope.clockOutDate);
            var hours = Number(Math.abs(date1 - date2) / 36e5).toFixed(2);
            var url=GlobalConstants.URLCONSTANTS+'editClockInDetails';
            var request= {
                "clockInId": GlobalVariable.editClockDtls.clockInId,
                "username": GlobalVariable.editClockDtls.username,
                "clockInTime": $scope.clockInDate,
                "clockOutTime": $scope.clockOutDate,
                    //$filter('date')($scope.clockOutDate, "yyyy-MM-dd hh:mm:ss"),
                "noOfhours": hours,
                "horlyRate": $scope.hrlyRate.replace('$','').replace(/,/g,''),
                "date": null

            };
            request = JSON.stringify(request);
            dataService.Post(url,request,onEditClckSuccess,onEditClckError,'application/json','application/json');
        };
        function onEditClckSuccess(response)
        {
            DialogFactory.close(true);
        }
        function onEditClckError(response)
        {

        }
        function render()
        {
            /** Options for the date picker directive * */
            $scope.dateRangeOptions = {
                //startDate : moment(),
                showDropdowns : true,
                format : 'yyyy-MM-dd',
                singleDatePicker : true
            };
            var x=(GlobalVariable.editClockDtls.clockInTime).toString().split(" ");
            var split= x[1].split(":");
            $scope.clckDate = x[0];
            $scope.clkInHrs=split[0];
            $scope.clkInMin=split[1];
            $scope.clkInSec = split[2].split(".")[0];

            if(GlobalVariable.editClockDtls.clockOutTime != null && GlobalVariable.editClockDtls.clockOutTime !== '') {
                var y = (GlobalVariable.editClockDtls.clockOutTime).toString().split(" ");
                var split1 = y[1].split(":");
                $scope.clkOtHrs = split1[0];
                $scope.clkOtMin = split1[1];
                $scope.clkOtSec = split1[2].split(".")[0];
            }
            $scope.hrlyRate =GlobalVariable.editClockDtls.hrlyRate;
        }
        render();
    }

})();