const logPanelDirective = require('./logPanel.directive.js');
const LogPanelCtrl = require('./logPanel.ctrl.js');
const LogService = require('./log.service.js');
const logPanelModule = angular.module('pl.artk.vrp.util.panels',[
  'ngStomp'
]);

logPanelModule.directive('logPanel',logPanelDirective);
logPanelModule.service('logger',LogService);
logPanelModule.controller('LogPanelCtrl',LogPanelCtrl);
