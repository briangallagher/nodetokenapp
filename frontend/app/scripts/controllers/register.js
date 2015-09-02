'use strict';

angular.module('nodetokenappApp').controller('RegisterCtrl', function ($scope, alert, auth) {
    
	$scope.submit = function () {

		auth.register($scope.email, $scope.password)
			.success(function (res) {
				alert('success', 'Welcome, ', 'Thanks for registering ' + res.user.email + '!');
			})
			.error(function (err) {
				alert('warning', 'Something went wrong :(' + (err && err.message || ''));
			});
	}

});
	