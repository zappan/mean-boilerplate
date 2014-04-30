MeanBpApp.Home = (function() {
  var homeModule = angular.module('meanbpapp.home');

  homeModule.controller('HomeController', function ($scope, HomeRepository) {

    HomeRepository.findAll()
      .success(function (homeData) {
        $scope.homeData = homeData;
      });
  });

  return homeModule;
}());
