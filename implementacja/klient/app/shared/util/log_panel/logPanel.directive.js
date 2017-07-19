module.exports = function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/util/logPanel.html',
        controller: "LogPanelCtrl",
        controllerAs: 'ctrl',
        bindToController: true,
        scope: {
        }
    };
}
