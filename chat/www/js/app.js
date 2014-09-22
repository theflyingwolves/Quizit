// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('app', {
		controller : 'ChatCtrl'
	})
})

.controller('ChatCtrl', function ($scope, $timeout, $ionicScrollDelegate) {
	$scope.friend = [{
			name : "Trung"
		}
	];
	$scope.data = [{
			qns : "Are you happy?",
			ans : "Yes"
		}, {
			qns : "Are you sad?",
			ans : "No"
		}, {
			qns : "Are you bored?",
			ans : "Yes"
		}, {
			qns : "Are you enjoying?",
			ans : "No"
		}, {
			qns : "Are you sleepy?",
			ans : "Yes"
		}, {
			qns : "Are you awake?",
			ans : "No"
		}, {
			qns : "Are you hungry?",
			ans : "Yes"
		}, {
			qns : "Are you thirsty?",
			ans : "No"
		}
	];
	var wrongAns = ["Hmm wrong. ", "Ok try again with this one. ", "I don't usually say this, but you're wrong. ", "Everyone made mistake, let's try the next one. ",
		"Oh well...", "I can't believe you can't get this correct :( Ok next. ", "I'm sad :( ", "This one you should be able to get correct. ", "Life is hard, right? Let's move on: "];
	var correctAns = ["Correct. ", "Oh you know about this. ", "Good. ", "Well done! ", "That's right. ", "Very good. ", "Spectacular. ", "Good. Now next question: ",
		"You seem to be good with this. "];
	var lastQns = ["Ok this is the last question. ", "This is the last one: ", "Good work. Here is the last question: "];
	$scope.texts = [];
	$scope.QAindex = 0;
	var question = {
		index : $scope.QAindex,
		type : 'question',
		content : $scope.data[$scope.QAindex]['qns'],
		answer : $scope.data[$scope.QAindex]['ans']
	};
	$scope.texts.push(question);
	$scope.addAnswer = function (userAns) {
		if ($scope.QAindex < $scope.data.length) {
			var answer = {
				index : $scope.QAindex,
				type : 'answer',
				content : userAns,
				correct : (userAns === question.answer)
			};
			$scope.texts.push(answer);
			var delay = 1000;
			$timeout(function () {
				$scope.QAindex++;
				if ($scope.QAindex !== $scope.data.length) {
					var nextQnsContent;
					if ($scope.QAindex === $scope.data.length - 1) {
						nextQnsContent = lastQns[Math.floor(Math.random() * lastQns.length)]
					} else {
						nextQnsContent = (answer.correct) ? correctAns[Math.floor(Math.random() * correctAns.length)] : wrongAns[Math.floor(Math.random() * wrongAns.length)];
					}
					nextQnsContent = nextQnsContent + $scope.data[$scope.QAindex]['qns'];
					question = {
						index : $scope.QAindex,
						type : 'question',
						content : nextQnsContent,
						answer : $scope.data[$scope.QAindex]['ans']
					};
					$scope.texts.push(question);
				}
				$ionicScrollDelegate.scrollBottom();
			}, delay);
		}
		$ionicScrollDelegate.scrollBottom();
	};
})