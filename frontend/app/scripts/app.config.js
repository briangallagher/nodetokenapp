'use strict';

angular.module('nodetokenappApp').config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
  
  	$urlRouterProvider.otherwise('/');

	$stateProvider

	.state('main', {
		url: '/',
		templateUrl: '/views/main.html'
	})

	.state('register', {
		url: '/register',
		templateUrl: '/views/register.html',
		controller: 'RegisterCtrl'
	})

	.state('login', {
		url: '/login',
		templateUrl: '/views/login.html',
		controller: 'LoginCtrl'
	})

	.state('logout', {
		url: '/logout',
		controller: 'LogoutCtrl'
	})

	.state('jobs', {
		url: '/jobs',
		templateUrl: '/views/jobs.html',
		controller: 'JobsCtrl'
	})

	$httpProvider.interceptors.push('authInterceptor');
})

.constant('API_URL', 'http://localhost:3000/')

.run(function ($window) {
	var params = $window.location.search.substring(1);
	// console.log(params);code=4/aBDIhQjsAzrK-uf2L7leJUgE5k8o5A0rtnEikkAoiGs

	if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
		var pair = params.split('=');
		var code = decodeURIComponent(pair[1]);

		$window.opener.postMessage(code, $window.location.origin);
	}

	

});

