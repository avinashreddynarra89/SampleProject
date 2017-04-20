(function() {
    'use strict';

    angular.module('sampleApp').filter('trusted', trusted);

    trusted.$inject = ['$sce'];

    function trusted($sce) {
        return function(html){
            return $sce.trustAsHtml(html)
        }
    }
})();