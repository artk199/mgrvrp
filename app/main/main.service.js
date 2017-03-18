(function () {
    angular.module("mgrApp")
        .service("serwis", Service);

    Service.$inject = ['$scope'];
    function Service($scope){
        var service = this;
        service.addDepot = addDepot;
        service.depots = [];

        service.cordx = null;
        service.cordy = null;


    }
}());