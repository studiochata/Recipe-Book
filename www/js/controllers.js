angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('PlantCtrl', function($scope, Plant) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.plant = Plant.all();
  $scope.remove = function(plant) {
    plant.remove(plant);
  };
})

.controller('PlantDetailCtrl', function($scope, $stateParams, Plant) {
  $scope.plants = Plant.get($stateParams.PlantId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enablePlant: true
  };
});
