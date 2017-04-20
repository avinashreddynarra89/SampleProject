var app = angular.module('sampleApp', ['ui.bootstrap','ngSanitize','matchMedia','ui.router','uiSwitch','ui.mask','AngularPrint','chart.js','infinite-scroll','textAngular','angularSpectrumColorpicker']);
  
app.config(['$provide','$stateProvider','$urlRouterProvider','ChartJsProvider',function($provide,$stateProvider, $urlRouterProvider,ChartJsProvider){

	$urlRouterProvider.otherwise('/login');
	$provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
		// $delegate is the taOptions we are decorating
		// register the tool with textAngular

		taRegisterTool('backgroundColor', {
			display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
			action: function (color) {
				var me = this;
				if (!this.$editor().wrapSelection) {
					setTimeout(function () {
						me.action(color);
					}, 100)
				} else {
					/*var selectedText = window.getSelection();
					console.log("selectedText= "+selectedText);
					var  glossTag = '<span style="color:'+color+'">'+ selectedText +'</span>';
					return this.$editor().wrapSelection('insertHTML', glossTag);*/
					return this.$editor().wrapSelection('backColor', color);
				}
			},
			options: {
				replacerClassName: 'fa fa-paint-brush', showButtons: false
			},
			color: "#fff"
		});
		taRegisterTool('fontColor', {
			display:"<spectrum-colorpicker trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
			action: function (color) {
				var me = this;
				if (!this.$editor().wrapSelection) {
					setTimeout(function () {
						me.action(color);
					}, 100)
				} else {
					return this.$editor().wrapSelection('foreColor', color);
				}
			},
			options: {
				replacerClassName: 'fa fa-font', showButtons: false
			},
			color: "#000"
		});



		// add the button to the default toolbar definition
		taOptions.toolbar[1].push('backgroundColor','fontColor');
		return taOptions;
	}]);

	//ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
	 ChartJsProvider.setOptions({
	      colours: [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
	      responsive: true
	    });
	    // Configure all line charts
	  /*  ChartJsProvider.setOptions('Line', {
	      datasetFill: false
	    });*/
	
	$stateProvider
	  .state('login', {
	    url: '/login',
	    templateUrl: 'app/login/login.html',
	    controller: 'loginController'
	  })
	  .state('product', {
	    url: '/product',
	    templateUrl: 'app/product/product.html',
	    controller: 'productController',
	    params:{
	    	obj:null
	    }
	  })
	   .state('productmain', {
	    url: '/productmain',
	    templateUrl: 'app/product/mainProduct.html',
	    controller: 'mainProductController'
	  })
	  .state('customer', {
	    url: '/customer',
	    templateUrl: 'app/AddCustomer/mainCustomer.html',
	    controller: 'mainCustomerController'
	  })
	  .state('sell', {
		    url: '/sell',
		    templateUrl: 'app/sell/sell.html',
		    controller: 'sellController'
		  })
		   .state('brand', {
		    url: '/brand',
		    templateUrl: 'app/product/brand.html',
		    controller: 'BrandController'
		  })
		  .state('supplier', {
		    url: '/supplier',
		    templateUrl: 'app/product/supplier.html',
		    controller: 'SupplierController'
		  })
		   .state('vendor', {
		    url: '/vendor',
		    templateUrl: 'app/product/vendor.html',
		    controller: 'VendorController'
		  })
		.state('modal', {
			url: '/modal',
			templateUrl: 'app/product/modal.html',
			controller: 'ModalController'
		})
		  .state('setup', {
		    url: '/setup',
		    templateUrl: 'app/Setup/setup.html',
		    controller: 'SetupController'
		  })
		    .state('ledger', {
		    url: '/ledger',
		    templateUrl: 'app/Ledger/ledger.html',
		    controller: 'LedgerController'
		  })
		   .state('report', {
		    url: '/report',
		    templateUrl: 'app/Report/report.html',
		    controller: 'ReportController'
		  })
		   .state('closeregister', {
		    url: '/closeregister',
		    templateUrl: 'app/Registers/CloseRegister.html',
		    controller: 'CloseRegisterController'
		  })
		   .state('openregister', {
		    url: '/openregister',
		    templateUrl: 'app/Registers/OpenRegister.html',
		    controller: 'OpenRegisterController'
		  })
		  .state('monthly', {
		    url: '/monthly',
		    templateUrl: 'app/Registers/monthlyanalysis.html',
		    controller: 'MonthlyAnalysisController'
		  })
		  .state('home', {
		    url: '/home',
		    templateUrl: 'app/home/home.html',
		    controller: 'HomeController'
		  })
		.state('return', {
			url: '/return',
			templateUrl: 'app/sell/Return.html',
			controller: 'ReturnController'
		})
		.state('clock', {
			url: '/clock',
			templateUrl: 'app/Setup/clockPopup.html',
			controller: 'clockPopupController',
			params:{
				obj:null
			}
		});
  
}]);
