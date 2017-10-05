module.exports = function() {

  function MainController(VRPService) {

    let ctrl = this;

    ctrl.solve = function() {
      VRPService.solve();
    }

  }

  return {
    restrict: 'E',
    templateUrl: 'templates/main.html',
    controller: MainController,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {}
  };
}
