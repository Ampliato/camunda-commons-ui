define([
  'angular',
  './inline-field/cam-widget-inline-field',
  './search-pill/cam-widget-search-pill',
  './search-pill/cam-query-component',
  './header/cam-widget-header',
  './footer/cam-widget-footer',
  './loader/cam-widget-loader',
  './debug/cam-widget-debug',
  './variable/cam-widget-variable',
  './search/cam-widget-search',
  './bpmn-viewer/cam-widget-bpmn-viewer',
  '../filter/date/index',
  '../directives/index',
  '../search/index',

  './variable/cam-variable-validator',

  'angular-bootstrap'
], function(
  angular,
  inlineField,
  searchPill,
  camQueryComponent,
  header,
  footer,
  loader,
  debug,
  variable,
  search,
  bpmnViewer,
  filtersModule,
  directivesModule,
  searchModule,

  variableValidator
  ) {
  'use strict';

  var widgetModule = angular.module('camunda.common.widgets', [filtersModule.name, directivesModule.name, searchModule.name, 'ui.bootstrap']);

  widgetModule.directive('camWidgetInlineField', inlineField);
  widgetModule.directive('camWidgetSearchPill', searchPill);
  widgetModule.directive('camWidgetHeader', header);
  widgetModule.directive('camWidgetFooter', footer);
  widgetModule.directive('camWidgetLoader', loader);
  widgetModule.directive('camWidgetDebug', debug);
  widgetModule.directive('camWidgetVariable', variable);
  widgetModule.directive('camWidgetSearch', search);
  widgetModule.directive('camWidgetBpmnViewer', bpmnViewer);

  widgetModule.directive('camVariableValidator', variableValidator);

  widgetModule.filter('camQueryComponent', camQueryComponent);

  return widgetModule;
});
