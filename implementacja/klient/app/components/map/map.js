const mapDirective = require('./map.directive.js');
const MapController = require('./map.controller.js');
const ContextMenu = require('./directives/contextMenu.js');
const MapLeafletService = require('./services/MapLeafletService.js');
const MapMarkerService = require('./services/MapMarkerService.js');

var mapModule =  angular.module("pl.artk.map", [
])
  .service("MapMarkerService", MapMarkerService)
  .service("MapLeafletService", MapLeafletService)
  .directive("mapContextMenu", ContextMenu)
  .directive("map", mapDirective)
  .controller("MapController",MapController);
