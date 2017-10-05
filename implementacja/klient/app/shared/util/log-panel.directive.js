module.exports = function() {
  function LogPanelCtrl(logger) {

    let ctrl = this;
    ctrl.logger = logger;

  }

  return {
    restrict: 'E',
    templateUrl: 'templates/util/logPanel.html',
    controller: LogPanelCtrl,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {}
  };
}
