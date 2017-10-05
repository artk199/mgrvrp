const logPanelDirective = require('./log-panel.directive.js');
const LogService = require('./log.service.js');

const logPanelModule = angular.module('pl.artk.vrp.util.panels',[
  'ngStomp',
  'luegg.directives'
]);

logPanelModule.directive('logPanel',logPanelDirective);
logPanelModule.service('logger',LogService);
