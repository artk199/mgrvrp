module.exports = angular.module('common.vrp',[])
.service('VrpService', [
	function() {

      this.calculate = function(customers, depots, config){
        $http({
            method: 'POST',
            data: data,
            url: 'http://46.41.137.22:8080/vrp'
        }).then(function successCallback(response) {
            handleResponse(response);
        }, function errorCallback(response) {
            console.error(response);
            $scope.fabric.enableEditing();
        });
      }

      function handleResponse(response){
        $scope.fabric.enableEditing();
        clearPahts();
        console.log(response)
        addRoutes(response.data);
      }

      function clearPahts(){
        angular.forEach(ctrl.paths, function(value, key) {
            $scope.cnv.remove(value);
        });
        ctrl.paths = [];
      }

      function addRoutes(routes){
        routes.forEach(addRoute(route));
      }

      function addRoute(route){
        var lastItem = route.start;
        route.route.forEach(function (item) {
            addPath(lastItem,item);
            lastItem = item;
        });
        addPath(lastItem,route.end);
      }

  }]);
