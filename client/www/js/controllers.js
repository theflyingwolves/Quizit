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
});
