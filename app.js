//Starter Project for the Reddit Clone
var app = angular.module('reddit-clone', ['ngRoute', 'firebase']);

app.constant('fbURL', 'https://kevdit.firebaseio.com');

app.factory('Posts', function ($firebase, fbURL) {
    return $firebase(new Firebase(fbURL)).$asArray();
});

app.config(function($routeProvider){
	$routeProvider
	.when('/', {
		controller: 'MainController',
		templateUrl: 'main.html'
	})
	.otherwise({
		redirectTo: '/'
	})

});

app.controller('MainController', function($scope, $firebase, Posts) {
	$scope.savePost = function (post) {
    	if (post.name && post.description && post.url){
			Posts.$add({
				name: post.name,
				description: post.description,
				url: post.url,
				votes: 0
			})

	        //Resetting all the values
			post.name = "";
			post.description = "";
			post.url = "";
		}
		else {
			alert('Sorry bruh, you need all of those info to be filled!');
		}
	}

	$scope.addVote = function (post) {
        post.votes++;
        Posts.$save(post);
    }

	$scope.deletePost = function (post) {
        //Getting the right URL
		var postForDeletion = new Firebase('https://kevdit.firebaseio.com/' + post.$id);
        //Removing it from Firebase
        postForDeletion.remove();
    }
});