module.exports = function(VRPService, $window,MapLeafletService,MapMarkerService) {

  let ctrl = this;
  ctrl.map;

  function setUp() {
    ctrl.map = MapLeafletService.setUpMap();

    $window.addDepot = function(lat,lng) {
      let depot = VRPService.addDepot(lat,lng);
      MapMarkerService.addMarker(lat,lng,ctrl.map);
      ctrl.map.closePopup();
    }

    $window.addCustomer = function(lat,lng) {
      let customer = VRPService.addCustomer(lat,lng);
      ctrl.map.closePopup();
    }

  }

  setUp();

}
