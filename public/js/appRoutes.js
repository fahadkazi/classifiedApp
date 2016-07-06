// public/js/appRoutes.js
angular.module('classifiedApp').config(function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'ClassifiedController',
            resolve: {
            	classifiedPromise: function(classifiedService) {
            		return classifiedService.getClassifieds();
            	}
            }
        })
        .when('/register', {
        	templateUrl: 'views/register.html',
        	controller: 'AuthCtrl'
        })
        .when('/login', {
        	templateUrl: 'views/login.html',
        	controller: 'AuthCtrl'
        })
        .when('/users', {
        	templateUrl: 'views/users.html',
        	controller: 'UsersCtrl',
        	resolve: {
        		userPromise: function(userService) {
        			return userService.getUsers();
        		}
        	}
        });

    $locationProvider.html5Mode(true);

});