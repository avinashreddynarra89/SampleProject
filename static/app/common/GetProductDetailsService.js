(function() {
	'use strict';

	angular.module('sampleApp').factory('getProductDetails',getProductDetails);
	

	getProductDetails.$inject = ['dataService','GlobalVariable','$rootScope','GlobalConstants','util'];

	function getProductDetails(dataService,GlobalVariable,$rootScope,GlobalConstants,util) {
		
		var getProductDetails = {


			
				getProductValues:getProductValues,
				getVendorDetails:getVendorDetails,
				getBrandDetails:getBrandDetails,
				getCategoryDetails:getCategoryDetails,
				getProductDetail:getProductDetail,
				getCustomerDetails:getCustomerDetails,
				getUserDetails:getUserDetails,
				getModelDetails:getModelDetails

				
		};
		return getProductDetails;
		var refCallback = null;
		function getModelDetails ()
		{
			var url=GlobalConstants.URLCONSTANTS+'getModel';
			dataService.Get(url,onGetModelDtlsSuccess,onGetModelDtlsError,'application/json','application/json');
		}
		function onGetModelDtlsSuccess(response)
		{
			GlobalVariable.getModelDtls = response;
			if(refCallback !=null && refCallback!= undefined)
				refCallback(response);
		}
		function onGetModelDtlsError(response)
		{

		}
		function getUserDetails ()
		{
			var url=GlobalConstants.URLCONSTANTS+'getUserDetails';
			dataService.Get(url,onGetUserDtlsSuccess,onGetUserDtlsError,'application/json','application/json');
		}
		function onGetUserDtlsSuccess(response)
		{
			GlobalVariable.getUserDtls = response;
		}
		function onGetUserDtlsError(response)
		{

		}
		function getProductValues()
		{
			util.Wait(true);
			getVendorDetails();
			getBrandDetails();
			getCategoryDetails();
			getProductDetail();
			getCustomerDetails();
			getModelDetails();
			
			
			/*getVendorSuccessHandler('');
			getBrandSuccessHandler('');
			getCategorySuccessHandler('');
			
			getProductSuccessHandler('');
			getCustomerDetailSuccessHandler('');*/
		}
		function getCustomerDetails()
		{
			dataService.Get(GlobalConstants.URLCONSTANTS+"getCustomerDetail",getCustomerDetailSuccessHandler,getCustomerDetailErrorHandler,"application/json","application/json");

		}
		function getProductDetail(callBack)
		{
			refCallback = callBack;
			dataService.Get(GlobalConstants.URLCONSTANTS+"getProduct",getProductSuccessHandler,getProductErrorHandler,"application/json","application/json");

		}
		function getCategoryDetails()
		{
			dataService.Get(GlobalConstants.URLCONSTANTS+"getCategory",getCategorySuccessHandler,getCategoryErrorHandler,"application/json","application/json");

		}
		function getBrandDetails()
		{
			dataService.Get(GlobalConstants.URLCONSTANTS+"getBrand",getBrandSuccessHandler,getBrandErrorHandler,"application/json","application/json");
		}
		function getVendorDetails()
		{
			dataService.Get(GlobalConstants.URLCONSTANTS+"getVendor",getVendorSuccessHandler,getVendorErrorHandler,"application/json","application/json");
		}
		function getVendorSuccessHandler(response)
		{
			GlobalVariable.getVendors = response;
			if(refCallback !=null && refCallback!= undefined)
				refCallback(response);
		}
		function getVendorErrorHandler(errorResponse)
		{
			
		}
		function getBrandSuccessHandler(response)
		{
			GlobalVariable.getBrands =  response;
			if(refCallback !=null && refCallback!= undefined)
				refCallback(response);
		}
		function getBrandErrorHandler(errorResponse)
		{
			
		}
		function getCategorySuccessHandler(response)
		{
			GlobalVariable.getCategory = response;
			if(refCallback !=null && refCallback!= undefined)
				refCallback(response);

		}
		function getCategoryErrorHandler(errorResponse)
		{
			
		}
		function getProductSuccessHandler(response)
		{
			GlobalVariable.getProducts =response;
			if(refCallback !=null && refCallback!= undefined)
			refCallback(response);
		}
		function getProductErrorHandler(errorResponse)
		{
			
		}
		function getCustomerDetailSuccessHandler(response)
		{
			util.Wait(false);
			GlobalVariable.getCustomerDtls =response;
			$rootScope.firstNames = [];
			for(var i=0;i<GlobalVariable.getCustomerDtls.length;i++)
			{
				$rootScope.firstNames.push(GlobalVariable.getCustomerDtls[i].firstName);
			}
		}
		function getCustomerDetailErrorHandler(response)
		{
			//GlobalVariable.getCustomerDtls =response;
		}

	};
})();/**
 * 
 */