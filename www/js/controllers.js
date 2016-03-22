angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('PlantsCtrl', function($scope, Plants) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.plants = Plants.all();
  $scope.remove = function(plants) {
    Chats.remove(plants);
  };
})

.controller('PlantDetailCtrl', function($scope, $stateParams, Plants) {
  $scope.plants = Plants.get($stateParams.PlantId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enablePlant: true
  };
});
