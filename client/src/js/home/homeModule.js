MeanBpApp.Home = (function() {
  var homeModule = angular.module('meanbpapp.home', ['ngRoute', 'ngResource']);

  homeModule.config(function ($routeProvider) {
    $routeProvider
      .when('/', { controller: 'HomeController', templateUrl: '/assets/src/templates/home/home.html' })
      ;
  });

  return homeModule;
}());
