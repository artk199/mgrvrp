module.exports = function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/main.html',
            controller: "DirectiveController",
            controllerAs: 'ctrl',
            bindToController: true,
            scope: {
            }
        };
    }
