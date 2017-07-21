module.exports = function($http,$scope, Fabric, FabricCanvas, FabricConstants, Keypress, VRPService){

      var ctrl = this;
      ctrl.addCustomer = addCustomer;
      ctrl.customers = [];
      ctrl.depot = {};
      ctrl.paths = [];
      ctrl.loadRoutes = loadRoutes;
      ctrl.removeObject = removeObject;

      $scope.fabric = {};
      $scope.cnv = {};
      $scope.FabricConstants = FabricConstants;

      $scope.updateCanvas = function() {
          console.log("Hello");
      };

      function loadRoutes(){
          var translatedCustomers = [];
          angular.forEach(ctrl.customers, function(value, key) {
              translatedCustomers.push({x:value.left,y:value.top});
          });
          var data = {
              start:{ x:ctrl.depot.left, y:ctrl.depot.top },
              depots: translatedCustomers
          };
          $scope.fabric.disableEditing();
          $http({
              method: 'POST',
              data: data,
              url: 'http://46.41.137.22:8080/vrp'
          }).then(function successCallback(response) {
              $scope.fabric.enableEditing();
              angular.forEach(ctrl.paths, function (value, key) {
                  $scope.cnv.remove(value);
              });
              ctrl.paths = [];
              console.log(response)
              response.data.forEach(function(route){
                  var lastItem = route.start;
                  route.route.forEach(function (item) {
                      addPath(lastItem,item);
                      lastItem = item;
                  });
                  addPath(lastItem,route.end);
              });
          }, function errorCallback(response) {
              console.error(response);
              $scope.fabric.enableEditing();
          });
      }

      function addPath(item1,item2){
          var line = new fabric.Line([item1.x+5, item1.y+5, item2.x+5, item2.y+5], {
              fill: 'red',
              stroke: 'red',
              strokeWidth: 1,
              hasControls: false,
              selectable: false
          });
          $scope.fabric.addObjectToCanvas(line);
          ctrl.paths.push(line);

      }

      function addDepot() {
          //TODO: przeniesc kolor, pozycje, radius do obiektu
          var depot = new fabric.Depot({
              radius: 5, fill: 'red', left: 5, top: 5
          });
          depot.hasControls = false;
          ctrl.depot = depot;
          $scope.fabric.addObjectToCanvas(depot);
      }

      function addCustomer() {
          VrpService.calculate({},{},{});
          //TODO: przeniesc kolor, pozycje, radius do obiektu
          var customer = new fabric.Customer({
              radius: 5, fill: 'blue', left: 0, top: 0
          });
          customer.hasControls = false;
          ctrl.customers.push(customer);
          $scope.fabric.addObjectToCanvas(customer);
          console.log(customer);
      }

      function removeObject(){
          //TODO: Usunac jeszcze z listy ktora sie pojawia wyzej
          $scope.fabric.deleteActiveObject();
      }

      $scope.init = function() {
          $scope.fabric = new Fabric({
              canvas: $scope.cnv,
              canvasWidth: 500,
              canvasHeight: 500,
              canvasOriginalWidth:500,
              canvasOriginalHeight:500,
              JSONExportProperties: FabricConstants.JSONExportProperties,
              textDefaults: FabricConstants.textDefaults,
              json: {}
          });
          $scope.fabric.setCanvasSize(500,500);
          $scope.cnv = FabricCanvas.getCanvas();
          $scope.fabric.setCanvas($scope.cnv);
          addDepot();
      };

      $scope.$on('canvas:created', $scope.init);

      Keypress.onSave(function() {
          $scope.updatePage();
      });

      //Klasy reprezentujace elementy na mapie
      fabric.Depot = fabric.util.createClass(fabric.Circle, {
          type: 'depot',
          name: 123,
      });

      fabric.Customer = fabric.util.createClass(fabric.Circle, {
          type: 'customer',
          name: 123,
          demand: 10
      });
  }
