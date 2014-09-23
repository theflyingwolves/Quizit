angular.module('quizit.controllers', [])

.controller('bodyCtrl',function($scope){
  $scope.bodyBackground = {
    background:'url(../img/bg2.jpg)'
  };
})

.controller('sidebarCtrl',function($scope, $ionicSideMenuDelegate){
  $scope.sidebarData = [{
    linkId:"menu-item-1",
    imgSrc:"img/lightbulb-outline.png",
    title:"Take a Challenge",
    linkAddress:"#/app/challenge"
  },
  {
    linkId:"menu-item-2",
    imgSrc:"img/star-outline.png",
    title:"Leadership Board",
    linkAddress:"#/app/friends"
  },
  {
    linkId:"menu-item-3",
    imgSrc:"img/glasses-outline.png",
    title:"History",
    linkAddress:"#/app/questions"
  },
  
  {
    linkId:"menu-item-5",
    imgSrc:"img/chatbubble-outline.png",
    title:"Notifice",
    linkAddress:"#/app/questions"
  },

  {
    linkId:"menu-item-4",
    imgSrc:"img/contact-outline.png",
    title:"My Profile",
    linkAddress:"#/app/questions"
  }];

  $scope.toggleSidebar = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.selectSideItem = function(item, index){
    $scope.activeItem = item;
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  $scope.activeItem = undefined;
})

.controller('FriendListCtrl',function($scope){
  $scope.friends = [{
    name:"Wang Kunzhen",
    image:"img/chatbubble-outline.png"
  },
  {
    name:"Viet Trung Truong",
    image:"img/contact-outline.png"
  },
  {
    name:"Xia Yiping",
    image:"img/glasses-outline.png"
  },
  {
    name:"Wang Yichao",
    image:"img/lightbulb-outline.png"
  }];

  $scope.selectFriend = function(friend){

  };
})

.controller('ChatCtrl', function ($scope, $ionicPopup, $timeout, $ionicScrollDelegate) {
	$scope.friend = {
		name : "Trung"
	};
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
	$scope.correct = 0;
	var question = {
		index : $scope.QAindex,
		type : 'question',
		content : $scope.data[$scope.QAindex]['qns'],
		answer : $scope.data[$scope.QAindex]['ans']
	};
	$scope.texts.push(question);
	$scope.showPopup = function () {
		$scope.data = {}
		var report;
		if ($scope.correct<=3){
			report = 'Are you really my friend?';
		} else if ($scope.correct<=6){
			report = 'We should see each other more often';
		} else if ($scope.correct<=9){
			report = 'You really know a lot about me';
		} else {
			report = 'Perfect!';
		}
		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
				template : '',
				title : report,
				subTitle : '<p class="highlight">You got ' + $scope.correct + '/10</p>',
				scope : $scope,
				buttons : [{
						text : '<b>Leaderboard</b>',
						type : 'button-positive',
						onTap : function (e) {
							alert('the top on leaderboard is me');
						}
					},
				]
			});
		myPopup.then(function (res) {
			console.log('Tapped!', res);
		});
	};

	$scope.isButtonDisabled = false;
	$scope.isIdleHidden = true;
	$scope.addAnswer = function (userAns) {
		$scope.isButtonDisabled = true;
		$scope.isIdleHidden = false;
		if ($scope.QAindex < $scope.data.length) {
			var answer = {
				index : $scope.QAindex,
				type : 'answer',
				content : userAns,
				correct : (userAns === question.answer)
			};
			$scope.texts.push(answer);
			if (answer.correct){
				$scope.correct++;
			}
			var delay = 1000;
			$timeout(function () {
				$scope.QAindex++;
				if ($scope.QAindex < $scope.data.length) {
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
				if ($scope.QAindex === $scope.data.length) {
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
		}, delay + 200);
	};
});
