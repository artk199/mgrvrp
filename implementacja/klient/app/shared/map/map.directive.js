module.exports = function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/main/map.html',
            controller: "MapController",
            controllerAs: 'ctrl',
            bindToController: true,
            scope: {
            }
        };
    }
