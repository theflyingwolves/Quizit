angular.module('quizit.controllers', [])

.service('quizitService', function () {
	var friendID;
	var friends = [];
	var serverURL = 'ec2-54-169-65-45.ap-southeast-1.compute.amazonaws.com:3000';
	return {
		friends : function (list) {
			friends = list
				return friends;
		},
		getFriends : function () {
			return friends;
		},
		selectFriend : function (friendId) {
			friendID = friendId;
			return friendID;
		},
		getFriendID : function () {
			return friendID;
		},
		friend : function () {
			var friendr;
			friends.forEach(function (afriend) {
				if (afriend.id === friendID) {
					friendr = afriend;
				}
			});
			return friendr;
		},
		serverURL: function(){
			return serverURL;
		}
	};
})

.controller('bodyCtrl', function ($scope) {
	$scope.bodyBackground = {
		background : 'url(img/bg2.jpg)'
	};

	$scope.friends = new Array();
	$scope.leaderboardData = new Array();
	// $scope.serverURL = 'ec2-54-169-65-45.ap-southeast-1.compute.amazonaws.com:3000';
})

.controller('sidebarCtrl', function ($scope, $ionicSideMenuDelegate) {
  $scope.sidebarData = [{
    linkId:"menu-item-1",
    imgSrc:"img/lightbulb-outline.png",
    title:"Quiz!t",
    linkAddress:"#/app/friends"
  },
  {
    linkId:"menu-item-2",
    imgSrc:"img/star-outline.png",
    title:"Top Quizer",
    linkAddress:"#/app/leaderboard"
  },
  {
    linkId:"menu-item-3",
    imgSrc:"img/glasses-outline.png",
    title:"History",
    linkAddress:"#/app/history"
  },
  {
    linkId:"menu-item-5",
    imgSrc:"img/chatbubble-outline.png",
    title:"Notification",
    linkAddress:"#/app/notification"
  },
  {
    linkId:"menu-item-4",
    imgSrc:"img/contact-outline.png",
    title:"Log Out",
    linkAddress:"#/app/logout"
  }];

	$scope.toggleSidebar = function () {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.selectSideItem = function (index) {
		console.log("Item "+index+" selected");
		$scope.activeIndex = index;
		$ionicSideMenuDelegate.toggleLeft(false);
		if(index == 4){
			console.log("Trying to log out");
			$scope.logoutFacebook();
		}
	};

	$scope.logoutFacebook = function(){
		FB.logout(function(response){
			FB.Auth.setAuthResponse(null, 'unknown');
			console.log("User Logged Out");
		});
	}

	$scope.activeIndex = undefined;
})

.controller('loadingCtrl', function ($scope, $location, $interval) {
	$scope.feedback = "";
	$scope.loadHome = function () {
		FB.getLoginStatus(function (response) {
			if (response.status === "connected") {
				console.log("User Logged in");
				$location.path('/app/friends');
			} else {
				console.log("User Logged Off");
				$location.path('/app/home');
			}
		});
	};

	$interval($scope.loadHome, 2000, 1);
})

.controller('logoutCtrl', function ($scope, $location, $interval) {
	$scope.redirectToHome = function () {
		$location.path('/app/home');
	};

	$interval($scope.redirectToHome, 2000, 1);
})

.controller('homeCtrl',function($scope, $ionicSideMenuDelegate, $http, $location, $interval, quizitService){
	$ionicSideMenuDelegate.canDragContent(false);
	$ionicSideMenuDelegate.toggleLeft(false);

	$scope.redirectToFriends = function () {
		$ionicSideMenuDelegate.canDragContent(true);
		$location.path('/app/friends');
	}

	$scope.fb_login_callback = function(response){
		$scope.initUserData(response);
		// $http.post("http://"+$scope.serverURL+"/users/init",userdata);
		$interval($scope.redirectToFriends,1000,1);
	};

	$scope.initUserData = function(token){
		var access_token = token.authResponse.accessToken;
		var user_id = token.authResponse.userID;

		var serverURL = quizitService.serverURL();

		window.localStorage['access_token'] = access_token;
		window.localStorage['user_id'] = user_id;

		FB.api('/me', function(response) {
			// $http.post("http://"+serverURL+"/users/userInit", response);
			window.localStorage['user_name'] = response.name;
		});

		FB.api('/me', function(response){
			// $http.post("http://"+serverURL+"/users/interestInit", response);
		})

		if($scope.friends.length <= 0){
			FB.api('/me/friends', function(response) {
				$scope.initFriends(response.data, new Array());
			});
		}

		if($scope.leaderboardData.length <= 0){
			$http.get('http://'+serverURL+"/challenges/leaderBoard")
			.success(function(response){
				$scope.initLeaderboardData(response, new Array());
			});
		}

	}

	$scope.initLeaderboardData = function(leaderboard, result){
		if(leaderboard.length <= 0){
			console.log("Finished Leaderboard: "+JSON.stringify(result));
			result = result.reverse();

			for(var i=0; i<result.length; i++){
				$scope.leaderboardData.push(result[i]);
			}

			window.localStorage["leaderboard"] = JSON.stringify(result);

		}else{
			var item = leaderboard.pop();
			var id = item._id;
			FB.api('/'+id+'/picture', function(response){
				item.profile_image = response.data.url;
				item.name = "name";
				item.score = item.total_maxscore;
				result.push(item);
				$scope.initLeaderboardData(leaderboard,result);
			});
		}
	}

	$scope.initFriends = function(friendlist, result){
		if(friendlist.length <= 0){
			console.log("Freinsadafsdddbbb: "+JSON.stringify(result));
			quizitService.friends(result);

			if($scope.friends.length <= 0){
				for(var i=0; i<result.length;i++){
					$scope.friends.push(result[i]);
				}
			}

			if(window.localStorage["friends"]){
				window.localStorage["friends"] = JSON.stringify(result);
			}

			return ;
		}else{
			var friend = friendlist.pop();
			var id = friend.id;
			FB.api('/'+id+'/picture',function(response){
				friend.image = response.data.url;
				result.push(friend);
				$scope.initFriends(friendlist, result);
			})
		}
	};

	$scope.fblogin = function () {
		fb_login($scope.fb_login_callback);
	};
})

.controller('NotificationCtrl', function($scope, quizitService){
	// get data from server about notification: should be done when the app load - use homecontrol, then use quizitService to set data
	/*
	var setData = fuction(){
		$scope.data = quizitService.getNotifications();
	}
	updateNotifications($scope.data);
	setData();	
	*/
	$scope.data = [
		{type: 'question',
		question: 'Are you free on Sunday?'},
		{type: 'question',
		question: 'Are you free on Saturday?'},
		{type: 'answer',
		question: 'Are you free on Monday?',
		name: 'Wang Kunzheng',
		answer: 'N'},
		{type: 'question',
		question: 'Are you free on Tuesday?'},
		{type: 'answer',
		question: 'Are you free on Wednesday?',
		name: 'Colin Tan',
		answer: 'N'}
	];
	// push data back to server	and call quizitService to remove data
	$scope.userResponse = function(question, choice){
		for (var i = 0; i < $scope.data.length; i++){
			if ($scope.data[i]['question']===question){
				$scope.data.splice(i, 1);
				/*
					updateNotifications($scope.data);
					setData();	
				*/
			}
		}
	}
})

.controller('FriendListCtrl',function($scope, quizitService){
		$scope.selectFriend = function (friend) {
			quizitService.selectFriend(friend);
		};
		$scope.isClickable = true;

		if(!navigator.onLine){
			$scope.isClickable = false;
			if($scope.friends.length <= 0){
				var friendsDataStore = window.localStorage['friends'];
				if(friendsDataStore){
					var friendsData = JSON.parse(friendsDataStore);
					for(var i=0; i<friendsData.length; i++){
						$scope.friends.push(friendsData[i]);
					}
					quizitService.friends(friendsData);
				}
			}
		}
})

.controller('HistoryCtrl', function ($scope, $http, quizitService) {
	$scope.historyData = [{
			name : "Wang Kunzhen",
			profile_image : "img/glasses-outline.png",
			score : 65
		},{
			name : "Wang Yichao",
			profile_image : "img/lightbulb-outline.png",
			score : 80
		},{
			name : "Xia Yiping",
			profile_image : "img/contact-outline.png",
			score : 70
		}, {
			name : "Viet Trung Truong",
			profile_image : "img/chatbubble-outline.png",
			score : 65
		}
	];

	var serverURL = quizitService.serverURL();
	// $http.get("http://"+serverURL+"/challenge?userId="+window.localStorage['user_id'])
	// $http.get("http://"+serverURL+"/challenges?userID=541b0188227d77f51afed102")
	// 	.success(function(response){
	// 		// console.log("History Log: "+JSON.stringify(response));
	// 		$scope.initHistoryData(response, new Array());
	// });

	$scope.initHistoryData = function(response, result){
		if(response.length <= 0){
			// do something
		}else{
			// var item = response.pop();
			// $http.get("http://"+serverURL+"/users?userID="+item.id)
			// .successs(function(response){
			// })
		}
	};

})

.controller('LeaderboardCtrl', function ($scope) {
	// $scope.leaderboardData = [{
	// 		name : "Wang Kunzhen",
	// 		profile_image : "img/glasses-outline.png",
	// 		score : 1001
	// 	}, {
	// 		name : "Wang Yichao",
	// 		profile_image : "img/lightbulb-outline.png",
	// 		score : 800
	// 	}, {
	// 		name : "Xia Yiping",
	// 		profile_image : "img/contact-outline.png",
	// 		score : 799
	// 	}, {
	// 		name : "Viet Trung Truong",
	// 		profile_image : "img/chatbubble-outline.png",
	// 		score : 653
	// 	}
	// ];

	if(!navigator.onLine){
		if($scope.leaderboardData.length <= 0){
			var leaderboardDataStore = window.localStorage['leaderboard'];
			if(leaderboardDataStore){
				var leaderboard = JSON.parse(leaderboardDataStore);
				for(var i=0; i<leaderboard.length; i++){
					$scope.leaderboardData.push(leaderboard[i]);
				}
			}
		}
	}
})

.controller('ChatCtrl', function ($scope, $http, $ionicPopup, $timeout, $ionicScrollDelegate, $location, quizitService, $ionicSideMenuDelegate) {
	$ionicSideMenuDelegate.canDragContent(false);
	var serverURL = 'http://ec2-54-169-65-45.ap-southeast-1.compute.amazonaws.com:3000';
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
	$scope.total = 0;
	var question = {};
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
			question = {
				index : $scope.QAindex,
				type : 'question',
				content : $scope.data[$scope.QAindex]['question'],
				answer : $scope.data[$scope.QAindex]['answer']
			};
			$scope.texts.push(question);
			//$scope.imgSrc = 'img/loading.gif' + '?v=' + Date.now();
			$scope.showLoadingBar = true;
			$scope.timestamp = Date.now();
		}, readyTime);
	};
	$scope.getData = function () {
		console.log('1');
		console.log(quizitService.friend());
		$scope.friend = quizitService.friend();
		console.log($scope.friend);
		$http.get(serverURL + '/quiz?fb_account=' + $scope.friend.id).
		success(function (data, status, headers, config) {
			$scope.data = data;
			$http.get(serverURL + '/quiz/bonus').
			success(function (data, status, headers, config) {
				$scope.bonus = data;
				$scope.showReady();
			}).
			error(function (data, status, headers, config) {
				//log error
			});
		}).
		error(function (data, status, headers, config) {
			//log error
		});
	}
	$scope.getData();
	$scope.showPopup = function () {
		$scope.data = {}
		var report;
		if ($scope.deduct / $scope.total >= 0.75) {
			report = 'Are you really my friend?';
		} else if ($scope.deduct / $scope.total >= 0.50) {
			report = 'We should see each other more often';
		} else if ($scope.deduct / $scope.total >= 0.25) {
			report = 'You seem to know a number of things about me';
		} else if ($scope.deduct / $scope.total >= 0.10) {
			report = 'You know a lot about me!';
		} else {
			report = 'I think we are good friends :)';
		}
		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
				template : '',
				title : '<div class="popup-title">' + report + '</div>',
				subTitle : '<div class="highlight popup-subtitle">You got ' + (100 - Math.floor(($scope.deduct / $scope.total) * 100)) + '% correct</div>',
				scope : $scope,
				buttons : [{
						text : '<b>Ask Bonus Question</b>',
						type : 'button-energized',
						onTap : function (e1) {
							var titl = '<div class="popup-title">Hi, ' + $scope.friend.name + ' . I want to Quiz!t you. </div>';
							var templ = '<div class="popup-subtitle">' + $scope.bonus + '</div>';
							var myPopup = $ionicPopup.show({
									template : templ,
									title : titl,
									scope : $scope,
									buttons : [{
											text : '<b>Send with Quiz!t!</b>',
											type : 'button-balanced',
											onTap : function (e) {
												var sendData = {
													player_id : window.localStorage['user_id'],
													target_id : $scope.friend.id,
													bonus : [{question: $scope.bonus}]
												}												
												$http.post(serverURL + '/bonus/', sendData)
												.success(function (res) {
													console.log(res);
												})
												.error(function (res) {
													// log error
												});
												$ionicSideMenuDelegate.canDragContent(true);
												$location.path('/app/friends');
											}
										},
									]
								});
						}
					}, {
						text : '<b>Back to Quiz!t</b>',
						type : 'button-positive',
						onTap : function (e2) {
							$ionicSideMenuDelegate.canDragContent(true);
							$location.path('/app/friends');
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
				content : (userAns == 'Y') ? 'Yes' : 'No',
				correct : (userAns === question.answer)
			};
			$scope.texts.push(answer);
			if (!answer.correct) {
				newDeduct = 10;
			}
			$scope.deduct += newDeduct;
			$scope.total += 10;
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
					nextQnsContent = nextQnsContent + $scope.data[$scope.QAindex]['question'];
					question = {
						index : $scope.QAindex,
						type : 'question',
						content : nextQnsContent,
						answer : $scope.data[$scope.QAindex]['answer']
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
					var sendData = {
						player_id : window.localStorage['user_id'],
						target_id : $scope.friend.id,
						score : (100 - Math.floor(($scope.deduct / $scope.total) * 100))
					}
					$http.post(serverURL + '/challenges', sendData)
					.success(function (res) {
						console.log(res);
					})
					.error(function (res) {
						// log error
					});
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
