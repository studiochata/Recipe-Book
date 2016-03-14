angular.module('plant.guide', [])

    .factory("DBService", function ($q, $ionicPopup, $state) {
        var db = null;

        function createDB() {   
            var deferred = $q.defer();
            var version = 1;
            var request = window.indexedDB.open("plantDB", version);

            request.onupgradeneeded = function(e) {
                db = e.target.result;
                e.target.transaction.onerror = indexedDB.onerror;

                if(db.objectStoreNames.contains("plantData")) {
                    db.deleteObjectStore("plantData");
                }

                var store = db.createObjectStore("plantData", { keyPath: "id", autoIncrement:true });
            };

            request.onsuccess = function(e) {
                db = e.target.result;
                deferred.resolve();
            };

            request.onerror = function(e){
                deferred.reject("Error creating database.");
                console.dir(e);
            };

            return deferred.promise;
        }

        function getplant(){
            var deferred = $q.defer();

            if(db === null){
                deferred.reject("IndexDB is not opened yet!");
            }
            else{
                var trans = db.transaction(["plantData"], "readwrite");
                var store = trans.objectStore("plantData");
                var plants = [];

                // Get everything in the store;
                var keyRange = IDBKeyRange.lowerBound(0);
                var cursorRequest = store.openCursor(keyRange);

                cursorRequest.onsuccess = function(e) {
                    var result = e.target.result;
                    if(result === null || result === undefined){
                        deferred.resolve(plants);
                    }else{
                        plants.push(result.value);
                        result.continue();
                    }
                };

                cursorRequest.onerror = function(e){
                    deferred.reject("Error retrieving records " + e.value);
                };
            }
            return deferred.promise;
        }

        function getplantById(plantId){
            var deferred = $q.defer();

            if(db === null){
                deferred.reject("IndexDB is not opened yet!");
            }
            else{
                var transaction = db.transaction(["plantData"], "readwrite");
                var objectStore = transaction.objectStore("plantData");
                var request = objectStore.get(Number(plantId));

                var plants = [];

                request.onsuccess = function(event) {
                    var plant = request.result;
                    plants.push(plant);
                    deferred.resolve(plants);
                };

                request.onerror = function(e){
                    deferred.reject("Error retrieving records " + e.value);
                };
            }
            return deferred.promise;
        }

        function savePlant(Plant){
            var Plant_name = Plant.name;
            var plant_category = plant.category;
            var plant_instructions = plant.instructions;

            var deferred = $q.defer();

            if(db === null){
                deferred.reject("IndexDB is not opened yet!");
            }
            else{
                var trans = db.transaction(["plantData"], "readwrite");
                var store = trans.objectStore("plantData");

                var request = store.add({
                    "plant_name": plant_name,
                    "plant_category": plant_category,
                    "plant_instructions": plant_instructions
                });

                request.onsuccess = function(e) {
                    deferred.resolve();
                    $ionicPopup.alert({
                        title: 'Success',
                        template: 'plant added successfully.'
                    });
                };

                request.onerror = function(e) {
                    console.log(e.value);
                    deferred.reject("Error saving plant.");
                };
            }
            return deferred.promise;
        }

        function delplant(plantId){
            var deferred = $q.defer();

            if(db === null){
                deferred.reject("IndexDB is not opened yet!");
            }
            else{
                var trans = db.transaction(["plantData"], "readwrite");
                var store = trans.objectStore("plantData");

                var request = store.delete(plantId);

                request.onsuccess = function(e) {
                    deferred.resolve();
                };

                request.onerror = function(e) {
                    console.log(e.value);
                    deferred.reject("Error deleting plant.");
                };
            }
            return deferred.promise;
        }

        function updateplant(plant, plantId){
            var plant_name = plant.name;
            var plant_category = plant.category;
            var plant_instructions = plant.instructions;

            var deferred = $q.defer();

            if(db === null){
                deferred.reject("IndexDB is not opened yet!");
            }
            else{
                var trans = db.transaction(["plantData"], "readwrite");
                var store = trans.objectStore("plantData");

                var request = store.put({
                    "plant_name": plant_name,
                    "plant_category": plant_category,
                    "plant_instructions": plant_instructions,
                    "id":Number(plantId)
                });

                request.onsuccess = function(e) {
                    deferred.resolve();
                    $ionicPopup.alert({
                        title: 'Success',
                        template: 'plant updated successfully.'
                    }).then(function(res) {
                        $state.go('plantmenu.all-plant');
                    });
                };

                request.onerror = function(e) {
                    console.log(e.value);
                    deferred.reject("Error updated plant.");
                };
            }
            return deferred.promise;
        }

        return {
            setup: function() {
                return createDB();
            },
            getplant: function(){
                return getplant();
            },
            getplantById: function(plantId){
                return getplantById(plantId);
            },
            saveplant: function(plant){
                return saveplant(plant);
            },
            delplant: function(plantId){
                return delplant(plantId);
            },
            updateplant: function(plant, plantId){
                return updateplant(plant, plantId);
            }
        }

    });

                