MeanBpApp.Location = (function() {
  var homeModule = angular.module('meanbpapp.home');

  homeModule.factory('HomeRepository', function ($http) {

    return {

      findAll: function() {
        return $http.get('/home');
      },

      find: function(id) {
        return $http.get(['/home', id].join('/'));
      },
    };
  });

  return homeModule;
}());
