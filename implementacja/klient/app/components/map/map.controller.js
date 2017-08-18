module.exports = function(VRPService, $window, MapLeafletService, MapMarkerService, logger, $scope) {

  let ctrl = this;
  ctrl.map;
  ctrl.loading = false;

  ctrl.settings = {
    algorithm: "jsprit",
    geo_distance: "spherical"
  }

  ctrl.selectedObject = {
    object: {}
  };
  ctrl.depot = {
    point: {},
    marker: {},
    type: "depot"
  }

  function setUp() {
    ctrl.map = MapLeafletService.setUpMap();

    $window.addDepot = function(lat, lng) {
      ctrl.map.removeLayer(ctrl.depot.marker);
      ctrl.depot.point = VRPService.addDepot(lat, lng);
      ctrl.depot.marker = MapMarkerService.addMarker(ctrl.depot.point, ctrl.map, "Depot");
      ctrl.depot.marker.on('click', function() {
        ctrl.selectedObject.object = ctrl.depot;
        $scope.$apply();
      });
      ctrl.map.closePopup();
      $scope.$apply();
    }

    $window.addCustomer = function(lat, lng) {
      let customer = VRPService.addCustomer(lat, lng);
      MapMarkerService.addMarker(customer, ctrl.map, "Customer");
      ctrl.map.closePopup();
      $scope.$apply();
    }
  }

  ctrl.solve = function() {
    ctrl.loading = true;
    VRPService.solve(ctrl.settings).then(
      function(response) {
        handleSolution(response);
        ctrl.loading = false;
      },
      function error(error) {
        logger.error(error);
        ctrl.loading = false;
      },
      handleSolution
    );
  }

  function handleSolution(response) {
    MapMarkerService.clearPaths();
    console.log(response);
    angular.forEach(response.routes, function(route, idx) {
      let from = route.start;
      drawDriveRoute(route.driveRoute,idx);
    });
  }

  function drawDriveRoute(driveRoute,idx){
    let colors = ['black', 'blue', 'brown', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'];
    let from = driveRoute[0];
    angular.forEach(driveRoute, function(to, key) {
      MapMarkerService.drawPath(
        from.coordinates.x,
        from.coordinates.y,
        to.coordinates.x,
        to.coordinates.y,
        ctrl.map,
        colors[idx % colors.length]
      );
      from = to;
    });

  }

  setUp();

}
