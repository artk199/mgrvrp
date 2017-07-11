require("./components/main/main.js");
require("./shared/vrp/vrp.js");

var app = angular.module('mgrApp', [
  'pl.artk.vrp.main'
]);

app.run(function(){
  console.log("Starting mgr angular app.");
});

angular.element(document).ready(function() {
    angular.bootstrap(document, ['mgrApp']);
});
