module.exports = function(VRPService, $window, MapLeafletService, MapMarkerService, logger) {

  let ctrl = this;
  ctrl.map;

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
    VRPService.solve().then(
      function success(response) {
        console.log(response.data.routes);
        angular.forEach(response.data.routes, function(route, key) {
          logger.info("Route #" + key + " starts at: " + route.start);
          let lastItem = route.start;
          angular.forEach(route.route, function(value, key) {
            MapMarkerService.drawPath(
              lastItem.coordinates.x,
              lastItem.coordinates.y,
              value.coordinates.x,
              value.coordinates.y,
              ctrl.map
            );
            lastItem = value;
          });
          MapMarkerService.drawPath(
            lastItem.coordinates.x,
            lastItem.coordinates.y,
            route.end.coordinates.x,
            route.end.coordinates.y,
            ctrl.map
          );
          logger.info("Route #" + key + " ends at: " + route.end);
        });
      },
      function error(error) {
        logger.info("Error.");
      },
      function notify(data) {
        logger.info("Notify.");
      }
    );
  }

  setUp();

}
