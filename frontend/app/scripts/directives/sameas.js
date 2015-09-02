'use strict';

angular.module('nodetokenappApp')
  .directive('validateEquals', function () {
    return {

    	require: 'ngModel',
    	link: function (scope, element, attrs, ngModelCtrl) {
    		
    		// TODO: do a course on directives on pluralsight

    		function validateEqual (value) {
    			var valid = (value === scope.$eval(attrs.validateEquals));
    			ngModelCtrl.$setValidity('equal', valid);
    			return valid ? value : undefined;
    		}
    		ngModelCtrl.$parsers.push(validateEqual);
    		ngModelCtrl.$formatters.push(validateEqual);

    		scope.$watch(attrs.validateEquals, function () {
    			ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
    		})
    	}
    };
  });
