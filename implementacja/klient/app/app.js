require("./components/main/main.js");
require("./components/map/map.js");
require("./shared/vrp/vrp.js");
require("./shared/util/log_panel/logPanel.js");


var app = angular.module('mgrApp', [
  'pl.artk.vrp.main',
  'pl.artk.vrp.util.panels',
  'pl.artk.map',
  'ui.bootstrap'
]);

app.run(function(){
  console.log("Starting mgr angular app.");
});

angular.element(document).ready(function() {
    angular.bootstrap(document, ['mgrApp']);
});
