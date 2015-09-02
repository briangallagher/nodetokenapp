'use strict';

angular.module('nodetokenappApp').controller('LogoutCtrl', function (authToken, $state) {
	authToken.removeToken();
	$state.go('main');
});
