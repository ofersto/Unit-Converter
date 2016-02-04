(function() {
  var app, getKeyByValue, storage;

  storage = localStorage;

  getKeyByValue = function(obj, value) {
    var i, key, len, ref;
    ref = Object.keys(obj);
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      if (obj[key] === value) {
        return key;
      }
    }
    return void 0;
  };

  app = angular.module("unitConverter", []);

  app.controller("mainController", function($scope) {
    var getCurrData, units;
    if (storage.units) {
      units = storage.units;
      $scope.units = JSON.parse(units);
    } else {
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
      storage.units = JSON.stringify($scope.units);
    }
    $scope.value = storage.value ? Number(storage.value) : 1;
    $scope.type = storage.type ? storage.type : "Distance";
    $scope.from = storage.from ? storage.from : $scope.from = Object.keys($scope.units[$scope.type])[0];
    $scope.to = storage.to ? storage.to : $scope.from = Object.keys($scope.units[$scope.type])[1];
    getCurrData = function() {
      var d, m, now, nowStr, y;
      now = new Date();
      d = now.getDate();
      m = now.getMonth() + 1;
      y = now.getFullYear();
      if (d < 10) {
        d = '0' + d;
      }
      if (m < 10) {
        m = '0' + m;
      }
      nowStr = y + "-" + m + "-" + d;
      if (storage.currDate !== nowStr) {
        console.log("get currencies data");
        return $.getJSON("http://api.fixer.io/latest").done(function(data) {
          var obj;
          obj = data.rates;
          obj[data.base] = 1;
          Object.keys(obj).sort();
          $scope.units["Currency"] = obj;
          storage.units = JSON.stringify($scope.units);
          storage.currDate = data.date;
          console.log("Got currencies data successfully");
          return $("select[name='type']").trigger("change");
        }).fail(function() {
          return $scope.currStatus = "Sorry, but we couldn't get the currencies data";
        });
      }
    };
    getCurrData();
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
      storage.type = $scope.type;
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
      storage.value = $scope.value;
      storage.from = getKeyByValue($scope.units[$scope.type], from);
      storage.to = getKeyByValue($scope.units[$scope.type], to);
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

  $(function() {
    $("select").material_select();
    return $("select[name='type']").on("change", function() {
      return $("select").material_select();
    });
  });

}).call(this);

