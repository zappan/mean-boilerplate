MeanBpApp.Layout = (function() {
  var layout = angular.module('meanbpapp.layout', []);

  layout.directive('content', [function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: function(el, attrs) {
        return attrs.templateUrl || '/assets/src/templates/common/layout.html';
      }
    };
  }]);

  return layout;
}());
