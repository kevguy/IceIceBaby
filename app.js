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

	$scope.posts = Posts;

	$scope.savePost = function (post) {
    	if (post.name && post.description && post.url && $scope.authData){
            //Actually adding the posts to the Firebase
			Posts.$add({
                //Setting the post name
				name: post.name,
                //Setting the post description
				description: post.description,
                //Setting the post URL
				url: post.url,
                //Setting the post votes
				votes: 0,
                //Getting the current user
				user: $scope.authData.twitter.username
			})

	        //Resetting all the values
			post.name = "";
			post.description = "";
			post.url = "";
		}
		else {
			alert('Sorry bruh, make sure y0ou have all the info filled and you are signed in!');
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

    $scope.addComment = function (post, comment) {
    	if ($scope.authData) {
    		var ref = new Firebase('https://kevdit.firebaseio.com/' + post.$id + '/comments');
    		var sync = $firebase(ref);
    		$scope.comments = sync.$asArray();
    		$scope.comments.$add({
    			user: $scope.authData.twitter.username,
    			text: comment.text
    		});
    	}
    	else {
    		alert('You need to be logged in before doing that!');
    	}
    }

    $scope.removeComment = function(post, comment) {
    	var commentForDeletion = new Firebase('https://kevdit.firebaseio.com/' + post.$id + '/comments/' + comment.$id);
    	commentForDeletion.remove();
    }

    $scope.login = function() {
        //Creating a refrence URL with Firebase
    	var ref = new Firebase('https://kevdit.firebaseio.com/');
        //Doing the OAuth popup
    	ref.authWithOAuthPopup('twitter', function(error, authData){
    		if (error){
    			alert('Sorry bruh, there was an error.');
    		}
            //If the user is logged in correctly
    		else {
    			alert('You were logged in successfully.');
    		}
            //Set the authData we get to a global variable that can be used
    		$scope.authData = authData;
    	});
    }
});