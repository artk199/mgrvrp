module.exports = function(VRPService, $window, MapLeafletService, MapMarkerService, logger) {

  let ctrl = this;
  ctrl.map;
  ctrl.loading = false;

  function setUp() {
    ctrl.map = MapLeafletService.setUpMap();

    $window.addDepot = function(lat, lng) {
      let depot = VRPService.addDepot(lat, lng);
      MapMarkerService.addMarker(lat, lng, ctrl.map);
      ctrl.map.closePopup();
    }

    $window.addCustomer = function(lat, lng) {
      let customer = VRPService.addCustomer(lat, lng);
      MapMarkerService.addMarker(lat, lng, ctrl.map, "customer");
      ctrl.map.closePopup();
    }
  }

  ctrl.solve = function() {
    ctrl.loading = true;
    VRPService.solve().then(
      function(response){
        handleSolution(response);
        ctrl.loading = false;
      },
      function error(error) {
        logger.info("Error.");
      },
      handleSolution
    );
  }

  function handleSolution(response) {
    MapMarkerService.clearPaths();
    console.log(response.routes);
    let colors = ['black','blue','brown','gray','green','orange','pink','purple','red','white','yellow'];
    let i = 0;
    angular.forEach(response.routes, function(route, key) {
      logger.info("Route #" + key + " starts at: " + route.start);
      angular.forEach(route.route, function(value, key) {
        let lastItem = value.start;
        angular.forEach(value.route, function(singleRoute, key) {
          MapMarkerService.drawPath(
            lastItem.coordinates.x,
            lastItem.coordinates.y,
            singleRoute.coordinates.x,
            singleRoute.coordinates.y,
            ctrl.map,
            colors[i%colors.length]
          );
          lastItem = singleRoute;
        });
        MapMarkerService.drawPath(
          lastItem.coordinates.x,
          lastItem.coordinates.y,
          value.end.coordinates.x,
          value.end.coordinates.y,
          ctrl.map,
          colors[i%colors.length]
        );
      });
      logger.info("Route #" + key + " ends at: " + JSON.stringify(route.end));
      i++;
    });
  }

  setUp();

}
