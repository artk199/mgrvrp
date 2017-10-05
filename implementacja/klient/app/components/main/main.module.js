const mainDirective = require("./directives/main.directive.js");
const depotPicker = require('./directives/depot-picker.directive.js');
const customersPicker = require('./directives/customers-picker.directive.js');
const propertiesPanel = require('./directives/properties-panel.directive.js');

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
