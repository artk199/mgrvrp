import "angular";
import "angularjs-scroll-glue";
import "angular-route";
//import "fabric-angular";
import "ng-stomp";
import "angular-ui-bootstrap";

require("./components/main/main.module.js");
require("./components/map/map.module.js");
require("./shared/vrp/vrp.module.js");
require("./shared/util/log-panel.module.js");

var app = angular.module('mgrApp', [
    'pl.artk.vrp.main',
    'pl.artk.vrp.util.panels',
    'pl.artk.map',
    'ui.bootstrap'
]);

app.run(function () {
    console.log("Starting mgr angular app.");
});

angular.element(document).ready(function () {
    angular.bootstrap(document, ['mgrApp']);
});
