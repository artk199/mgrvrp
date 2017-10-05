module.exports = function() {
  function LogPanelCtrl(logger) {

    let ctrl = this;
    ctrl.logger = logger;

  }

  return {
    restrict: 'E',
    templateUrl: 'templates/util/logPanel.html',
    controller: "",
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {}
  };
}
