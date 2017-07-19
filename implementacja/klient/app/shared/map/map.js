const mapDirective = require('./map.directive.js');
const MapController = require('./map.controller.js');

var mapModule =  angular.module("pl.artk.map", [
])
  .directive("map", mapDirective)
  .controller("MapController",MapController);
