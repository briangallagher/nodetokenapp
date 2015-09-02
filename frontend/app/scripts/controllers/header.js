'use strict';

angular.module('nodetokenappApp').controller('HeaderCtrl', function ($scope, authToken) {

	$scope.isAuthenticated = authToken.isAuthenticated;

});
