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
		getFriendID : function(){
			return friendID;
		},
		friend : function () {
			var friendr;
			friends.forEach(function(afriend){
				if (afriend.id === friendID){
					friendr = afriend;
				}
			});
			return friendr;
		}
	};
})

.controller('bodyCtrl', function ($scope) {
	$scope.bodyBackground = {
		background : 'url(img/bg2.jpg)'
	};

	$scope.friends = new Array();
	// $scope.serverURL = 'ec2-54-169-65-45.ap-southeast-1.compute.amazonaws.com:3000';
})

.controller('sidebarCtrl',function($scope, $ionicSideMenuDelegate){

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
		$scope.activeIndex = index;
		$ionicSideMenuDelegate.toggleLeft(false);
		if(index == 5){
			console.log("Trying to log out");
			FB.logout(function(response){
				console.log("User Logged Out");
			});
		}
	};

	$scope.activeIndex = undefined;
})

.controller('loadingCtrl',function($scope, $location ,$interval){
	$scope.feedback = "";
	$scope.loadHome = function(){
		FB.getLoginStatus(function(response){
			if(response.status === "connected"){
				console.log("User Logged in");
				$location.path('/app/friends');
			}else{
				console.log("User Logged Off");
				$location.path('/app/home');
			}
		});
	};

	$interval($scope.loadHome,2000, 1);
})

.controller('logoutCtrl',function($scope,$location,$interval){
	$scope.redirectToHome = function(){
		$location.path('/app/home');
	};

	$interval($scope.redirectToHome,2000,1);
})

.controller('homeCtrl',function($scope, $ionicSideMenuDelegate, $location, $interval, quizitService){
	$ionicSideMenuDelegate.canDragContent(false);

	$scope.redirectToFriends = function(){
		$ionicSideMenuDelegate.canDragContent(true);
		$location.path('/app/friends');
	}

	$scope.fb_login_callback = function(response){
		var userdata = $scope.generateUserData(response);
		// $http.post("http://"+$scope.serverURL+"/users/init",userdata);
		$interval($scope.redirectToFriends,1000,1);
	};

	$scope.generateUserData = function(token){
		var user = {};
		var access_token = token.authResponse.accessToken;
		var user_id = token.authResponse.userID;

		window.localStorage['access_token'] = access_token;
		window.localStorage['user_id'] = user_id;

		FB.api('/me', function(response) {
			user.birthday = response.birthday;
			user.name = response.name;
			window.localStorage['user_name'] = user.name;
		});

		if($scope.friends.length <= 0){
			FB.api('/me/friends', function(response) {
			user.friends = response.data;
			window.localStorage['friends'] = JSON.stringify(user.friends);

			$scope.initFriends(response.data, new Array());
			});
		}

		return user;
	}

	$scope.initFriends = function(friendlist, result){
		if(friendlist.length <= 0){
			console.log("Freinsadafsdddbbb: "+JSON.stringify(result));
			quizitService.friends(result);

			for(var i=0; i<result.length;i++){
				$scope.friends.push(result[i]);
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

	$scope.fblogin = function(){
		fb_login($scope.fb_login_callback);
	};
})

.controller('NotificationCtrl', function($scope){

})

.controller('FriendListCtrl',function($scope,quizitService){

// 	var friendList = [{
// 			name : "Wang Kunzhen",
// 			id : "theflyingwolves@gmail.com",
// 			image : "img/profile_images/user_0.jpeg"
// 		}, {
// 			name : "Viet Trung Truong",
// 			id : "viettrung9012@yahoo.com",
// 			image : "img/profile_images/user_2.jpeg"
// 		}, {
// 			name : "Xia Yiping",
// 			id : "xy@xy.com",
// 			image : "img/profile_images/user_2.jpeg"
// 		}, {
// 			name : "Wang Yichao",
// 			id : "wy@wy.com",
// 			image : "img/profile_images/user_3.jpeg"
// 		}
// 	];
// 	$scope.friends = quizitService.friends(friendList);
		$scope.selectFriend = function (friend) {
			quizitService.selectFriend(friend);
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

.controller('ChatCtrl', function ($scope, $http, $ionicPopup, $timeout, $ionicScrollDelegate, $location, quizitService) {
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
		var serverURL = 'ec2-54-169-65-45.ap-southeast-1.compute.amazonaws.com:3000';
		$http.get('http://' + serverURL + '/quiz?fb_account=' + $scope.friend.id).
		success(function (data, status, headers, config) {
			$scope.data = data;
			$scope.showReady();
		}).
		error(function (data, status, headers, config) {
			//log error
		});
	}
	$scope.getData();
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
				title : '<div class="popup-title">' + report + '</div>',
				subTitle : '<div class="highlight popup-subtitle">You got ' + (100 - $scope.deduct) + '/100</div>',
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
				content : (userAns == 'Y') ? 'Yes' : 'No',
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
