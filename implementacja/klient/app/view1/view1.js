'use strict';

angular.module('myApp.view1', ['ngRoute'])
.controller('VrpMapCtrl', ['$scope', function($scope) {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  $scope.data = [

  ];

  $scope.addData = function() {
    var id = 0;
    if($scope.data.length > 0) {
      id = $scope.data[$scope.data.length-1].id + 1;
    }
    var p = {id: id, x: $scope.x, y: $scope.y, amount: 5};
    $scope.data.push(p);
    $scope.x = '';
    $scope.y = '';
    $scope.amount = '';
    draw($scope.data);
  };

  function draw(data) {
    for(var i=0; i<data.length; i++) {
      drawDot(data[i]);
    }
  }

  function drawDot(data) {
    context.beginPath();
    context.arc(data.x, data.y, data.amount, 0, 2*Math.PI, false);
    context.fillStyle = "#ccddff";
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "#666666";
    context.stroke();
  }

  // setup
  canvas.width = 600;
  canvas.height = 400;
  context.globalAlpha = 1.0;
  context.beginPath();
  draw($scope.data);
}]);