(function() {
	'use strict';
	angular.module('sampleApp').directive('proxtraMessage', MessageHandler);

	MessageHandler.$inject = [ "$compile" ];

	function MessageHandler($compile) {
		return {
			restrict : 'A',
			link : function(scope, elem, attrs) {
				var mesId = attrs.proxtraMessage;
				elem.after('<ul id=' + ("proxtra-mes-" + mesId) + ' class="parsley-errors-list"></ul>');
			}
		};
	}

})();