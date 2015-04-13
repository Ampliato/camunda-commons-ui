define([
  'angular',
  'text!./cam-widget-variable.html',
  'text!./cam-widget-variable-dialog.html',
  'camunda-bpm-sdk-js-type-utils'
], function(
  angular,
  template,
  templateDialog,
  typeUtils
) {
  'use strict';

  var variableTypes = [
    'Boolean',
    'Bytes',
    'Date',
    'Double',
    'Integer',
    'Long',
    'Null',
    'Object',
    'Short',
    'String'
  ];

  var modalCtrl = [
    '$scope',
    '$http',
    'variable',
  function (
    $dialogScope,
    $http,
    variable
  ) {
    // statuses:
    // - beforeChange
    // - confirmChange
    // - changeSuccess

    $dialogScope.status = 'beforeChange';
    $dialogScope.deserializationError = false;
    $dialogScope.variable = variable;

    // // load deserialized value:
    // if (variable.instanceId) {
    //   $http({
    //     method: 'GET',
    //     url: Uri.appUri('engine://engine/:engine/variable-instance/'+ variable.instanceId)
    //   }).success(function(data) {
    //     if(!data.errorMessage) {
    //       $dialogScope.initialValueDeserialized = JSON.stringify(data.value);
    //       $dialogScope.currentValueDeserialized = angular.copy($dialogScope.initialValueDeserialized);
    //     }
    //     else {
    //       $scope.deserializationError = data.errorMessage;
    //     }
    //   }).error(function(data) {
    //     $dialogScope.deserializedValue = data;
    //   });
    // }


    $dialogScope.typeIn = function(formScope, type) {
      if(type === 'serialized') {
        $dialogScope.currentValue = formScope.currentValue;
      }
      else {
        $dialogScope.currentValueDeserialized = formScope.currentValueDeserialized;
      }

      if ($dialogScope.hasChanged(type)) {
        $dialogScope.status = 'confirmChange';
      }
      else {
        $dialogScope.status = 'beforeChange';
      }
    };

    $dialogScope.hasChanged = function(type) {
      if(type === 'serialized') {
        return $dialogScope.initialValue != $dialogScope.currentValue;
      }
      else {
        return $dialogScope.initialValueDeserialized != $dialogScope.currentValueDeserialized;
      }
    };

    $dialogScope.ok = function () {

    };

    $dialogScope.cancel = function () {

    };
  }];

  return [
    '$modal',
  function(
    $modal
  ) {
    return {
      template: template,

      scope: {
        variable: '=camVariable',
        display:  '@?',
        shown:    '=?'
      },


      link: function ($scope, element) {
        $scope.variableTypes = angular.copy(variableTypes);

        $scope.isPrimitive = function () {
          if (!$scope.variable.type) { return true; }
          return [
            'Boolean',
            'Date',
            'Double',
            'Integer',
            'Long',
            'Null',
            'Short',
            'String'
          ].indexOf($scope.variable.type) >= 0;
        };
        var defaultValues = {
          'Boolean':    false,
          'Date':       new Date(),
          'Double':     0,
          'Integer':    0,
          'Long':       0,
          'Null':       '',
          'Short':      0,
          'String':     '',
          'Bytes':      '',
          'Object':     {}
        };

        $scope.useCheckbox = function () {
          return $scope.variable.type === 'Boolean';
        };



        $scope.isShown = function (what) {
          if (!Array.isArray($scope.shown) || !$scope.shown.length) { return true; }
          return $scope.shown.indexOf(what) > -1;
        };

        $scope.shownClasses = function () {
          if (!Array.isArray($scope.shown) || !$scope.shown.length) { return ''; }
          return $scope.shown.map(function (part) {
            return 'show-' + part;
          }).join(' ');
        };
        $scope.$watch('shown', function () {
          element
            .removeClass('show-type show-name show-value')
            .addClass($scope.shownClasses());
        });


        function validate() {
          if (!$scope.variable.name || !$scope.variable.type) {
            $scope.valid = false;
          }
          else if ($scope.variable.value === null || $scope.variable.type === 'String') {
            $scope.valid = true;
          }
          else {
            $scope.valid = typeUtils.isType($scope.variable.value, $scope.variable.type);
          }
        }
        $scope.valid = true;
        $scope.$watch('variable.value', validate);
        $scope.$watch('variable.name', validate);
        $scope.$watch('variable.type', validate);
        validate();

        // backup is used to recover a variable value
        // from either type or null switch
        var backup = $scope.variable.value;

        $scope.$watch('variable.type', function (yet, before) {
          // convert the value to boolean when the type becomes Boolean
          if (yet === 'Boolean') {
            // we don't do anything if the value is null
            if ($scope.variable.value !== null) {
              backup = $scope.variable.value;

              $scope.variable.value = $scope.variable.value === 'false' ?
                                      false :
                                      !!$scope.variable.value;
            }
          }
          else if (before === 'Boolean') {
            $scope.variable.value = backup;
          }
        });

        $scope.isNull = function () {
          return $scope.variable.value === null;
        };
        $scope.setNonNull = function () {
          $scope.variable.value = backup || defaultValues[$scope.variable.type];
        };
        $scope.setNull = function () {
          backup = $scope.variable.value;
          $scope.variable.value = null;
        };

        $scope.editVariableValue = function () {
          $modal.open({
            template: templateDialog,

            controller: modalCtrl,

            windowClass: 'cam-widget-variable-dialog',

            resolve: {
              variable: function () { return $scope.variable; }
            }
          });
        };
      }
    };
  }];
});
