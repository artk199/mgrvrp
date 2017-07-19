const logPanelDirective = require('./logPanel.directive.js');
const LogPanelCtrl = require('./logPanel.ctrl.js');

const logPanelModule = angular.module('pl.artk.vrp.util.panels',[
  'ngStomp'
]);

logPanelModule.directive('logPanel',logPanelDirective);
logPanelModule.controller('LogPanelCtrl',LogPanelCtrl);
