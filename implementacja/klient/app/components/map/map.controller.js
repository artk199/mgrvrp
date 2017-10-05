module.exports = function(VRPService, $window, MapLeafletService, MapMarkerService, logger, $scope) {

  let ctrl = this;
  ctrl.map;
  ctrl.loading = false;

  ctrl.settings = VRPService.getSettings();

  ctrl.selectedObject = {};
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
        ctrl.selectedObject = ctrl.depot;
        $scope.$apply();
      });
      ctrl.selectedObject = ctrl.depot;
      ctrl.map.closePopup();
      $scope.$apply();
    }

    $window.addCustomer = function(lat, lng) {
      let customer = {
        point: {},
        marker: {},
        type: "customer"
      }
      customer.point = VRPService.addCustomer(lat, lng);
      customer.marker = MapMarkerService.addMarker(customer.point, ctrl.map, "Customer");
      customer.marker.on('click', function() {
        ctrl.selectedObject = customer;
        $scope.$apply();
      });
      ctrl.selectedObject = customer;
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
      drawDriveRoute(route,idx);
    });
  }

  function drawDriveRoute(route,idx){
    let colors = ['black', 'blue', 'brown', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'];
    let from = route.driveRoute[0];
    angular.forEach(route.driveRoute, function(to, key) {
      let path = MapMarkerService.drawPath(
        from.coordinates.x,
        from.coordinates.y,
        to.coordinates.x,
        to.coordinates.y,
        ctrl.map,
        colors[idx % colors.length]
      );
      path.on('click', function() {
        ctrl.selectedObject = {
          path: route,
          type: 'path'
        };
        $scope.$apply();
      });
      from = to;
    });

  }

  setUp();

}
