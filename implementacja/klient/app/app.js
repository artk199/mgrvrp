require("./components/main/main.module.js");
require("./components/map/map.module.js");
require("./shared/vrp/vrp.module.js");
require("./shared/util/log_panel/log-panel.module.js");


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
