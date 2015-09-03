'use strict';

angular.module('nodetokenappApp').service('auth', function auth($http, API_URL, authToken, $state, $window, $q) {

	function authSuccessful (res) {
		authToken.setToken(res.token);
		$state.go('main');
	}

	this.login = function (email, password) {
		return $http.post(API_URL + 'login', {
			email:email, 
			password:password
		}).success(authSuccessful)
	}

	this.register = function (email, password) {
		return $http.post(API_URL + 'register', {
			email:email, 
			password:password
		}).success(authSuccessful)		
	}

	var urlBuilder = [];
	urlBuilder.push('response_type=code',
		'client_id=637856473021-bhlcimn601357ba36smf1fdv3a44n0rj.apps.googleusercontent.com',
		'redirect_uri='+window.location.origin,
		'scope=profile email');

	// https://console.developers.google.com/project/psjwt-1056/apiui/credential?authuser=1
	this.googleAuth = function () {
		var options = "width=500, height=500, left=100, top=100"
		var url = 'https://accounts.google.com/o/oauth2/auth?' + urlBuilder.join('&');

		var deferred = $q.defer();

		var popup = $window.open(url, '', options);
		$window.focus();
		$window.addEventListener('message', function (event) {
			if (event.origin === $window.location.origin) {
				var code = event.data;
				popup.close();

				$http.post(API_URL + 'auth/google', {
					code:code,
					clientId: '637856473021-bhlcimn601357ba36smf1fdv3a44n0rj.apps.googleusercontent.com',
					redirectUri: $window.location.origin
				}).success(function (jwt) {
					authSuccessful(jwt);
					deferred.resolve(jwt);
				});
			}
		});
		return deferred.promise;
	}

});
