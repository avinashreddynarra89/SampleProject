(function() {
	'use strict';

	angular.module('sampleApp').factory('dataService', DataService);

	DataService.$inject = [ '$http', '$state', 'GlobalVariable', '$rootScope',
			'DialogFactory', 'util'];

	function DataService($http,$state,  GlobalVariable, $rootScope, DialogFactory, util) {
		return {
			Get : function(_url, success, error,contentType, accept) {
				contentType = (contentType) ? contentType : 'application/x-www-form-urlencoded';
				accept = (accept) ? accept : 'application/json';
				var headerObj = {
						Accept : accept
				};
				$http({
					method : 'GET',
					url : _url+util.getRandomNumberForUrl(_url),
					headers : headerObj,
					cache : false
				}).success(function(data, status, headers, config) {
					if (status === 200) {
						success(data);
					} else {
						error(data);
					}
				}).error(function(data, status, headers, config) {
					error(data);
				});
			},
			Post : function(_url, _reqData, success, error, contentType, accept) {
				var thisObj = this;
				contentType = (contentType) ? contentType : 'application/x-www-form-urlencoded';
				accept = (accept) ? accept : 'application/json';
				var headerObj = {
						Accept : accept
				};
				_reqData = _reqData ? (_reqData) : null;


				$http({
					method : 'POST',
					url : _url,
					data : _reqData,
					headers : headerObj
				})
						.success(
								function(data, status, headers, config) {
									console.log('data in success main= ' + (data));
								
										success(data);
									return false;
								}).error(
								function(data, status, headers, config) {
									if (status === 403) {
										
										util.Wait(false);
									} else if (error) {
										error(data);
									}
									return false;
								});
			}
		};
	}
})();