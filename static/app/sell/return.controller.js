(function() {
    'use strict';

    angular.module('sampleApp')
        .controller('ReturnController', ReturnController);

    ReturnController.$inject = [ '$scope', '$rootScope', 'device.utility',
        'GlobalVariable', 'DialogFactory', 'modalService',
        'RestrictedCharacter.Types', 'dataService', '$state','GlobalConstants','$window','$timeout','getProductDetails'];

    function ReturnController($scope, $rootScope, device, GlobalVariable,
                              DialogFactory, modalService, restrictCharacter, dataService, $state,GlobalConstants,$window,$timeout,getProductDetails) {

        $scope.device = device;
        $scope.GlobalVariable = GlobalVariable;
        $scope.restrictCharacter = restrictCharacter;
        GlobalVariable.isLoginPage = false;
        $rootScope.returnData = [];
        $scope.productNames = [];
        $rootScope.returnBackData = [];
        $scope.retPrd = [];
        $rootScope.modifiedTransReturnData =[];
        var length =0;
        $scope.returnLength =0;

        $scope.removeRow = function($index,row) {

            $scope.deleteIndex = $index;
            GlobalVariable.itemNoToDelete = row.itemId;
            modalService.showModal('', {
                isCancel : true
            }, "Are you Sure Want to Delete ? ", $scope.callBackAction);
        };
        $scope.callBackAction = function(isOKClicked) {

            if (isOKClicked) {
                $rootScope.testData.splice($scope.deleteIndex, 1);
                $scope.loadCheckOutData();
            }
        }

        function callbackPayment() {
            $scope.totalQuantity = 0;
            $scope.subTotal = 0;
            $scope.productTotal = 0;
            $scope.undelProdTotal =0;

        }

        $scope.loadCheckOutData = function() {
            $scope.totalQuantity = 0;
            $scope.subTotal = 0;
            $scope.totalDelRetail = 0;
            $scope.totalDelRetailDisc = 0;
            $scope.retTotalDisc =0;
            $scope.totalRetail = 0;
            $scope.retTotalPrice =0;
            $scope.retTotalTax =0;
            $scope.totalRetailDisc = 0;
            length =0;

            for (var i = 0; i < $rootScope.returnData.length; i++) {
                if($scope.retPrd[i] == true) {
                    length++;
                    $scope.totalQuantity = parseFloat($scope.totalQuantity)
                        + parseFloat($rootScope.returnData[i].quantity);
                    $scope.subTotal = parseFloat($scope.subTotal)
                        + parseFloat($rootScope.returnData[i].totalWithOutTax);
                    $scope.retTotalDisc = parseFloat($scope.retTotalDisc) + parseFloat($rootScope.returnData[i].discount);
                    $scope.totalRetail = parseFloat($scope.totalRetail) + parseFloat($rootScope.returnData[i].retail);
                    $scope.totalRetailDisc = parseFloat($scope.totalRetailDisc) + parseFloat($rootScope.returnData[i].discount);
                    $scope.retTotalTax = parseFloat($scope.retTotalTax) + parseFloat(parseFloat($rootScope.returnData[i].totalWithTax) - parseFloat($rootScope.returnData[i].totalWithOutTax));
                    $scope.retTotalPrice = parseFloat($scope.retTotalPrice)
                        + parseFloat($rootScope.returnData[i].totalWithTax);
                }
            }
            $scope.returnLength = length;
            $scope.subTotal = parseFloat(parseFloat($scope.subTotal).toFixed(2));
            $scope.retTotalPrice = parseFloat(parseFloat($scope.retTotalPrice).toFixed(2));
            $scope.retTotalTax =parseFloat(parseFloat($scope.retTotalTax ).toFixed(2));
            $scope.retTotalDisc =parseFloat(parseFloat($scope.retTotalDisc).toFixed(2));
            $scope.totalRetail=parseFloat(parseFloat($scope.totalRetail).toFixed(2));
            $scope.totalRetailDisc=parseFloat(parseFloat($scope.totalRetailDisc).toFixed(2));
            $scope.retTotalTax=parseFloat(parseFloat($scope.retTotalTax).toFixed(2));
            $scope.retTotalPrice=parseFloat(parseFloat($scope.retTotalPrice).toFixed(2));
            if ($scope.returnprevBalance > 0) {
                $scope.retTotalPrice = parseFloat($scope.retTotalPrice)
                    + parseFloat($scope.returnprevBalance);
            }
            $rootScope.totalReturnPayment = parseFloat(parseFloat($scope.retTotalPrice).toFixed(2));
            GlobalVariable.checkOuttotal = $rootScope.totalReturnPayment;
            GlobalVariable.returnTotalAmt = $scope.retTotalPrice;
            //$scope.getLastTransId();
        }
        function render() {
            $scope.currentPageIndexArr = 0;
            $scope.totalTax = GlobalVariable.totalTaxSetup;
            if(GlobalVariable.getProducts ==  undefined || GlobalVariable.getProducts == null)
            {

                getProductDetails.getProductDetail($scope.getPrdDtls);
            }
            else
            {
                $scope.productNames = [];
                for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
                    $scope.productNames
                        .push(GlobalVariable.getProducts[i].description);
                }
            }

            getTaxDetails();
            if (GlobalVariable.returnProduct == true) {
                for (var i = 0; i < GlobalVariable.getReturnDetails[0].transactionLineItemDtoList.length; i++) {
                    $rootScope.returnData
                        .push({
                            "statusId":'r',
                            "itemId":GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].productId,
                            "itemNo" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].productNumber,
                            "item" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].productDescription,
                            "quantity" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].quantity,
                            "retail" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].retail,
                            "discount" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].discount,
                            "retWithDisc" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].retailWithDis,
                            "total" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].totalProductPrice,
                            "stock" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].quantity,
                            "costPrice" : GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].cost,
                            "totalWithOutTax":GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].totalProductPrice,
                            "totalWithTax":GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].totalProductPriceWithTax,
                            "totalTax":parseFloat(GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].totalProductPriceWithTax)-parseFloat(GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].totalProductPrice),
                            "categoryId":GlobalVariable.getProducts[i].categoryId,
                            "imeiNo":GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].imeiNo,
                            "phoneId":GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].phoneId,
                            "discountPercentage":GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].discountPercentage,
                            "addTax":GlobalVariable.getReturnDetails[0].transactionLineItemDtoList[i].addTax
                        });
                    $scope.retPrd[i] = true;
                }
                $scope.returnprevBalance = GlobalVariable.getReturnDetails[0].transactionDtoList[0].prevBalance;
                $scope.previousId = GlobalVariable.getReturnDetails[0].transactionDtoList[0].transactionCompId;
                $scope.userIdReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].userId;
                $scope.returnPhone = GlobalVariable.getReturnDetails[0].transactionDtoList[0].customerPhoneNo;
                $scope.returnCreditId = GlobalVariable.getReturnDetails[0].transactionDtoList[0].customerPhoneNo;
                $scope.returncashId = GlobalVariable.getReturnDetails[0].transactionDtoList[0].cashId;
                $scope.paidAmountCashReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].paidAmountCash;
                $scope.paidAmountCreditReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].paidAmountCredit;
                $scope.paidAmountCheckReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].paidAmountCheck;
                $scope.paidAmountDebitReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].paidAmountDebit;
                $scope.changeAmountReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].changeAmount;
                $scope.last4Return = GlobalVariable.getReturnDetails[0].transactionDtoList[0].last4Digits;
                $scope.transCreditIdReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].transCreditId;
                $scope.receiptNoteReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].receiptNote;
                $scope.transactionNoteReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].transactionNote;
                $scope.balanceReturn = GlobalVariable.getReturnDetails[0].transactionDtoList[0].balance;

            }
            $scope.loadCheckOutData();
        }
        $scope.getPrdDtls = function(response)
        {
            for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
                $scope.productNames
                    .push(GlobalVariable.getProducts[i].description);
            }
        };
        $scope.changeReturnQuantity = function()
        {
            var searchTxt = $scope.searchValue.toString();
            if (searchTxt !== '' && searchTxt !== undefined
                && searchTxt.indexOf(".") !== 0) {
                if (searchTxt.match(/[a-z]/i)) {
                    console.log("contains only charcters");
                    $scope.discount = 0;
                    for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
                        if (searchTxt === GlobalVariable.getProducts[i].description) {
                            if(GlobalVariable.getProducts[i].categoryName == 'Phone' && GlobalVariable.getProducts[i].categoryId == 10)
                            {
                                GlobalVariable.sellProductNo = GlobalVariable.getProducts[i].productNo;
                                GlobalVariable.sellProductId =GlobalVariable.getProducts[i].productId;
                                GlobalVariable.sellDescription = GlobalVariable.getProducts[i].description;
                                GlobalVariable.sellCategoryId = GlobalVariable.getProducts[i].categoryId;
                                GlobalVariable.sellAddTax= GlobalVariable.getProducts[i].addTax;

                                var _tmPath = 'app/sell/validateIMEI.html';
                                var _ctrlPath = 'ValidateIMEIController';
                                DialogFactory.show(_tmPath, _ctrlPath, $scope.callBackValidateIMEI);
                            }
                            else
                            {
                                if(GlobalVariable.getProducts[i].addTax == true)
                                {
                                    var totalWithOutTax = Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
                                        .toFixed(2);
                                    totalWithOutTax = parseFloat(totalWithOutTax);
                                    var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
                                }
                                else
                                {
                                    var totalWithOutTax = Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
                                        .toFixed(2);
                                    totalWithOutTax = parseFloat(totalWithOutTax);
                                    var totalWithTax = totalWithOutTax;
                                }
                                $rootScope.returnData
                                    .push({
                                        "statusId":'n',
                                        "itemId":GlobalVariable.getProducts[i].productId,
                                        "itemNo" : GlobalVariable.getProducts[i].productNo,
                                        "item" : GlobalVariable.getProducts[i].description,
                                        "quantity" : GlobalVariable.getProducts[i].quantity,
                                        "retail" : GlobalVariable.getProducts[i].retailPrice,
                                        "discount" : (parseFloat($scope.discount))
                                            .toFixed(2),
                                        "retWithDisc":(parseFloat($scope.discount))
                                            .toFixed(2),
                                        "total" : totalWithOutTax,
                                        "stock" : GlobalVariable.getProducts[i].stock,
                                        "costPrice" : GlobalVariable.getProducts[i].costPrice,
                                        "totalWithOutTax":totalWithOutTax,
                                        "totalWithTax":totalWithTax,
                                        "totalTax":parseFloat(totalWithTax)-parseFloat(totalWithOutTax),
                                        "categoryId":GlobalVariable.getProducts[i].categoryId,
                                        "imeiNo":GlobalVariable.getProducts[i].imeiNo,
                                        "phoneId":GlobalVariable.getProducts[i].phoneId,
                                        "discountPercentage":'',
                                        "addTax":GlobalVariable.getProducts[i].addTax
                                    });
                                if(GlobalVariable.getProducts[i].relatedProduct = true)
                                {

                                    var url=GlobalConstants.URLCONSTANTS+"getRelatedProduct?productNo="+GlobalVariable.getProducts[i].productNo;
                                    dataService.Get(url,onGetRelatedSuccess,onGetRelatedError,'application/json','application/json');
                                    break;
                                }

                                break;
                            }
                        }
                    }

                }
                else if (searchTxt.length > 6) {
                    console.log("" + $scope.searchValue);
                    $scope.discount = 0;
                    for (var i = 0; i < GlobalVariable.getProducts.length; i++) {
                        if (searchTxt === GlobalVariable.getProducts[i].productNo) {
                            $scope.productFound = true;
                            if(GlobalVariable.getProducts[i].categoryName == 'Phone' && GlobalVariable.getProducts[i].categoryId == 10)
                            {
                                GlobalVariable.sellProductNo = GlobalVariable.getProducts[i].productNo;
                                GlobalVariable.sellProductId =GlobalVariable.getProducts[i].productId;
                                GlobalVariable.sellDescription = GlobalVariable.getProducts[i].description;
                                GlobalVariable.sellCategoryId = GlobalVariable.getProducts[i].categoryId;
                                GlobalVariable.sellAddTax= GlobalVariable.getProducts[i].addTax;
                                var _tmPath = 'app/sell/validateIMEI.html';
                                var _ctrlPath = 'ValidateIMEIController';
                                DialogFactory.show(_tmPath, _ctrlPath, $scope.callBackValidateIMEI);
                            }
                            else
                            {

                                if(GlobalVariable.getProducts[i].addTax == true)
                                {
                                    var totalWithOutTax = Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
                                        .toFixed(2);
                                    totalWithOutTax = parseFloat(totalWithOutTax);
                                    var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
                                }
                                else
                                {
                                    var totalWithOutTax =  Number((parseFloat(GlobalVariable.getProducts[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
                                        .toFixed(2);
                                    totalWithOutTax = parseFloat(totalWithOutTax);
                                    var totalWithTax = totalWithOutTax;
                                }

                                $rootScope.returnData
                                    .push({
                                        "statusId":'n',
                                        "itemId":GlobalVariable.getProducts[i].productId,
                                        "itemNo" : GlobalVariable.getProducts[i].productNo,
                                        "item" : GlobalVariable.getProducts[i].description,
                                        "quantity" : GlobalVariable.getProducts[i].quantity,
                                        "retail" : GlobalVariable.getProducts[i].retailPrice,
                                        "discount" : (parseFloat($scope.discount))
                                            .toFixed(2),
                                        "retWithDisc":(parseFloat($scope.discount))
                                            .toFixed(2),
                                        "total" : totalWithOutTax,
                                        "stock" : GlobalVariable.getProducts[i].stock,
                                        "costPrice" : GlobalVariable.getProducts[i].costPrice,
                                        "totalWithOutTax":totalWithOutTax,
                                        "totalWithTax":totalWithTax,
                                        "totalTax":parseFloat(totalWithTax)-parseFloat(totalWithOutTax),
                                        "categoryId":GlobalVariable.getProducts[i].categoryId,
                                        "imeiNo":GlobalVariable.getProducts[i].imeiNo,
                                        "phoneId":GlobalVariable.getProducts[i].phoneId,
                                        "discountPercentage":'',
                                        "addTax":GlobalVariable.getProducts[i].addTax
                                    });
                                if(GlobalVariable.getProducts[i].relatedProduct = true)
                                {

                                    var url=GlobalConstants.URLCONSTANTS+"getRelatedProduct?productNo="+GlobalVariable.getProducts[i].productNo;
                                    dataService.Get(url,onGetRelatedSuccess,onGetRelatedError,'application/json','application/json');
                                    break;
                                }
                                break;
                            }
                            break;

                        }
                        else
                        {
                            $scope.productFound = false;
                        }
                    }
                    if($scope.productFound == false)
                    {
                        var msg= 'Item is not in this system,do you want to add this product?';
                        msg=$sce.trustAsHtml(msg);
                        modalService.showModal('', {isCancel:true,closeButtonText:'Cancel',actionButtonText:'Add'}, msg, $scope.callBackAddProduct);
                    }

                }
            }
        };
        function onGetRelatedSuccess(response)
        {
            if(response.length !== 0)
            {
                for(var k=0;k<response.length;k++) {
                    if(response[i].addTax == true)
                    {
                        var totalWithOutTax = Number((parseFloat(response[k].retailPrice) - (parseFloat($scope.discount))) * parseFloat(response[k].quantity))
                            .toFixed(2);
                        totalWithOutTax = parseFloat(totalWithOutTax);
                        var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
                    }
                    else
                    {
                        var totalWithOutTax = Number((parseFloat(response[k].retailPrice) - (parseFloat($scope.discount))) * parseFloat(response[k].quantity))
                            .toFixed(2);
                        totalWithOutTax = parseFloat(totalWithOutTax);
                        var totalWithTax = totalWithOutTax;
                    }

                    $rootScope.returnData
                        .push({
                            "statusId":'n',
                            "itemId": response[k].productId,
                            "itemNo": response[k].productNo,
                            "item": response[k].description,
                            "quantity": response[k].quantity,
                            "retail": response[k].retailPrice,
                            "discount": (parseFloat($scope.discount))
                                .toFixed(2),
                            "retWithDisc":(parseFloat($scope.discount))
                                .toFixed(2),
                            "total": totalWithOutTax,
                            "stock": response[k].stock,
                            "costPrice": response[k].costPrice,
                            "totalWithOutTax":totalWithOutTax,
                            "totalWithTax": totalWithTax,
                            "totalTax": parseFloat(totalWithTax) - parseFloat(totalWithOutTax),
                            "catgeoryId":response[k].categoryId,
                            "imeiNo":response[k].imeiNo,
                            "phoneId":response[k].phoneId,
                            "discountPercentage":'',
                            "addTax":response[k].addTax

                        });
                }
            }
            $scope.loadCheckOutData();

        }
        function onGetRelatedError(response)
        {

        }
        $scope.callBackValidateIMEI = function()
        {

            $scope.getAllSellIMEINumbers();
        };
        $scope.getAllSellIMEINumbers = function()
        {
            var url=GlobalConstants.URLCONSTANTS+'getPhoneDetails?productNo='+GlobalVariable.sellProductNo;
            dataService.Get(url,onGetSellIMEISuccess,onGETSellIMEIError,'application/json','application/json');
        };
        function onGetSellIMEISuccess(response)
        {
            $scope.IMEIProdctFound = false;
            if(response.length !== 0)
            {
                for(var i =0;i< response.length;i++)
                {
                    if(GlobalVariable.sellIMEINumber == response[i].imeiNo)
                    {
                        $scope.IMEIProdctFound = true;
                        if(response[i].addTax == true)
                        {
                            var totalWithOutTax = Number((parseFloat(response[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
                                .toFixed(2);
                            totalWithOutTax = parseFloat(totalWithOutTax);
                            var totalWithTax = totalWithOutTax + (($scope.totalDefaultTax /100) * totalWithOutTax);
                        }
                        else
                        {
                            var totalWithOutTax = Number((parseFloat(response[i].retailPrice) - (parseFloat($scope.discount))) * parseFloat(GlobalVariable.getProducts[i].quantity))
                                .toFixed(2);
                            totalWithOutTax = parseFloat(totalWithOutTax);
                            var totalWithTax = totalWithOutTax;
                        }
                        $rootScope.returnData
                            .push({
                                "statusId":'n',
                                "itemId":response[i].productId,
                                "itemNo" : response[i].productNo,
                                "item" : response[i].description,
                                "quantity" : response[i].quantity,
                                "retail" : response[i].retailPrice,
                                "discount" : (parseFloat($scope.discount))
                                    .toFixed(2),
                                "retWithDisc":(parseFloat($scope.discount))
                                    .toFixed(2),
                                "total" : totalWithOutTax,
                                "stock" : response[i].stock,
                                "costPrice" : response[i].costPrice,
                                "totalWithOutTax":totalWithOutTax,
                                "totalWithTax":totalWithTax,
                                "totalTax":parseFloat(totalWithTax)-parseFloat(totalWithOutTax),
                                "imeiNo":response[i].imeiNo,
                                "categoryId":response[i].categoryId,
                                "phoneId":response[i].phoneId,
                                "discountPercentage":'',
                                "addTax":response[i].addTax
                            });
                    }
                }
            }
            if($scope.IMEIProdctFound == false)
            {
                //TODO Change Object
                $rootScope.returnData
                    .push({
                        "itemId":GlobalVariable.sellProductId,
                        "itemNo" :GlobalVariable.sellProductNo,
                        "item" : GlobalVariable.sellDescription,
                        "quantity" :1,
                        "retail" : 0,
                        "discount" : 0,
                        "total" : 0,
                        "stock" :0,
                        "costPrice" : 0,
                        "categoryName":'',
                        "totalWithTax":0,
                        "totalTax":0,
                        "imeiNo":GlobalVariable.sellIMEINumber,
                        "categoryId":GlobalVariable.sellCategoryId,
                        "phoneId":'',
                        "addTax":GlobalVariable.sellAddTax
                    });
            }

            $scope.loadCheckOutData();

        }
        function onGETSellIMEIError(response)
        {

        }
        $scope.returnProduct = function() {

            /*var _tmPath = 'app/sell/printReceiptModal.html';
            var _ctrlPath = 'PrintRecepitController';
            DialogFactory.show(_tmPath, _ctrlPath,
                $scope.callBackReturnCheckout);*/
            $scope.getLastTransId();
        };

        $scope.getLastTransId = function()
        {
            var url=GlobalConstants.URLCONSTANTS+'getLastTransactionId';
            dataService.Get(url,lastTransSuccess,lastTransError,'application/json','application/json');
        }
        function lastTransSuccess(response)
        {

            $scope.lastTransId =  parseInt(response)+1;
            $scope.callBackReturnCheckout();

        }
        function lastTransError(response)
        {

        }
        $scope.callBackReturnCheckout = function() {
            console.log("callback");
            var url = GlobalConstants.URLCONSTANTS+"editTransaction?previousTransId="
                + $scope.previousId;
            var request = new Object();
                var paidRTCh =0;
                var paidRTCr =0;
                var paidRTDb =0,paidRTCs = 0;

                if((parseFloat($scope.paidAmountCashReturn) != 0) && (parseFloat($scope.paidAmountCreditReturn) == 0)
                    && (parseFloat($scope.paidAmountDebitReturn) == 0) && (parseFloat($scope.paidAmountCheckReturn) == 0) )
                {
                    paidRTCh =0;
                    paidRTCr =0;
                    paidRTDb = 0;
                    paidRTCs = parseFloat(parseFloat($scope.retTotalPrice).toFixed(2));
                }
                else if((parseFloat($scope.paidAmountCashReturn) == 0) && (parseFloat($scope.paidAmountCreditReturn) != 0)
                    && (parseFloat($scope.paidAmountDebitReturn) == 0) && (parseFloat($scope.paidAmountCheckReturn) == 0) )
                {
                    paidRTCh =0;
                    paidRTCr =parseFloat(parseFloat($scope.retTotalPrice).toFixed(2));
                    paidRTDb = 0;
                    paidRTCs = 0;
                }
                else if((parseFloat($scope.paidAmountCashReturn) == 0) && (parseFloat($scope.paidAmountCreditReturn) == 0)
                    && (parseFloat($scope.paidAmountDebitReturn) != 0) && (parseFloat($scope.paidAmountCheckReturn) == 0) )
                {
                    paidRTCh =0;
                    paidRTCr =0;
                    paidRTDb = parseFloat(parseFloat($scope.retTotalPrice).toFixed(2));
                    paidRTCs = 0;
                }
                else if((parseFloat($scope.paidAmountCashReturn) == 0) && (parseFloat($scope.paidAmountCreditReturn) == 0)
                    && (parseFloat($scope.paidAmountDebitReturn) == 0) && (parseFloat($scope.paidAmountCheckReturn) != 0) )
                {
                    paidRTCh =parseFloat(parseFloat($scope.retTotalPrice).toFixed(2));
                    paidRTCr =0;
                    paidRTDb = 0;
                    paidRTCs = 0;
                }
                else
                {
                    paidRTCh =0;
                    paidRTCr =0;
                    paidRTDb = 0;
                    paidRTCs = parseFloat(parseFloat($scope.retTotalPrice).toFixed(2));
                }
                if(length == $rootScope.returnData.length)
                {
                    var status = "r";
                }
                else
                {
                    var status = "p";
                }
                request = {
                    "transactionDate":js_yyyy_mm_dd_hh_mm_ss() ,
                    "totalAmount":-(parseFloat(parseFloat($scope.retTotalPrice).toFixed(2))),
                    "tax":-(Math.abs(parseFloat(parseFloat($scope.retTotalTax).toFixed(2)))),
                    "discount":-(parseFloat(parseFloat($scope.retTotalDisc).toFixed(2))) ,
                    "customerPhoneNo":$scope.returnPhone,
                    "userId":sessionStorage.userId,
                    "status":status,
                    "paidAmountCash":-(paidRTCs),
                    "changeAmount":-($scope.changeAmountReturn),
                    "paidAmountDebit":-(paidRTDb),
                    "paidAmountCheck":-(paidRTCh),
                    "paidAmountCredit":-(paidRTCr),
                    "transactionCompId":$scope.lastTransId,
                    "subTotal":-(parseFloat(parseFloat($scope.subTotal).toFixed(2))),
                    "totalQuantity":-(parseInt($scope.totalQuantity)),
                    "transCreditId":-($scope.transCreditIdReturn),
                    "last4Digits":-($scope.last4Return),
                    "prevBalance":-(parseFloat(parseFloat($scope.returnprevBalance).toFixed(2))),
                    "balance":-($scope.balanceReturn),
                    "receiptNote":$scope.receiptNoteReturn,
                    "transactionNote":$scope.transactionNoteReturn

                };
                request = JSON.stringify(request);
                dataService.Post(url, request, returnTransactionSuccessHandler,
                    returnTransactionErrorHandler, "application/json",
                    "application/json");




        };
        function returnTransactionSuccessHandler(response) {
            /*
             * $rootScope.returnData = []; $scope.totalQuantity = 0;
             * $scope.subTotal = 0; $scope.productTotal = 0;
             * $rootScope.totalPayment = 0;
             */
            var url = GlobalConstants.URLCONSTANTS+"editTransactionLineItem?previousTransId="
                + $scope.previousId;
            var request = [];
            if(length == $rootScope.returnData.length)
            {
                var status = "r";
            }
            else
            {
                var status = "p";
            }
            for (var i = 0; i < $rootScope.returnData.length; i++) {
              if($scope.retPrd[i] == true) {
                  request.push({

                      "transactionCompId": $scope.lastTransId,
                      "productNumber": $rootScope.returnData[i].itemNo,
                      "quantity": -(parseInt($rootScope.returnData[i].quantity)),
                      "retail": -(parseFloat(parseFloat($rootScope.returnData[i].retail).toFixed(2))),
                      "cost": -(parseFloat(parseFloat($rootScope.returnData[i].costPrice).toFixed(2))),
                      "discount": -(parseFloat(parseFloat($rootScope.returnData[i].discount).toFixed(2))),
                      "retailWithDis": -(parseFloat(parseFloat($rootScope.returnData[i].retWithDisc).toFixed(2))),
                      "totalProductPrice": -(parseFloat(parseFloat($rootScope.returnData[i].totalWithOutTax).toFixed(2))),
                      "transactionDate": js_yyyy_mm_dd_hh_mm_ss(),
                      "discountPercentage": -($rootScope.returnData[i].discountPercentage),
                      "transactionStatus": status,
                      "totalProductPriceWithTax": -(parseFloat(parseFloat($rootScope.returnData[i].totalWithTax).toFixed(2))),
                      "imeiNo": $rootScope.returnData[i].imeiNo,
                      "phoneId": $rootScope.returnData[i].phoneId

                  });
              }
                }
                request = JSON.stringify(request);
                dataService.Post(url, request,
                    returnTransactionLineItemSuccessHandler,
                    returnTransactionLineItemErrorHandler, "application/json",
                    "application/json");

        }
        function returnTransactionErrorHandler(response) {

        }
        function returnTransactionLineItemSuccessHandler(response) {
            $rootScope.returnData = [];
            $scope.totalQuantity = 0;
            $scope.subTotal = 0;
            $scope.retTotalPrice = 0;
            $scope.retTotalPrice = 0;
            $scope.totalRetailDisc = 0;
            $scope.returnprevBalance =0;
            getProductDetails.getProductDetail();
            var _tmPath = 'app/sell/printReceiptModal.html';
            var _ctrlPath = 'PrintRecepitController';
            DialogFactory.show(_tmPath, _ctrlPath,
                $scope.callBackReturnPrint);

        }
        function returnTransactionLineItemErrorHandler() {

        }

        $scope.callBackReturnPrint = function()
        {
            if(GlobalVariable.printReceiptTrans == true)
            {
                getStoreAddress();
            }
        };
        function getStoreAddress()
        {
            var url=GlobalConstants.URLCONSTANTS+'getPageSetUpDetails';
            dataService.Get(url,onStoreSuccess,onStoreError,'application/json','application/json');
        }
        function onStoreSuccess(response)
        {
            GlobalVariable.storeAddress = response[0].storeAddress;
            GlobalVariable.footerReceipt = response[0].footerReceipt;
            if((response[0].receiptType).toString() == "0")
                GlobalVariable.showRcptType = 'A4';
            else if((response[0].receiptType).toString() == "1")
                GlobalVariable.showRcptType = 'Thermal';

            if(GlobalVariable.showRcptType == 'Thermal')
            {
                $window.open(GlobalConstants.URLCONSTANTS+'getReceiptDetailsForThermalPrint?receiptId='+$scope.lastTransId
                    ,'_blank');
            }
            else
            {
                var url=GlobalConstants.URLCONSTANTS+"getReceiptDetails?receiptId="+$scope.lastTransId;
                dataService.Get(url,getPrintSuccessHandler,getPrintErrorHandler,"application/json","application/json");
            }
        }
        function onStoreError(error)
        {

        }
        function getPrintSuccessHandler(response)
        {
            GlobalVariable.receiptReturnData =response;
            GlobalVariable.receiptCOmmonData=response;
            if(response.length!== 0) {
                $rootScope.itemTotalReturn = Number(parseFloat(GlobalVariable.receiptReturnData[0].transactionDtoList[0].subTotal) + parseFloat(GlobalVariable.receiptReturnData[0].transactionDtoList[0].lineItemDiscount)).toFixed(2);


                for (var i = 0; i < GlobalVariable.receiptReturnData[0].transactionLineItemDtoList.length; i++) {
                    $rootScope.modifiedTransReturnData.push(
                        {
                            "productNumber": GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].productNumber,
                            "productDescription": GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].productDescription,
                            "retail": GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].retail,
                            "discountPercentage": GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].discountPercentage,
                            "retwdisc": (parseFloat(GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].totalProductPrice) / parseFloat(GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].quantity)).toFixed(2),
                            "quantity": GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].quantity,
                            "totalProductPrice": GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].totalProductPrice,
                            "imeiNo":GlobalVariable.receiptReturnData[0].transactionLineItemDtoList[i].imeiNo
                        }
                    );
                }
            }

            $rootScope.printTransFirstNameReturn='';
            $rootScope.printTransLastNameReturn ='';
            $rootScope.printTransStreetReturn='';
            $rootScope.printTransCityReturn='';
            $rootScope.printTransStateReturn='';
            $rootScope.printTransCountryReturn='';
            $rootScope.printTranszipCodeReturn='';
            $rootScope.printTransPhoneReturn='';
            $rootScope.printTransCompanyReturn = '';
            if(response.length !==0)
            {
                if(GlobalVariable.receiptReturnData[0].customerDtosList .length !== 0)
                {
                    $rootScope.printTransFirstNameReturn=GlobalVariable.receiptReturnData[0].customerDtosList[0].firstName;
                    $rootScope.printTransLastNameReturn =GlobalVariable.receiptReturnData[0].customerDtosList[0].lastName;
                    $rootScope.printTransStreetReturn=GlobalVariable.receiptReturnData[0].customerDtosList[0].street;
                    $rootScope.printTransCityReturn=GlobalVariable.receiptReturnData[0].customerDtosList[0].city;
                    $rootScope.printTransStateReturn=GlobalVariable.receiptReturnData[0].customerDtosList[0].state;
                    $rootScope.printTransCountryReturn=GlobalVariable.receiptReturnData[0].customerDtosList[0].country;
                    $rootScope.printTranszipCodeReturn=GlobalVariable.receiptReturnData[0].customerDtosList[0].zipcode;
                    $rootScope.printTransPhoneReturn=GlobalVariable.receiptReturnData[0].customerDtosList[0].phoneNo;
                    $scope.printTransCompanyReturn =GlobalVariable.receiptReturnData[0].customerDtosList[0].companyName;

                }
            }

            //if(GlobalVariable.showRcptType == 'A4') {
            GlobalVariable.isPrintPage = true;
            $timeout(function () {
                $window.print();
                GlobalVariable.isPrintPage = false;
            }, 2000);
            //}
            /*else if(GlobalVariable.showRcptType == 'Thermal')
             {
             GlobalVariable.isPrintPage = false;
             $window.open(GlobalConstants.URLCONSTANTS+'getReceiptDetailsForThermalPrint?receiptId=10'
             ,'_blank');
             }*/

        }
        function getPrintErrorHandler(response)
        {

        }
        $scope.returnSelectedProd = function(id,row)
        {
                console.log($scope.retPrd[id]);
            $scope.loadCheckOutData();
        };
        $scope.navigateToSellPage = function() {
            $state.go('sell');
        };
        function getTaxDetails() {
            var url = GlobalConstants.URLCONSTANTS+'getPageSetUpDetails';
            dataService.Get(url, onGetTaxSuccess, onGetTaxError,
                'application/json', 'application/json');
        }
        function onGetTaxSuccess(response) {
            $scope.totalDefaultTax = response[0].tax;

            $scope.selectReturnTax = "default";
            $scope.loadCheckOutData();
        }
        function onGetTaxError(response) {

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
        render();
    }

})();
