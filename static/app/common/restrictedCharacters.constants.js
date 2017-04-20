(function() {
	'use strict';
	angular.module('sampleApp')

	.constant("RestrictedCharacter.Types", {
		JobName : {
			regExp : /[<>]/g,
			label : "Characters <> disallowed"
		},
		Nickname : {
			regExp : /[~'!$^\[\]{}|\\?<>`+=_\"%]/g,
			label : "Special characters disallowed"
		},
		Special : {
			regExp : /[^a-zA-Z0-9. ]/g,
			label : "Non-alphabetic and non-numeric characters disallowed"
		},
		TIN : {
			regExp : /[^\d-]/g,
			label : "Non-numeric characters disallowed"
		},
		Numeric : {
			regExp : /[^\d.-]/g,
			label : "Non-numeric characters disallowed, numbers,period and dash allowed"
		},
		NumericWithPeriod : {
			regExp : /[^\d.]/g,
			label : "Non-numeric characters disallowed, numbers,period and dash allowed"
		},
		Alphabet : {
			regExp : /[^a-zA-Z ]/g,
			label : "Non-alphabetic characters disallowed"
		},
		Date : {
			regExp : /(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/((19|20)\\d\\d)/g,
			label : "Enter a valid date of the form mm/dd/yyyy"
		},
		Decimal : {
			regExp : /[^0-9-.]/g,
			label : "Whole and Decimal Numbers only"
		},
		OnlyDigits : {
			regExp : /[^0-9]/g,
			label : "Non-numeric characters disallowed"
		},
		ProdSpecial :{
			regExp:/[^a-zA-Z0-9-_. ]/g,
			label:"Only _,- is allowed"
		},
		NumericPeriod : {
			regExp : /[^a-zA-Z0-9.]/g,
			label : "Non-alphabetic and non-numeric characters disallowed"
		},
		DateField : {
			regExp : /[^0-9/]/g,
			label : "Non-alphabetic and non-numeric characters disallowed"
		},
		AlphaNumeric : {
			regExp : /[^a-zA-Z0-9.]/g,
			label : "Non-alphabetic and non-numeric characters disallowed"
		}

	});
})();