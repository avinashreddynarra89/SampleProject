(function() {
	'use strict';

	angular.module('sampleApp').factory('util', Util);

	Util.$inject = [];

	function Util() {
		var utilClass = {};
		utilClass.log = function(_msg) {
			var date = new Date;
			var h = date.getHours();
			if (h < 10) {
				h = "0" + h;
			}
			var m = date.getMinutes();
			if (m < 10) {
				m = "0" + m;
			}
			var s = date.getSeconds();
			if (s < 10) {
				s = "0" + s;
			}
			var result = '' + h + ':' + m + ':' + s;
			try {
				console.log(result + '-->' + _msg);
			} catch (e) {

			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.createTags = {
			div : function(props) {
				var tag = "<div class='" + props.className + "'>" + props.data + "</div>";
				return tag;
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.throwMessage = function(_showMe, _msg) {
			var _className;
			if (_showMe === 'error') {
				_className = 'errorDivClass';
			} else if (_showMe === 'success') {
				_className = 'successDivClass';
			}
			var tags = this.createTags.div({
				'data' : _msg,
				'className' : _className
			});
			return tags;
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.getMaxZIndex = function() {
			var zIndexMax = 0;
			$('div').each(function() {
				var z = parseInt($(this).css('z-index'));
				if (z > zIndexMax) {
					zIndexMax = z;
				}
			});
			return zIndexMax + 10;
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.Wait = function(wait) {
			if (wait) {
				if ($(".blockOverlay").length > 0) {
					return false;
				}
				$.blockUI({
					message : '<img src="./assets/images/progressIndicator.gif" class="spin-loader"/>',
					baseZ : 10001,
					onUnblock : function() {
					},
					css : {
						"backgroundColor" : "none",
						"border" : "0px",
						"text-align" : "center",
						"height" : "auto"
					}
				});
			} else {
				$.unblockUI();
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.showErrorFields = function(_showFieldID) {
			if (!Array.isArray(_showFieldID)) {
				$("#" + _showFieldID).removeClass('input').addClass('errorStyle');
			} else {
				Array.each(_showFieldID, function(k, v) {
					$("#" + k).removeClass('input').addClass('errorStyle');
				});
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.clearErrorFields = function(_showFieldID) {
			if (!Array.isArray(_showFieldID)) {
				$("#" + _showFieldID).removeClass('errorStyle').addClass('input');
			} else {
				Array.each(_showFieldID, function(k, v) {
					$("#" + k).removeClass('errorStyle').addClass('input');
				});
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.focus = function(_elemId) {
			if (!Array.isArray(_elemId)) {
				$("#" + _elemId).focus();
			} else {
				$("#" + _elemId[0]).focus();
			}
		};

		utilClass.showErrorAndFocus = function(_msgDiv, _elemId, _msg) {
			$("#" + _msgDiv).html('');
			$("#" + _msgDiv).append(this.throwMessage('error', _msg));
			this.showErrorFields(_elemId);
			if (!Array.isArray(_elemId)) {
				$("#" + _elemId).focus();
			} else {
				$("#" + _elemId[0]).focus();
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.formatCreditDebitNbr = function(_elementVal) {
			var formattedVal;
			if (_elementVal && _elementVal.length > 12 && _elementVal.length <= 16) {
				formattedVal = [ _elementVal.slice(0, 4), '-', _elementVal.slice(4, 8), '-', _elementVal.slice(8, 12), '-',
						_elementVal.slice(12) ].join('');
			} else if (_elementVal && _elementVal.length > 8 && _elementVal.length <= 12) {
				formattedVal = [ _elementVal.slice(0, 4), '-', _elementVal.slice(4, 8), '-', _elementVal.slice(8) ].join('');
			} else if (_elementVal && _elementVal.length > 4 && _elementVal.length <= 8) {
				formattedVal = [ _elementVal.slice(0, 4), '-', _elementVal.slice(4) ].join('');
			} else {
				formattedVal = _elementVal;
			}
			return formattedVal;
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.formatPhoneNbr = function(_elementVal) {
			var formattedVal;
			if (_elementVal && _elementVal.length > 3 && _elementVal.length <= 6) {
				formattedVal = [ _elementVal.slice(0, 3), '-', _elementVal.slice(3) ].join('');
			} else if (_elementVal && _elementVal.length > 6) {
				formattedVal = [ _elementVal.slice(0, 3), '-', _elementVal.slice(3, 6), '-', _elementVal.slice(6, 10) ].join('');
			} else {
				formattedVal = _elementVal;
			}
			return formattedVal;
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.formatSkuNumber = function(_elementVal) {
			_elementVal = _elementVal.toString();
			var length = 10 - _elementVal.length;
			for (var i = 0; i < length; i++) {
				_elementVal = "0" + _elementVal;
			}
			return [ _elementVal.slice(0, 4), '-', _elementVal.slice(4, 7), '-', _elementVal.slice(7, 10) ].join('');
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		// to check if object is empty or not
		utilClass.isEmpty = function(obj) {
			for ( var key in obj) {
				if (obj.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.customError = {
			create : function(_elem, _msg) {
				var ulElem, mesId, thisInstance;
				thisInstance = this;
				_elem.addClass("parsley-error");
				mesId = _elem.attr("data-proxtra-message");
				ulElem = $("#proxtra-mes-" + mesId);
				var liTag = thisInstance.li({
					'data' : _msg,
					'className' : 'parsley-required'
				});
				ulElem.append(liTag);
				ulElem.removeClass("filled").addClass("filled");
			},
			destroy : function(_elem) {
				var ulElem, mesId;
				_elem.removeClass("parsley-error");
				mesId = _elem.attr("data-proxtra-message");
				ulElem = $("#proxtra-mes-" + mesId);
				ulElem.find("li").remove();
				ulElem.removeClass("filled");
			},
			show : function(_elemId, _msg) {
				var elem, thisInstance;
				thisInstance = this;
				if (!Array.isArray(_elemId)) {
					elem = $("#" + _elemId.id);
					this.create(elem, _elemId.msg);
					elem.focus();
				} else {
					angular.forEach(_elemId, function(k, v) {
						elem = $("#" + k.id);
						thisInstance.create(elem, k.msg);
					});

					if (_elemId[0].id !== "reg-password" && _elemId[0].id !== "confirmpassword") {
						$("#" + _elemId[0].id).focus();
					}
				}
				return false;
			},
			hide : function(_elemId) {
				var elem, thisInstance;
				thisInstance = this;
				if (!Array.isArray(_elemId)) {
					elem = $("#" + _elemId);
					this.destroy(elem);
				} else {
					angular.forEach(_elemId, function(k, v) {
						elem = $("#" + k);
						thisInstance.destroy(elem);
					});
				}
				return false;
			},
			li : function(props) {
				var tag = "<li class='" + props.className + "'>" + props.data + "</li>";
				return tag;
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.formatISTtoMMDDYYYY = function() {
			// return (date.getMonth() + 1) + '/' + date.getDate() + '/'
			// +
			// date.getFullYear();
			var newDate = new Date(), mnth = ("0" + (newDate.getMonth() + 1)).slice(-2), day = ("0" + newDate.getDate())
					.slice(-2);
			return [ mnth, day, newDate.getFullYear() ].join("/");
		};
		
	utilClass.formatISTtoYYYYMMDD= function() {
			// return (date.getMonth() + 1) + '/' + date.getDate() + '/'
			// +
			// date.getFullYear();
			var newDate = new Date(), mnth = ("0" + (newDate.getMonth() + 1)).slice(-2), day = ("0" + newDate.getDate())
					.slice(-2);
			return [ newDate.getFullYear(), mnth, day ].join("-");
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		/***********************************************************************
		 * Method to download files through a temporary form request needs to be
		 * a javascript object method can be POST || GET path is the url to
		 * download the file
		 **********************************************************************/

		utilClass.downloadFile = function(path, request, method, target, isNewWindow, windowObj) {
			
			
			var paramArray='';		
			var parameters = (typeof request == 'string') ? request : $.param(request);
			if(parameters == "")
			{
				 paramArray = path.split('?');
				 paramArray = paramArray[1].split('&');
			}
			else
			{
				paramArray = parameters.split('&');
			}	
			
			var inputElemsHTML = '';
			angular.forEach(paramArray, function(param) {
				var keyValuePair = param.split('=');
				inputElemsHTML += '<input type="hidden" name="' + keyValuePair[0] + '" value="' + keyValuePair[1] + '" />';
			});
			var formHTML = '<form action="' + path + '" method="' + method + '" target="' + (target || '_self')
					+ '">' + inputElemsHTML + '</form>';
			if (isNewWindow) {
				$(windowObj.document).find('div').append(formHTML);
				$(windowObj.document).find('form').submit();
			} else {
				angular.element(formHTML).appendTo('body').submit().remove();
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.openInNewTab = function(htmlData, windowObj) {
			var newWindow = (windowObj) ? windowObj : window.open('', '_blank');
			newWindow.document.open();
			newWindow.document.write(htmlData);
			newWindow.document.close();
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.convertToMMDDYYY = function(_dateString) {
			_dateString = _dateString.split('-');
			return _dateString[1] + "/" + _dateString[2] + "/" + _dateString[0];
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.isNullOrEmpty = function(_scopeVariable) {
			if (angular.isUndefined(_scopeVariable) || (_scopeVariable == null) || (_scopeVariable == "")) {
				return true;
			} else {
				return false;
			}
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.convertObjectToArray = function(object) {
			var _arrObject = new Array();
			if (Array.isObject(object)) {
				_arrObject = $.makeArray(object);
			} else {
				_arrObject = object;
			}
			return _arrObject;
		};
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		utilClass.determinePwdStrength = function(newPwdFieldValue, emailIdUsed) {
			if ((newPwdFieldValue != null && newPwdFieldValue != "" && newPwdFieldValue.length < 8)) {
				// applyPwdCss('red', 'white', 'white', '1px solid red',
				// '1px solid gray', '1px solid gray', '8px', 'WEAK');
				return "weak";
			} else if (newPwdFieldValue.length >= 8) {
				var emailId = '';
				var pwdVal = '';
				var isInCmnPwdList = false;
				var pwdRate = 0;

				if (!this.isNullOrEmpty(emailIdUsed)) {
					emailId = $.trim(emailIdUsed.toUpperCase());
				}
				pwdVal = $.trim(newPwdFieldValue.toUpperCase());
				/**
				 * Check whether the new Password entered is there in the Common
				 * Password List or exactly matches Log-In ID
				 */
				isInCmnPwdList = this.validatePwdAgainstCmnPwdList(newPwdFieldValue);
				if (isInCmnPwdList
						|| newPwdFieldValue.toUpperCase().split(newPwdFieldValue[0].toUpperCase()).length - 1 == newPwdFieldValue.length) {
					// / applyPwdCss('red', 'white', 'white', '1px solid
					// red', '1px solid gray', '1px solid gray', '8px',
					// 'WEAK');
					return "weak";
				} else if ((pwdVal == emailId)) {
					return "weakPwd";
				} else {
					pwdRate = 0;
					pwdRate = this.getPwdRating(newPwdFieldValue);
					if ((newPwdFieldValue.length > 8 && newPwdFieldValue.length <= 12 && pwdRate > 2)
							|| (newPwdFieldValue.length > 12 && newPwdFieldValue.length <= 70 && pwdRate >= 2)) {
						// /applyPwdCss('green', 'green', 'green', '1px
						// solid green', '1px solid green', '1px solid
						// green', '8px', 'STRONG');
						return "strong";
					} else if ((newPwdFieldValue.length == 8 && pwdRate != 0)
							|| (newPwdFieldValue.length > 8 && newPwdFieldValue.length <= 12 && (pwdRate == 1 || pwdRate == 2))
							|| (newPwdFieldValue.length > 12 && newPwdFieldValue.length <= 70 && pwdRate == 1)) {
						// / applyPwdCss('orange', 'orange', 'white',
						// '1px
						// solid orange', '1px solid orange', '1px solid
						// gray', '8px', 'GOOD');
						return "fair";
					} else {
						// / applyPwdCss('red', 'white', 'white', '1px
						// solid
						// red', '1px solid gray', '1px solid gray',
						// '8px',
						// 'WEAK');
						return "weak";
					}

				}
			} else {
				/*
				 * if(!MODEL.blurTriggered ) { applyPwdCss('white', 'white',
				 * 'white', '1px solid gray', '1px solid gray', '1px solid
				 * gray', '8px', ''); }
				 */
				return "weak";
			}
			// // MODEL.blurTriggered = false;
		};

		utilClass.validatePwdAgainstCmnPwdList = function(compareValue) {
			var commonPwd = [];
			var chkPwdInList = false;
			compareValue = $.trim(compareValue.toLowerCase());
			commonPwd = [ '11111111', '12345678', '123123123', '123456789', '987654321', '1234567890', '1q2w3e4r', '1qaz2wsx',
					'abcd1234', 'alexander', 'asdfasdf', 'asdfghjkl', 'baseball', 'chocolate', 'computer', 'football',
					'homedepot', 'homedepot123', 'iloveyou', 'internet', 'jennifer', 'liverpool', 'michelle', 'password',
					'password1', 'princess', 'qwertyuiop', 'sunshine', 'superman', 'trustno1', 'whatever', 'abcdefghi',
					'abcdefgh', '12345678', 'testpassword', 'welcome1' ];
			if ($.inArray(compareValue, commonPwd) != -1) {
				chkPwdInList = true;
			}
			return chkPwdInList;
		};

		utilClass.getPwdRating = function(pwdValue) {
			var rating = 0;
			if (/[a-z]/.test(pwdValue)) {
				rating++;
			}
			if (/[A-Z]/.test(pwdValue)) {
				rating++;
			}
			if (/\d/.test(pwdValue)) {
				rating++;
			}
			if (/^[a-zA-Z0-9 ]*$/.test(pwdValue) == false) {
				rating++;
			}
			return rating;
		};

		utilClass.validateExpiryDate = function(monthVal, YearValue) {
			var isValid = true;

			var cardExpMonth = "";
			var cardExpYear = "";

			if (this.isNullOrEmpty(YearValue) && this.isNullOrEmpty(monthVal)) {
				return true;
			} else if ((this.isNullOrEmpty(YearValue) && !this.isNullOrEmpty(monthVal))
					|| (!this.isNullOrEmpty(YearValue) && this.isNullOrEmpty(monthVal))) {
				return false;
			}

			if (!this.isNullOrEmpty(monthVal)) {
				cardExpMonth = monthVal.toString();
				if (!cardExpMonth.match(/^\d+$/) || parseInt(cardExpMonth) > 12 || parseInt(cardExpMonth) == 0) {
					isValid = false;
				}
			}
			var currentDate = this.formatISTtoMMDDYYYY();
			var _val = currentDate.split('/');
			var dateVal = {
				'expDate' : _val[0],
				'expYear' : _val[2].substring(2, 4)
			};
			var yearLimitMax = parseInt(dateVal.expYear) + 25;
			var yearLimitMin = parseInt(dateVal.expYear);
			if (!this.isNullOrEmpty(YearValue)) {
				cardExpYear = YearValue.toString();
				if (!cardExpYear.match(/^\d+$/) || parseInt(cardExpYear) > yearLimitMax || parseInt(cardExpYear) < yearLimitMin) {
					isValid = false;
				}
			}
			return isValid;
		};

		utilClass.getPgmIdNameMap = function(pgmObjArray) {
			var tempObj = {};
			for (var i = 0; i < pgmObjArray.length; i++) {
				tempObj[pgmObjArray[i].programId] = pgmObjArray[i].programDescription;
			}

			return tempObj;
		};

		utilClass.splitOrderNbrString = function(orderNumber) {
			if (!this.isNullOrEmpty(orderNumber)) {
				return orderNumber.toString().split(',');
			}
			return undefined;
		};
		
		utilClass.getRandomNumberForUrl = function(url) {
			if(url.indexOf('?') < 0) {
				return "?"+Math.random();
			}
			else {
				return "&"+Math.random();
			}
		};
		
		/***This function is used to retrive string between curly braces *******/
		utilClass.getStringBtwBraces = function(str)
		{
			var match ='';
		    var regex =  /{(.*?)}/g;
		    var result = [];
		    
		    while (match = regex.exec(str))
		    {
		        result.push(match[1]);    
		    }
		    
		    return result;
		}
		
		// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		return utilClass;
	}
})();