(function() {
  var app;

  $(function() {
    $("select").material_select();
    return $("select[name='type']").on("change", function() {
      return $("select").material_select();
    });
  });

  app = angular.module("unitConverter", []);

  app.controller("mainController", function($scope) {
    $scope.units = {
      "Distance": {
        "Kilometer": 1000,
        "Meter": 1,
        "Centimeter": 0.01,
        "Milimeter": 0.001,
        "Mile": 1609.34,
        "Inch": 0.0254,
        "Yard": 0.9144,
        "Foot": 0.3048,
        "Nautical Mile": 1852
      },
      "Mass": {
        "Ton": 1000000,
        "Kilogram": 1000,
        "Gram": 1,
        "Miligram": 0.001,
        "US ton": 907185,
        "Stone": 6350.29,
        "Pound": 453.592,
        "Ounce": 28.3495
      }
    };
    $scope.value = 1;
    $scope.from = "Mile";
    $scope.to = "Kilometer";
    $scope.type = "Distance";
    $.getJSON("http://api.fixer.io/latest", function(data) {
      var obj;
      obj = data.rates;
      obj[data.base] = 1;
      Object.keys(obj).sort();
      $scope.units["Currency"] = obj;
      $scope.type = "Currency";
      $scope.typeChanged();
      return $("select[name='type']").trigger("change");
    }).fail(function() {
      return $scope.currStatus = "Sorry, but we couldn't get the currencies data";
    });
    $scope.Utils = {
      keys: Object.keys,
      round: function(n, dec) {
        if (n) {
          return Number(n).toFixed(dec);
        } else {
          return $scope.convert();
        }
      }
    };
    $scope.typeChanged = function() {
      $scope.value = 1;
      $scope.from = Object.keys($scope.units[$scope.type])[0];
      $scope.to = Object.keys($scope.units[$scope.type])[1];
      $scope.convert();
      return void 0;
    };
    $scope.convert = function() {
      var from, result, to;
      from = $scope.units[$scope.type][$scope.from];
      to = $scope.units[$scope.type][$scope.to];
      if ($scope.type !== "Currency") {
        result = Number($scope.value) * from / to;
      } else {
        result = Number($scope.value) / from * to;
      }
      $scope.result = result;
      return void 0;
    };
    return void 0;
  });

}).call(this);

