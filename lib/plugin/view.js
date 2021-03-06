/* global define: false */
define(['angular'],
function(angular) {
  'use strict';
  // module is passed by the "loader" (main.js)
  return function(module) {
    module.directive('view',[
            '$q', '$http', '$templateCache', '$anchorScroll', '$compile', '$controller',
    function($q,   $http,   $templateCache,   $anchorScroll,   $compile,   $controller) {
      return {
        restrict: 'ECA',
        terminal: true,
        link: function(scope, element, attrs) {
          var lastScope;

          scope.$watch(attrs.provider, update);

          function destroyLastScope() {
            if (lastScope) {
              lastScope.$destroy();
              lastScope = null;
            }
          }

          function clearContent() {
            element.html('');
            destroyLastScope();
          }

          function getTemplate(viewProvider) {
            var template = viewProvider.template;
            if (template) {
              return template;
            }
            
            var url = viewProvider.url;
            return $http.get(url, { cache: $templateCache }).then(function(response) { return response.data; });
          }

          function update() {
            var viewProvider = scope.$eval(attrs.provider);
            var viewVars = scope.$eval(attrs.vars) || {};

            if (!viewProvider) {
              clearContent();
              return;
            }

            $q.when(getTemplate(viewProvider)).then(function(template) {
              element.html(template);
              destroyLastScope();

              var link = $compile(element.contents()),
                  locals = {},
                  controller;

              lastScope = scope.$new(true);

              if (viewVars) {
                if (viewVars.read) {
                  angular.forEach(viewVars.read, function(e) {
                    // fill read vars initially
                    lastScope[e] = scope[e];

                    scope.$watch(e, function(newValue) {
                      lastScope[e] = newValue;
                    });
                  });
                }

                if (viewVars.write) {
                  angular.forEach(viewVars.write, function(e) {
                    lastScope.$watch(e, function(newValue) {
                      scope[e] = newValue;
                    });
                  });
                }
              }

              if (viewProvider.controller) {
                locals.$scope = lastScope;
                controller = $controller(viewProvider.controller, locals);
                element.children().data('$ngControllerController', controller);
              }

              link(lastScope);
              lastScope.$emit('$pluginContentLoaded');

              // $anchorScroll might listen on event...
              $anchorScroll();
            }, function(error) {
              clearContent();

              throw error;
            });
          }
        }
      };
    }]);
  };
});
