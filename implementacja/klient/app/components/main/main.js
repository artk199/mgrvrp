const DirectiveController = require('./controllers/main.controller.js');
const mainDirective = require("./directives/main.directive.js");
const depotPicker = require('./directives/depotPicker.js');
const customersPicker = require('./directives/customersPicker.js');
const propertiesPanel = require('./directives/propertiesPanel.js');

var mainModule =  angular.module("pl.artk.vrp.main", [
    'common.fabric',
    'common.fabric.utilities',
    'common.fabric.constants',
    'common.vrp'
]);

mainModule.directive("main", mainDirective);
mainModule.directive("propertiesPanel", propertiesPanel);
mainModule.directive("depotPicker", depotPicker);
mainModule.directive("customersPicker",customersPicker);
mainModule.controller("DirectiveController",DirectiveController);
