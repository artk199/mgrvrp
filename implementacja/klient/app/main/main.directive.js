(function () {
    angular.module("mgrApp")
        .directive("main", Directive);

    function Directive(){
        return {
            restrict: 'E',
            templateUrl: 'main/main.html',
            controller: DirectiveController,
            controllerAs: 'ctrl',
            bindToController: true,
            scope: {
            }
        };
    }

    DirectiveController.$inject = ['$scope','$http'];
    function DirectiveController($scope,$http){
        var ctrl = this;
        ctrl.addDepot = addDepot;
        ctrl.clickMap = clickMap;
        ctrl.clearMap = clearMap;
        ctrl.loadRoutes = loadRoutes;

        ctrl.depots = [];
        ctrl.departures = [];
        ctrl.cordx = null;
        ctrl.cordy = null;
        ctrl.route = [];
        ctrl.start = null;

        var canvas = document.getElementById('main-canvas');
        var ctx = canvas.getContext('2d');

        function loadRoutes(){
            var data = {
                start:ctrl.start,
                depots:ctrl.depots
            };
            $http({
                method: 'POST',
                data: data,
                url: 'http://localhost:8080/vrp'
            }).then(function successCallback(response) {
                console.log(response)
                response.data.forEach(function(route){
                    var lastItem = route.start;
                    route.route.forEach(function (item) {
                        drawPath(lastItem,item);
                        lastItem = item;
                    });
                    drawPath(lastItem,route.end);
                });
            }, function errorCallback(response) {
                console.error(response)
            });
        }

        function addDepot() {
            var depot = {x:ctrl.cordx,y:ctrl.cordy};
            ctrl.depots.push(depot);
            drawDepots();
        }

        function drawDepots(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctrl.depots.forEach(drawCircle);
            ctx.strokeStyle="#FF0000";
            ctrl.departures.forEach(drawCircle);
            ctx.strokeStyle="#000000";
            //ctrl.depots.forEach(drawAllPaths);
        }

        function drawCircle(it){
            ctx.beginPath();
            ctx.arc(it.x,it.y,5,0,2*Math.PI);
            ctx.stroke();
        }

        function drawAllPaths(depot) {
            ctrl.depots.forEach(function (item) {
                drawPath(item,depot);
            });
        }

        function drawPath(from,to){
            ctx.beginPath();
            ctx.moveTo(from.x,from.y);
            ctx.lineTo(to.x,to.y);
            ctx.stroke();
        }

        function clickMap(e){
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            console.log("x: " + x + " y: " + y);
            var point = {x:x,y:y};
            switch(e.which) {
                case 1:
                    ctrl.depots.push(point);
                    break;
                case 3:
                    ctrl.departures = [];
                    ctrl.departures.push(point);
                    ctrl.start = point;
                    break;
            }
            console.log(e.which);
            drawDepots();
        }

        function clearMap(){
            ctrl.depots = [];
            ctrl.departures = [];
            drawDepots();
        }
    }
}());