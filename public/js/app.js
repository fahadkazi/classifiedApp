// public/js/app.js
var app = angular.module('classifiedApp', ['ngRoute', 'ngMaterial']);

app.run(function($rootScope, $location, $routeParams, auth) {
	$rootScope.$on('$locationChangeStart', function(ev, next, current) {
		// if (!auth.isLoggedIn() && !$location.path('/register')) {
		// 	$location.path('/login');
		// } else if( !auth.isLoggedIn()) {
		// 	$location.path('/register');
		// } else {
		// 	$location.path('/');
		// }

		var paths = ['/login', '/register'];

		var restrictedPage = paths.indexOf($location.path(), ['/login', '/register']) === -1;
		var loginPath = $location.path() === '/login';
		var registerPath = $location.path() === '/register';
		var loggedIn = auth.isLoggedIn();

		if (restrictedPage && !loggedIn) {
            $location.path('/login');
        } else if(loggedIn && (loginPath || registerPath)) {
        	$location.path('/');
        };
	});
});