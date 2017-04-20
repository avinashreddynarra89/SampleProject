(function() {
	'use strict';

	angular.module('sampleApp').directive('responsiveTable', ResponsiveTableTwo);

	ResponsiveTableTwo.$inject = [ '$rootScope','$timeout', '$compile', '$window', '$filter', 'screenSize','modalService','GlobalVariable' ];

	function ResponsiveTableTwo($rootScope,$timeout, $compile, $window, $filter, screenSize,modalService,GlobalVariable) {

		return {
			restrict : 'EA',
			priority : 0,
			transclude : true,
			templateUrl : 'app/common/responsiveTable.html',
			scope : {
				ngModel : '=',
				currentPage : '=?',
				pageSize : '=?',
				sortColumn : '=?',
				sortAscending : '=?',
				onSort : '&?',
				emptyMessage : '=?',
				filterValue : '='
			},
			compile : function(element, attrs, transclude) {
				var throwException = function(message) {
					console.log(message);
					throw message;
				};

				var getAttributeValue = function(element, attribute, required, defaultValue) {
					if (element.hasAttribute(attribute))
						return element.getAttribute(attribute);
					else if (angular.isDefined(required) && required) {
						throwException(element.tagName + ' element missing required attribute ' + attribute);
					} else
						return angular.isDefined(defaultValue) ? defaultValue : null;
				};
				var getBooleanAttributeValue = function(element, attribute, required, defaultValue) {
					var value = getAttributeValue(element, attribute, required, defaultValue);
					return (value === true || value === 'true') ? true : false;
				};
				var getScopeAttributeValue = function(element, attribute, required, defaultValue, scope) {
					var value = getAttributeValue(element, attribute, required, defaultValue);
					return value !== undefined ? scope.$eval(value) : value;
				};

				var isIgnorableNodeType = function(element) {
					return (element.nodeType === 3 || element.nodeType === 8);
				};

				var setDefinedOrDefault = function(scope, field, defaultValue) {
					scope[field] = angular.isDefined(scope[field]) ? scope[field] : defaultValue;
				};

				var maximumInteger = Math.pow(2, 53) - 1;
				
				/*
				 * var sortExistingData = function(data, columns, sortColumn,
				 * sortAscending) { var toSortBy = columns[sortColumn]; var
				 * sorted = _.sortBy(data, function(row) { var value =
				 * row[toSortBy.key]; if (typeof value !== 'string' &&
				 * angular.isDefined(value)) value = value.toString(); return
				 * angular.isDefined(value) ? value.toLowerCase() : value; });
				 * return (sortAscending) ? sorted : sorted.reverse(); };
				 */

				//  RXP8292 - Move this function to utility
				// class.
				var sortExistingData = function(array, predicate, type, isAscending, sortFunction) {

					if (!angular.isArray(array)) {
						return array;
					}

					/** Default types supported for sorting * */
					var defaultTypes = [ 'number', 'string', 'date', 'boolean', 'custom', 'creditdate' ];

					/**
					 * Return the original array, as the type is not supported *
					 */
					/*if (_.indexOf(defaultTypes, type) === -1 || type === 'custom' && sortFunction === undefined) {
						return array;
					}*/

					array.sort(function(a, b) {
						var vala = ((a[predicate] != undefined) ? a[predicate] : '');
						var valb = ((b[predicate] != undefined) ? b[predicate] : '');
						if (type === 'creditdate') { // Sort
							// function
							// for
							// credit
							// date
							// mm/yy
							// format
							vala = (vala === '') ? '01/0001' : vala;
							valb = (valb === '') ? '01/0001' : valb;
							var expStatusA = ((a['expiryStatus'] != undefined) ? a['expiryStatus'] : '');
							var expStatusB = ((b['expiryStatus'] != undefined) ? b['expiryStatus'] : '');
							vala = (expStatusA !== '' && expStatusA.toLowerCase() === "expiring") ? '11/2999' : vala;
							vala = (expStatusA !== '' && expStatusA.toLowerCase() === "expired") ? '12/2999' : vala;
							valb = (expStatusB !== '' && expStatusB.toLowerCase() === "expiring") ? '11/2999' : valb;
							valb = (expStatusB !== '' && expStatusB.toLowerCase() === "expired") ? '12/2999' : valb;
							vala = vala.replace(/[\/]/g, "");
							valb = valb.replace(/[\/]/g, "");
							return (isNaN(vala)) ? -1 : ((isNaN(valb)) ? 1 : (vala - valb));
						} else if (type === 'date') {
							vala = (vala === '') ? '01/01/0001' : vala;
							valb = (valb === '') ? '01/01/0001' : valb;
							if (!moment(vala).isBefore(valb))
								return -1;
							if (moment(vala).isBefore(valb))
								return 1;
							return 0;
						} else if (type === 'number') {
							vala = parseFloat(vala);
							valb = parseFloat(valb);
							return (isNaN(vala)) ? -1 : ((isNaN(valb)) ? 1 : (vala - valb));
						} else if (type === 'string') {
							vala = vala.toString().toLowerCase();
							valb = valb.toString().toLowerCase();
							return (vala > valb) ? 1 : (vala < valb) ? -1 : 0;
						} else if (type === 'boolean') {
							return (vala === valb) ? 0 : vala ? -1 : 1;
						} else if (type === 'custom') {
							return sortFunction(vala, valb);
						}
					});
					if (!isAscending) {
						array.reverse();
					}
					return array;
				};

				var watchHidden = function(scope, column, columnElement) {
					var hidden = getAttributeValue(columnElement, 'hidden', false, null);
					if (hidden !== null) {
						console.log("inside hidden = "+ hidden);
						column.hidden = scope.$eval(hidden);
						scope.$watch(function() {
							return scope.$eval(hidden);
						}, function(newValue) {
							column.hidden = newValue;
							updateVisibleCount(scope);
						});
						if(GlobalVariable.customReceiptFalg == 1)
							column.hidden = true;
						else
							column.hidden=false;

					} else {
						console.log("insie hidden else = "+ hidden);
						column.hidden = false;
					}
				};

				var updateVisibleCount = function(scope) {
					var visibleColumnCount = scope.columns.length - $filter('filter')(scope.columns, {
						'hidden' : true
					}).length;
					if (scope.toggleIndex !== Number.MAX_VALUE)
						visibleColumnCount--;
					scope.visibleColumnCount = visibleColumnCount;
				};

				return {
					pre : function preLink(scope, element, attrs, controller) {
						scope.columns = [];
						scope.toggleIndex = Number.MAX_VALUE;
						scope.showToggled = false;

						setDefinedOrDefault(scope, 'currentPage', 1);
						setDefinedOrDefault(scope, 'pageSize', maximumInteger);
						setDefinedOrDefault(scope, 'sortColumn', -1);
						setDefinedOrDefault(scope, 'sortAscending', true);

						transclude(
								scope,
								function(clone) {
									var columns = clone[1];

									// var columns =
									// element.firstChild;
									if (columns.tagName.toLowerCase() !== 'columns') {
										throwException('Responsive table requires a <columns> element');
									}
									for (var i = 0; i < columns.childNodes.length; i++) {
										var columnElement = columns.childNodes[i];

										// skip empty text nodes
										if (isIgnorableNodeType(columnElement))
											continue;
										if (columnElement.tagName.toLowerCase() !== 'column') {
											throwException('Elements inside a <columns> element must be <column> elements');
										}

										var column = {};
										column.colSpan = getAttributeValue(columnElement, 'col-span', false, 1);
										column.toggle = getBooleanAttributeValue(columnElement, 'toggle', false, false);
										if (column.toggle) {
											scope.toggleIndex = scope.columns.length;
										} else {
											column.datatype = getAttributeValue(columnElement, 'datatype', false);
											column.sortFunction = getAttributeValue(columnElement, 'sort-function', false,
													undefined);
											column.name = getAttributeValue(columnElement, 'name', true);
											column.key = getAttributeValue(columnElement, 'key', true);
											column.isActions = getBooleanAttributeValue(columnElement, 'actions', false);
											column.cellClick = getAttributeValue(columnElement, 'cell-click', false);
											column.sortable = getBooleanAttributeValue(columnElement, 'sortable', false, false);
											column.serverSort = getBooleanAttributeValue(columnElement, 'server-sort', false,
													false);
											column.wordWrap = getBooleanAttributeValue(columnElement, 'word-wrap', false, true);
											column.width = getAttributeValue(columnElement, 'width' , true);
											column.padding = getAttributeValue(columnElement, 'padding' , false,true);
											column.border = getAttributeValue(columnElement, 'border' , false,true);
											column.customHidden = getAttributeValue(columnElement, 'ng-if', false, false);

											watchHidden(scope, column, columnElement);

											console.log("column.hidden in ledger="+column.hidden);
											column.cell = null;
											column.header = null;

											if (columnElement.hasChildNodes()) {
												var j = 0;
												var childElement = columnElement.firstChild;
												// skip empty text
												// nodes
												while (j < columnElement.childNodes.length) {
													childElement = columnElement.childNodes[j++];
													if (isIgnorableNodeType(childElement))
														continue;
													if (!isIgnorableNodeType(childElement)) {
														if (childElement.tagName.toLowerCase() === 'cell') {
															column.cell = childElement.innerHTML;
														} else if (childElement.tagName.toLowerCase() === 'header') {
															column.header = childElement.innerHTML;
														} else
															throwException('Element inside a <column> element must be a <header> or <cell> element');
													}
												}
											}
										}

										column.index = scope.columns.length;
										scope.columns.push(column);
									}

									scope.sortableColumns = $filter('filter')(scope.columns, {
										'sortable' : true
									});

									updateVisibleCount(scope);
								});

						scope.startIndex = (scope.pageSize === maximumInteger) ? 0 : ((scope.currentPage - 1) * scope.pageSize);
						scope.$watch(function() {
							return scope.pageSize.toString() + scope.currentPage.toString();
						}, function(newValue) {
							scope.startIndex = (scope.pageSize === maximumInteger) ? 0
									: ((scope.currentPage - 1) * scope.pageSize);
						});
					},
					post : function postLink(scope, element, attrs, controller) {

						var updateDeviceSize = function() {
							scope.viewMobile = screenSize.is('xs, sm');
						};
						angular.element($window).bind('resize', function() {
							scope.$apply(updateDeviceSize());
						});
						updateDeviceSize();

						scope.cellClick = function(row, column) {
							if (column.cellClick !== null) {
								scope.$parent.$eval(column.cellClick)(row, column);
								// scope.$eval(column.cellClick)(row,
								// column);
							}
						};
						scope.Delete = function()
						{
							modalService.showModal('', {
								isCancel : true
							}, "Are you Sure Want to Delete ?.This will delete all rows.", callBackAction);
							
						};
						function callBackAction(isOKClicked)
						{
							
							if(isOKClicked)
							{
								$rootScope.testData = [];
								$rootScope.totalPayment = '0.00';
								$rootScope.customerName = '';
								$rootScope.regPhone = '';
								$rootScope.customerNameOnSearch = '';
								GlobalVariable.customerFound = false;
								$rootScope.totalQuantity = 0;
								$rootScope.subTotal = 0;
								$rootScope.productTotal = 0;
							}	
						}
						scope.sortByColumn = function(columnIndex, column) {
							if (scope.sortColumn === columnIndex) {
								scope.sortAscending = !scope.sortAscending;
							} else {
								scope.sortColumn = columnIndex;
								scope.sortAscending = true;
							}
							var column = scope.columns[columnIndex];
							if (column.serverSort)
								scope.onSort({
									index : columnIndex
								});
							else {
								/*
								 * scope.sortedData =
								 * sortExistingData(scope.ngModel,
								 * scope.columns, scope.sortColumn,
								 * scope.sortAscending);
								 */
								scope.sortedData = sortExistingData(scope.ngModel, column.key, column.datatype,
										scope.sortAscending, column.sortFunction ? scope.$eval(column.sortFunction) : undefined);

							}
						};
						scope.scope = scope.$parent;

						scope.$watch('ngModel', function(newValue, oldValue) {
							scope.sortedData = scope.ngModel;
							scope.sortColumn = -1;
						});
						scope.$watch('filterValue', function(newValue, oldValue) {
							scope.valueFilter = scope.filterValue;
							
						});
					}
				};
			}
		};
	}
})();