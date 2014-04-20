// ========================================
// ##### APPLICATION BOOTSTRAP MODULE #####
// ========================================
// These are app-wide dependencies that are required to assemble your app.
// see https://github.com/ngbp/ng-boilerplate/tree/v0.3.1-release/src/app

// Declaring all modules here that will be used in the application
// so that plain concat can be done instead of dependency resolving Require.js.
// In case app.js is not the first file, move to _declarations.js or similar
// Origin: http://stackoverflow.com/questions/17082092/

// ##### Namespaces definitions
var MeanBpApp;
MeanBpApp = MeanBpApp || {};

// ##### Global app definition; handles all global behaviour
MeanBpApp.start = (function() {
  var start, init;

  // ### create common modules
  angular.module('meanbpapp.directives', []);
  angular.module('meanbpapp.templates', []);
  angular.module('meanbpapp.filters', []);

  start = function() {
    var app = init();

    // ### bootstraping global app ('ca') and submodules :: http://stackoverflow.com/questions/15294321
    angular.element(document).ready(function() {
      angular.bootstrap(document, [
          'meanbpapp.app'
        , 'meanbpapp.templates'
        , 'meanbpapp.filters'
        , 'meanbpapp.directives'
        , 'meanbpapp.layout'
        , 'meanbpapp.home'
      ]);
    });

    return app;
  };

  init = function() {
    var app = angular.module('meanbpapp.app', ['ngRoute']);

    // global routing
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
      $routeProvider
         // @TODO app-wide undefined route fallback should redirect to 404 page
        .otherwise({ redirectTo: '/' });  // fallback route redirects home
    }]);

    return app;
  };

  return start;
}());
