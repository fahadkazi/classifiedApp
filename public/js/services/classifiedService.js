var app =  angular.module('classifiedApp');

app.factory('auth', function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['classified-app-token'] = token;
	};

	auth.getToken = function(token) {
		return $window.localStorage['classified-app-token'];
	};

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		};
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload;
		};
	};

	auth.register = function(user) {
		return $http.post('api/register', user).then(function(response) {
			auth.saveToken(response.data.token);
		});
	};

	auth.login = function(user) {
		return $http.post('api/login', user).then(function(response) {
			auth.saveToken(response.data.token);
		});
	};

	auth.logout = function() {
		$window.localStorage.removeItem('classified-app-token');
	};

	return auth;
});

app.factory('userService', function($http) {
	var o = {
		users: []
	};

	o.getUsers = function() {
		return $http.get('api/users').then(function(response) {
			angular.copy(response.data, o.users);
		});
	};

	return o;
});

app.factory('classifiedService', function($http) {
	var o = {
		classifieds: []
	};

	o.getClassifieds = function() {
		return $http.get('api/classifieds').then(function(response) {
			angular.copy(response.data, o.classifieds);
		});
	};

	o.createClassifieds = function(classified) {
		return $http.post('api/classifieds', classified).then(function(response) {
			o.classifieds.push(response.data);
		});
	};

	o.editClassified = function(id, classified) {
		return $http.put('api/classifieds/' + id, classified).then(function(response) {
			return response.data;
		});
	};

	o.deleteClassified = function(id) {
		return $http.delete('api/classifieds/' + id).then(function(response) {
			console.log(response);
		});
	};

	return o;
})