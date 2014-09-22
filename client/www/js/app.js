// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
angular.module('quizit', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/app/home')

  $stateProvider.state('app',{
      url: "/app",
      abstract: true,
      templateUrl: "menu.html",
      controller: 'sidebarCtrl'
  })

  .state('app.home',{
    url: '/home',
    views:{
      home:{
        templateUrl:'home.html'
      }
    }
  })

  .state('app.questions',{
    url: '/questions',
    views:{
      questions:{
        templateUrl:"questions.html"
      }
    }
  })

  // $stateProvider.state('home', {
  //   url: '/home',
  //   views:{
  //     home:{
  //       templateUrl:'home.html',
  //       controller:'sidebarCtrl'
  //     }
  //   }
  // })

  // $stateProvider.state('questions',{
  //   url: '/questions',
  //   views:{
  //     questions:{
  //       templateUrl:"questions.html",
  //       controller:'sidebarCtrl'
  //     }
  //   }
  // })
})

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
    linkAddress:"#/app/home"
  },
  {
    linkId:"menu-item-2",
    imgSrc:"img/star-outline.png",
    title:"Leadership Board",
    linkAddress:"#/app/home"
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