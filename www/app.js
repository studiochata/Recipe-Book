angular.module('PlantGuide', ['ionic', 'plant.guide'])

    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('plantmenu', {
                url: "/plantURL",
                abstract: true,
                templateUrl: "event-menu.html"
            })
            .state('plantmenu.home', {
                url: "/home",
                views: {
                    'menuContent' :{
                        templateUrl: "home.html"
                    }
                }
            })

            .state('plantmenu.home/:plantId', {
                url: "/plant-detail/:plantId",
                views: {
                    'menuContent' :{
                        templateUrl: "home.html",
                        controller: 'plantDetailCtrl'
                    }
                }
            })

            .state('plantmenu.all-plant', {
                url: "/all-plant",
                views: {
                    'menuContent' :{
                        templateUrl: "all-plant.html",
                    controller: "AllplantCtrl"
                }
             }
            })
            .state('plantmenu.add-plant', {
                url: "/add-plant",
                views: {
                    'menuContent' :{
                        templateUrl: "add-plant.html",
                        controller: "AddplantCtrl"
                    }
                }
            })
            .state('plantmenu.edit-plant/:plantId', {
                url: "/edit-plant/:plantId",
                views: {
                    'menuContent' :{
                        templateUrl: "add-plant.html",
                        controller: "AddplantCtrl"
                    }
                }
            })
            .state('plantmenu.about', {
                url: "/about",
                views: {
                    'menuContent' :{
                        templateUrl: "about.html"
                    }
                }
            })

        $urlRouterProvider.otherwise("/plantURL/home");
    })

    .controller('MainCtrl', function($scope, $state, $ionicPopup, $ionicSideMenuDelegate, DBService) {
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.headertxt = 'Random plant';

        $scope.getRandomplant = function() {
            DBService.getplant().then(function (results) {

                if(results.length === 0){
                    $ionicPopup.alert({
                        title: "Warning",
                        template: "No plant to display. Please add a plant."
                    }).then(function(res) {
                        $state.go('plantmenu.add-plant');
                    });
                }else{
                    var random_plant = [];
                    random_plant.push(results[Math.floor(Math.random()* results.length)]);
                    $scope.plant = random_plant;
                }
            });
        }

        DBService.setup().then(function(){
            $scope.getRandomplant();
        });

    })

    .controller('plantDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, DBService) {
        $scope.headertxt = 'plant Detail';

        $scope.init = function() {
            DBService.getplantById($stateParams.plantId).then(function (results) {
                $scope.plant = results;
            });
        }

        $scope.init();
    })

    .controller('AllplantCtrl', function($scope, $state, $ionicPopup, $ionicActionSheet, DBService) {
        $scope.loadplant = function() {
            DBService.getplant().then(function (results) {

                if(results.length === 0){
                    $ionicPopup.alert({
                        title: "Warning",
                        template: "No plant to display. Please add a plant."
                    }).then(function(res) {
                        $state.go('plantmenu.add-plant');
                    });
                }else{
                    $scope.plant = results;
                }
            });
        }

        $scope.loadplant();

        $scope.delplant = function(plantId){
            $ionicActionSheet.show({
                titleText: 'Confirm Delete',
                destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {
                    //console.log('CANCELLED');
                },
                destructiveButtonClicked: function() {
                    DBService.delplant(plantId).then(function () {
                        $ionicPopup.alert({
                            title: "Success",
                            template: "plant deleted."
                        }).then(function(res) {
                            $scope.loadplant();
                        });
                    });
                    return true;
                }
            });
        }

        $scope.editplant = function(plant_Id){
            $state.go('plantmenu.edit-plant/:plantId',{plantId:plant_Id});
        }
    })

    .controller('AddplantCtrl', function($scope, $ionicPopup, $stateParams, DBService) {

        $scope.plant = {};

        if($stateParams.plantId === undefined){
            $scope.action = 'Add';
            $scope.btnaction = 'Submit';
        }else{
            $scope.action = 'Edit';
            $scope.btnaction = 'Update';

            DBService.getplantById($stateParams.plantId).then(function (results) {
                $scope.plant.name = results[0].plant_name;
                $scope.plant.category = results[0].plant_category;
                $scope.plant.instructions = results[0].plant_instructions;
            });
        }

        $scope.saveplant = function(plant){
            if(plant === undefined || plant.name === null || plant.name === ""){
                $ionicPopup.alert({
                    title: 'Error - Input Required',
                    template: 'Please enter plant name.'
                });
            }else if (plant.category === undefined || plant.category === null || plant.category === ""){
                $ionicPopup.alert({
                    title: 'Error - Input Required',
                    template: 'Please select a category.'
                });
            }else if (plant.instructions === undefined || plant.instructions === null || plant.instructions === ""){
                $ionicPopup.alert({
                    title: 'Error - Input Required',
                    template: 'Please enter instructions.'
                });
            }else{
                if($stateParams.plantId === undefined) {
                    DBService.saveplant(plant);
                }else{
                    DBService.updateplant(plant, $stateParams.plantId);
                }

                $scope.plant.name = '';
                $scope.plant.category = '';
                $scope.plant.instructions = '';
            }
        }
    });


          