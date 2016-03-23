angular.module('starter.plant-service', [])

.factory('Plant', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var plants = [{
    id: 0,
    name: 'Carrots',
    depth: '1/4 inch deep, 3-4 inches apart',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Kale',
    depth: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Tomato',
    depth: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Turnip',
    depth: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    depth: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return Plant;
    },
    remove: function(plant) {
      plant.splice(plant.indexOf(plant), 1);
    },
    get: function(plnId) {
      for (var i = 0; i < plants.length; i++) {
        if (plant[i].id === parseInt(plantId)) {
          return plant[i];
        }
      }
      return null;
    }
  };
});
