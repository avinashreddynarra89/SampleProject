(function() {
    'use strict';

    angular.module('sampleApp').factory('GlobalConstants', Globals);

    Globals.$inject = [];

    function Globals() {
        var GlobalConstantObj = {};

        GlobalConstantObj.URLCONSTANTS = 'http://localhost:8080/';

        return GlobalConstantObj;
    }
})();
