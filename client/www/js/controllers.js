angular.module('quizit.controllers', [])

.controller('bodyCtrl', function ($scope) {
	$scope.bodyBackground = {
		background : 'url(../img/bg2.jpg)'
	};
})

.controller('sidebarCtrl', function ($scope, $ionicSideMenuDelegate) {
	$scope.sidebarData = [{
			linkId : "menu-item-1",
			imgSrc : "img/lightbulb-outline.png",
			title : "Quiz!t",
			linkAddress : "#/app/friends"
		}, {
			linkId : "menu-item-2",
			imgSrc : "img/star-outline.png",
			title : "Top Quizer",
			linkAddress : "#/app/leaderboard"
		}, {
			linkId : "menu-item-3",
			imgSrc : "img/glasses-outline.png",
			title : "History",
			linkAddress : "#/app/history"
		}, {
			linkId : "menu-item-5",
			imgSrc : "img/chatbubble-outline.png",
			title : "Notification",
			linkAddress : "#/app/notifications"
		}, {
			linkId : "menu-item-4",
			imgSrc : "img/contact-outline.png",
			title : "Log Out",
			linkAddress : "#/app/challenge"
		}
	];
	$scope.toggleSidebar = function () {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.selectSideItem = function (item, index) {
		$scope.activeItem = item;
		$ionicSideMenuDelegate.toggleLeft(false);
	};

	$scope.activeItem = undefined;
})

.controller('FriendListCtrl', function ($scope, $location) {
	$scope.friends = [{
			name : "Wang Kunzhen",
			image : "img/profile_images/user_0.jpeg"
		}, {
			name : "Viet Trung Truong",
			image : "img/profile_images/user_2.jpeg"
		}, {
			name : "Xia Yiping",
			image : "img/profile_images/user_2.jpeg"
		}, {
			name : "Wang Yichao",
			image : "img/profile_images/user_3.jpeg"
		}, {
			name : "Viet Trung Truong",
			image : "img/profile_images/user_4.jpeg"
		}, {
			name : "Xia Yiping",
			image : "img/profile_images/user_0.jpeg"
		}, {
			name : "Wang Yichao",
			image : "img/profile_images/user_1.jpeg"
		}, {
			name : "Viet Trung Truong",
			image : "img/profile_images/user_2.jpeg"
		}, {
			name : "Xia Yiping",
			image : "img/profile_images/user_3.jpeg"
		}, {
			name : "Wang Yichao",
			image : "img/profile_images/user_4.jpeg"
		}
	];

	$scope.selectFriend = function (friend) {
		console.log(friend);
	};

})

.controller('HistoryCtrl', function ($scope) {
	$scope.historyData = [{
			name : "Wang Kunzhen",
			profile_image : "img/glasses-outline.png",
			score : 65
		}, {
			name : "Wang Yichao",
			profile_image : "img/lightbulb-outline.png",
			score : 80
		}, {
			name : "Xia Yiping",
			profile_image : "img/contact-outline.png",
			score : 70
		}, {
			name : "Viet Trung Truong",
			profile_image : "img/chatbubble-outline.png",
			score : 65
		}
	];
})

.controller('LeaderboardCtrl', function ($scope) {
	$scope.leaderboardData = [{
			name : "Wang Kunzhen",
			profile_image : "img/glasses-outline.png",
			score : 1001
		}, {
			name : "Wang Yichao",
			profile_image : "img/lightbulb-outline.png",
			score : 800
		}, {
			name : "Xia Yiping",
			profile_image : "img/contact-outline.png",
			score : 799
		}, {
			name : "Viet Trung Truong",
			profile_image : "img/chatbubble-outline.png",
			score : 653
		}
	];
})

.controller('ChatCtrl', function ($scope, $ionicPopup, $timeout, $ionicScrollDelegate, $location) {
	$scope.friend = {
		name : "Trung"
	};
	$scope.data = [{
			qns : "Are you happy?",
			ans : "Yes"
		}/*
		, {
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
		}*/
	];
	$scope.bonus = 'Today is hot, isn\'t it?';
	var wrongAns = ["Hmm wrong. ", "No you should try again. ", "I don't usually say this, but you're wrong. ", "Everyone made mistake. ",
		"Oh well...", "I can't believe you can't get this correct. ", "I'm sad :( ", "This one you should be able to get correct, but why? ", "Life is hard, right?"];
	var correctAns = ["Correct. ", "Oh you know about this. ", "Good. ", "Well done! ", "That's right. ", "Very good. ", "Spectacular. ",
		"You seem to be good with this. "];
	var slowAns = ["You should answer faster. ", "Correct, but too slow. ", "You could've got some points if you answered faster. ", "Slow! "];
	var preQns = ["Ok here is the next question: ", "Next question: ", "Next: ", "Ok here is the next one: ", "Let's move on: ", "This is the next question: "]
	var lastQns = ["Ok this is the last question. ", "This is the last one: ", "Good work. Here is the last question: "];
	$scope.texts = [];
	$scope.QAindex = 0;
	$scope.deduct = 0;
	var question = {
		index : $scope.QAindex,
		type : 'question',
		content : $scope.data[$scope.QAindex]['qns'],
		answer : $scope.data[$scope.QAindex]['ans']
	};
	var readyTime = 5200;
	//$scope.imgSrc = 'img/notloading.png' + '?v=' + Date.now();
	$scope.showLoadingBar = false;
	var popupImgSource = 'img/countdown.gif' + '?v=' + Date.now();
	var popupTemplate = '<img style="width:100%" src="' + popupImgSource + '"/>';
	$scope.showReady = function () {
		var myPopup = $ionicPopup.show({
				title : '<div class="popup-title">Are you ready?</div>',
				subTitle : '<div class="popup-subtitle popup-big">The faster you answer, the higher score you get</div>',
				template : popupTemplate
			});
		$timeout(function () {
			myPopup.close();
			$scope.texts.push(question);
			//$scope.imgSrc = 'img/loading.gif' + '?v=' + Date.now();
			$scope.showLoadingBar = true;
			$scope.timestamp = Date.now();
		}, readyTime);
	};
	$scope.showReady();
	$scope.showPopup = function () {
		$scope.data = {}
		var report;
		if ($scope.deduct >= 75) {
			report = 'Are you really my friend?';
		} else if ($scope.deduct >= 50) {
			report = 'We should see each other more often';
		} else if ($scope.deduct >= 25) {
			report = 'You seem to know a number of things about me';
		} else if ($scope.deduct >= 10) {
			report = 'You know a lot about me!';
		} else {
			report = 'I think we are good friends :)';
		}
		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
				template : '',
				title : '<div class="popup-title">'+report+'</div>',
				subTitle : '<div class="highlight popup-subtitle">You got ' + (100 - $scope.deduct) + '/100</div>',
				scope : $scope,
				buttons : [{
						text : '<b>Ask Bonus Question</b>',
						type : 'button-energized',
						onTap : function (e1) {
							var titl = '<div class="popup-title">Hi, '+$scope.friend.name+' . I want to Quiz!t you. </div>';
							var templ = '<div class="popup-subtitle">'+$scope.bonus+'</div>';
							var myPopup = $ionicPopup.show({
									template : templ,
									title : titl,
									scope : $scope,
									buttons : [{
											text : '<b>Send with Quiz!t!</b>',
											type : 'button-balanced',
											onTap : function (e) {
												$location.url('../friendlist');
											}
										},
									]
								});
						}
					}, {
						text : '<b>Back to Quiz!t</b>',
						type : 'button-positive',
						onTap : function (e2) {
							$location.url('../friendlist');
						}
					}
				]
			});
	};

	$scope.isButtonDisabled = false;
	$scope.isIdleHidden = true;
	$scope.addAnswer = function (userAns) {
		var newDeduct = Math.floor((Date.now() - $scope.timestamp) / 1000) * 2 - 3;
		if (newDeduct < 0) {
			newDeduct = 0;
		} else if (newDeduct > 10) {
			newDeduct = 10;
		}
		$scope.isButtonDisabled = true;
		$scope.isIdleHidden = false;
		$scope.showLoadingBar = false;
		if ($scope.QAindex < $scope.data.length) {
			var answer = {
				index : $scope.QAindex,
				type : 'answer',
				content : userAns,
				correct : (userAns === question.answer)
			};
			$scope.texts.push(answer);
			if (!answer.correct) {
				newDeduct = 10;
			}
			$scope.deduct += newDeduct;
			var delay = 1000;
			$timeout(function () {
				$scope.QAindex++;
				if ($scope.QAindex < $scope.data.length) {
					var nextQnsContent;
					if (newDeduct < 10) {
						nextQnsContent = correctAns[Math.floor(Math.random() * correctAns.length)];
					} else if (newDeduct === 10 && answer.correct) {
						nextQnsContent = slowAns[Math.floor(Math.random() * slowAns.length)];
					} else {
						nextQnsContent = wrongAns[Math.floor(Math.random() * wrongAns.length)];
					}
					nextQnsContent = nextQnsContent + 'You got ' + (10 - newDeduct) + ((newDeduct >= 9) ? ' point. ' : ' points. ');
					if ($scope.QAindex === $scope.data.length - 1) {
						nextQnsContent = nextQnsContent + lastQns[Math.floor(Math.random() * lastQns.length)];
					} else {
						nextQnsContent = nextQnsContent + preQns[Math.floor(Math.random() * preQns.length)];
					}
					nextQnsContent = nextQnsContent + $scope.data[$scope.QAindex]['qns'];
					question = {
						index : $scope.QAindex,
						type : 'question',
						content : nextQnsContent,
						answer : $scope.data[$scope.QAindex]['ans']
					};
					$scope.texts.push(question);
					//$scope.imgSrc = 'img/loading.gif' + '?v=' + Date.now();
					$scope.showLoadingBar = true;
				} else if ($scope.QAindex === $scope.data.length) {
					var lastResponse;
					if (newDeduct < 10) {
						lastResponse = correctAns[Math.floor(Math.random() * correctAns.length)];
					} else if (newDeduct === 10 && answer.correct) {
						lastResponse = slowAns[Math.floor(Math.random() * slowAns.length)];
					} else {
						lastResponse = wrongAns[Math.floor(Math.random() * wrongAns.length)];
					}
					lastResponse = lastResponse + 'You got ' + (10 - newDeduct) + ((newDeduct >= 9) ? ' point. ' : ' points. ');
					var lastRes = {
						index : $scope.QAindex,
						type : 'question',
						content : lastResponse
					};
					$scope.texts.push(lastRes);
					$scope.showPopup();
					$scope.isIdlehidden = true;
				}
				$ionicScrollDelegate.scrollBottom();
			}, delay);
		}
		$ionicScrollDelegate.scrollBottom();
		$timeout(function () {
			$scope.isButtonDisabled = false;
			$scope.isIdleHidden = true;
			$scope.timestamp = Date.now();
		}, delay + 200);
	};
});