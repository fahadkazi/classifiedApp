// public/js/controllers/MainCtrl.js
var app = angular.module('classifiedApp');

app.controller('NavCtrl', function($scope, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logout = auth.logout;
});

app.controller('AuthCtrl', function($scope, $location, auth) {
	$scope.user = {};

	$scope.register = function() {
		auth.register($scope.user).then(function(response) {
			$location.path('/');
		}, function(response) {
			$scope.error = response.data;
		});
	}

	$scope.login = function() {
		auth.login($scope.user).then(function(response) {
			$location.path('/');
		}, function(response) {
			$scope.error = response.data;
		});
	};

	$scope.go = function(path) {
		$location.path(path);
	};
});

app.controller('UsersCtrl', function($scope, userService) {
	$scope.users = userService.users;
});

app.controller('ClassifiedController', function($scope, classifiedService, $mdSidenav, $mdDialog, $http, $location, auth) {
	$scope.currentUser = auth.currentUser();
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.logout = function() {
		auth.logout();
		$location.path('/login');
	};

	$scope.editing = false;
	$scope.classifieds = classifiedService.classifieds;

	$scope.newClassified = function(classified) {
		$scope.title = "Add Classified";
		$scope.openSideNav();
		$scope.classified = {};
		$scope.editing = false;
	};

	$scope.saveClassified = function(classified) {
		if (classified) {
			classifiedService.createClassifieds(classified);
			$scope.closeSideNav();
			$scope.classified = {};
		}
	};

	$scope.editClassified = function(classified) {
		$scope.openSideNav();
		$scope.classified = classified;
		$scope.title = "Edit Classified";
		$scope.editing = true;
	};

	$scope.saveEdit = function(id, classified) {
		classifiedService.editClassified(id, classified);
		$scope.closeSideNav();
		$scope.showAdmin = false;
	};

	$scope.deleteClassified = function($index, event, id) {
		var confirm = $mdDialog.confirm()
			.title('Are you sure?')
			.ok('Yes')
			.cancel('No')
			.targetEvent(event);
		$mdDialog.show(confirm).then(function() {
			classifiedService.classifieds.splice($index, 1);
			classifiedService.deleteClassified(id);
		});
	};

	$scope.openSideNav = function() {
		$mdSidenav('left').open();
	};
	$scope.closeSideNav = function() {
		$mdSidenav('left').close();
	};
});